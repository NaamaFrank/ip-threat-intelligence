import { http } from '../utils/http';
import { codeToCountry } from '../utils/locale';

export type ProviderResult =
  | { ok: true; data: { abuseScore: number; recentReports: number, hostname?: string, isp: string, country: string|null } }
  | { ok: false; warning: string };

export async function fetchAbuseIPDB(ip: string): Promise<ProviderResult> {
  const url = `https://api.abuseipdb.com/api/v2/check?ipAddress=${encodeURIComponent(ip)}&maxAgeInDays=90`;
  try {
    const res = await http.get(url, {
      headers: { Accept: 'application/json', Key: process.env.ABUSEIPDB_KEY as string }
    });
    const d = res.data?.data ?? {};

    return {
      ok: true,
      data: {
        abuseScore: Number(d.abuseConfidenceScore ?? 0),
        recentReports: Number(d.totalReports ?? 0),
        hostname: (Array.isArray(d.hostnames) && d.hostnames.length ? d.hostnames[0] : null) || d.domain || null,
        isp: d.isp ?? null,
        country: codeToCountry(d.countryCode ?? null),
      }
    };
  } catch (e: any) {
    console.warn('AbuseIPDB error:', e?.response?.status, e?.response?.data);
    const status = e?.response?.status;
    return { ok: false, warning: status === 429 ? 'abuseipdb_rate_limited' : 'abuseipdb_error' };
  }
}
