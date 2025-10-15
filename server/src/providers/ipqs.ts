import { http } from '../utils/http';
import { codeToCountry } from '../utils/locale';

export type ProviderResult =
  | { ok: true; data: { vpnOrProxy: boolean; isp: string|null; country: string|null; hostname: string|null; threatScore: number } }
  | { ok: false; warning: string; detail?: string };


export async function fetchIPQS(ip: string): Promise<ProviderResult> {
  const key = process.env.IPQS_KEY as string;
  const url = `https://ipqualityscore.com/api/json/ip/${key}/${encodeURIComponent(ip)}`;
  try {
    const res = await http.get(url);
    const d = res.data ?? {};

    if (d.success === false) {
        console.log('IPQS error:', d.message || 'unknown');  
        return { ok: false, warning: 'ipqs_error', detail: d.message || 'unknown' };
    }
    return {
      ok: true,
      data: {
        vpnOrProxy: Boolean(d.proxy || d.vpn || d.tor),
        isp: d.ISP ?? d.organization ?? null,
        country: codeToCountry(d.country_code ?? null),
        hostname: d.host ?? null,
        threatScore: Number(d.fraud_score ?? 0)
      }
    };
  } catch (e: any) {
    console.warn('IPQS error:', e?.response?.status, e?.response?.data);
    const status = e?.response?.status;
    return { ok: false, warning: status === 429 ? 'ipqs_rate_limited' : 'ipqs_error' };
  }
}
