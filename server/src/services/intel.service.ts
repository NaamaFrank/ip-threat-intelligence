import { fetchAbuseIPDB, type ProviderResult as AbuseResult } from '../providers/abuseipdb';
import { fetchIPQS, type ProviderResult as IpqsResult }   from '../providers/ipqs';
import { computeOverallRisk } from '../utils/risk';
import type { UnifiedIntel } from '../types';

type AbuseData = Extract<AbuseResult, { ok: true }>['data'];
type IpqsData  = Extract<IpqsResult,  { ok: true }>['data'];

// prefer value from `primary`, otherwise take from `fallback`
function preferFields<T extends object>(
  target: T,
  primary: Partial<T> | undefined,
  fallback: Partial<T> | undefined,
  keys: (keyof T)[]
) {
  for (const k of keys) {
    const v1 = primary?.[k];
    const v2 = fallback?.[k];
    if (v1 !== undefined && v1 !== null) (target as any)[k] = v1;
    else if (v2 !== undefined && v2 !== null) (target as any)[k] = v2;
  }
}

export async function getIntel(ip: string): Promise<UnifiedIntel> {
  const [abuseSettled, ipqsSettled] = await Promise.allSettled([
    fetchAbuseIPDB(ip),
    fetchIPQS(ip),
  ]);

  const result: UnifiedIntel = { ip };
  const warnings: string[] = [];

  let abuseData: AbuseData | undefined;
  let ipqsData:  IpqsData  | undefined;

  // AbuseIPDB
  if (abuseSettled.status === 'fulfilled') {
    const v: AbuseResult = abuseSettled.value;
    if (v.ok) abuseData = v.data;
    else warnings.push(v.warning);
  } else {
    warnings.push('abuseipdb_error');
  }

  // IPQS
  if (ipqsSettled.status === 'fulfilled') {
    const v: IpqsResult = ipqsSettled.value;
    if (v.ok) ipqsData = v.data;
    else warnings.push(v.warning);
  } else {
    warnings.push('ipqs_error');
  }

  // Abuse-only fields: Abuse Score, Recent Reports
  if (abuseData) {
    result.abuseScore = abuseData.abuseScore;
    result.recentReports = abuseData.recentReports;
  }

  // Overlapping fields (prefer IPQS; fallback to Abuse):
  // hostname, isp, country
  preferFields(
    result,
    ipqsData,
    abuseData,
    ['hostname', 'isp', 'country']
  );

  // IPQS-only: VPN/Proxy, Threat Score
  if (ipqsData) {
    result.vpnOrProxy  = ipqsData.vpnOrProxy;
    result.threatScore = ipqsData.threatScore;
  }

  // Derive overall risk
  result.overallRisk = computeOverallRisk({
    abuseScore: result.abuseScore ?? 0,
    threatScore: result.threatScore ?? 0,
    vpnOrProxy: !!result.vpnOrProxy,
  });

  if (warnings.length) result.warnings = warnings;
  return result;
}
