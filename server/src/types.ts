export type UnifiedIntel = {
  ip: string;
  hostname?: string | null;
  isp?: string | null;
  country?: string | null;
  abuseScore?: number;      
  recentReports?: number;   
  vpnOrProxy?: boolean;
  threatScore?: number;    
  overallRisk?: 'Low' | 'Medium' | 'High';
  warnings?: string[];
};
