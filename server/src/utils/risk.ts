export function computeOverallRisk({
  abuseScore,
  threatScore,
  vpnOrProxy
}: { abuseScore: number; threatScore: number; vpnOrProxy: boolean }): 'Low'|'Medium'|'High' {
  const score = abuseScore * 0.6 + threatScore * 0.4 + (vpnOrProxy ? 15 : 0);
  if (score >= 70) return 'High';
  if (score >= 35) return 'Medium';
  return 'Low';
}
