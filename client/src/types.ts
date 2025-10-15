export type RiskLevel = 'Low' | 'Medium' | 'High'

export interface IpIntelResponse {
  ip: string
  hostname?: string
  isp: string
  country: string | null
  abuseScore: number
  recentReports: number
  vpnOrProxy: boolean | null
  threatScore?: number | null;
  overallRisk?: RiskLevel;
  warnings?: string[];
}

