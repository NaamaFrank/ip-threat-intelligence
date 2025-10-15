import React from 'react'
import type { IpIntelResponse } from '../types'

type Props = { data: IpIntelResponse }

export default function ResultCard({ data }: Props) {
  const risk = data.overallRisk;
  const riskClass = risk === 'High' ? 'risk-high' : risk === 'Medium' ? 'risk-med' : 'risk-low'

  return (
    <div className="card" aria-live="polite" aria-label="Result">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div className="title">
          <span>Threat Intelligence</span>
          <span className={`badge ${riskClass}`}>Overall Risk: {risk}</span>
        </div>
      </div>

      <div className="divider" />

      <div className="grid" role="table">
        <div className="card" role="row">
          <div className="kv">
            <span className="muted">IP address</span><span>{data.ip}</span>
            <span className="muted">Hostname</span><span>{data.hostname ?? '—'}</span>
            <span className="muted">ISP</span><span>{data.isp ?? '—'}</span>
            <span className="muted">Country</span><span>{data.country ?? '—'}</span>
          </div>
        </div>

        <div className="card" role="row">
          <div className="kv">
            <span className="muted">Abuse Score</span><span>{data.abuseScore}</span>
            <span className="muted">Recent Reports</span><span>{data.recentReports}</span>
            <span className="muted">VPN/Proxy Detected</span><span>{data.vpnOrProxy ? 'Yes' : 'No'}</span>
            <span className="muted">Threat Score</span><span>{data.threatScore ?? '—'}</span>
          </div>
        </div>
      </div>

      <div className="divider" />
      <div className="small muted">Risk is indicative only; verify before acting.</div>
    </div>
  )
}
