import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { ReportCard, SummaryBox, MetricGrid, Metric, AlertBox } from './ReportCard'
import { BarChart3 } from 'lucide-react'

export default function CompositeReport({ data }) {
  if (!data) return null

  const radarData = data.dimensions.map(d => ({ subject: d.name, score: d.score, fullMark: 100 }))
  const riskType = data.overallRisk.level.includes('High') ? 'danger' : data.overallRisk.level.includes('Moderate') ? 'warning' : 'success'

  return (
    <>
      <ReportCard accent={data.overallRisk.color}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 80, lineHeight: 1, color: data.overallRisk.color }}>
              {data.overallScore}
            </div>
            <div style={{ fontSize: 16, color: 'var(--text-muted)' }}>out of 100</div>
            <div style={{ marginTop: 10, background: data.overallRisk.color, color: 'white', borderRadius: 20, padding: '5px 16px', fontSize: 13, fontWeight: 700, display: 'inline-block' }}>
              {data.overallRisk.level}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            {data.dimensions.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ fontSize: 13, width: 160, color: 'var(--text)' }}>{d.name}</div>
                <div style={{ flex: 1, height: 10, background: 'var(--border)', borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${d.score}%`, background: d.color, borderRadius: 5, transition: 'width 0.8s ease' }} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: d.color, width: 40, textAlign: 'right' }}>{d.score}%</div>
                <div style={{ fontSize: 11, color: 'white', background: d.color, borderRadius: 10, padding: '1px 8px', whiteSpace: 'nowrap' }}>{d.level}</div>
              </div>
            ))}
          </div>
        </div>
      </ReportCard>

      <AlertBox type={riskType}>
        <strong>Hypothesis Verdict:</strong> {data.summary}
      </AlertBox>

      <ReportCard title="Risk Profile — Radar Chart" accent={data.overallRisk.color}>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius={110} data={radarData}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: 'var(--text)' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Radar name="Score" dataKey="score" stroke={data.overallRisk.color} fill={data.overallRisk.color} fillOpacity={0.25} strokeWidth={2} />
            <Tooltip formatter={(v) => [`${v}%`, 'Score']} />
          </RadarChart>
        </ResponsiveContainer>
        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
          Higher scores indicate better performance / lower risk
        </div>
      </ReportCard>

      <ReportCard title="Dimension Score Breakdown" accent={data.overallRisk.color}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
          {data.dimensions.map(d => (
            <div key={d.name} style={{ background: 'var(--cream)', borderRadius: 10, padding: '16px 14px', textAlign: 'center', borderTop: `3px solid ${d.color}` }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: d.color }}>{d.score}%</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{d.name}</div>
              <div style={{ marginTop: 8, background: d.color, color: 'white', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700, display: 'inline-block' }}>{d.level}</div>
            </div>
          ))}
        </div>
      </ReportCard>
    </>
  )
}
