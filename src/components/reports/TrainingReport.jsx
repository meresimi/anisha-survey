import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend } from 'recharts'
import { ReportCard, SummaryBox, StatRow, MetricGrid, Metric, AlertBox } from './ReportCard'
import { BookOpen } from 'lucide-react'

const COLORS = ['#2e7d32','#c62828','#f57c00']

export default function TrainingReport({ data }) {
  if (!data) return null
  const gapPct = data.saidYesCount > 0 ? Math.round((data.validationGap / data.saidYesCount) * 100) : 0

  const radialData = [
    { name: 'Trained', value: data.trainingStatus.find(t=>t.name==='Received Training')?.pct||0, fill: '#2e7d32' },
    { name: 'Untrained', value: data.trainingStatus.find(t=>t.name==='No Training')?.pct||0, fill: '#c62828' },
  ]

  return (
    <>
      <ReportCard accent="#2e7d32">
        <MetricGrid>
          <Metric label="Received Training" value={`${data.trainingStatus.find(t=>t.name==='Received Training')?.pct||0}%`} sub="of respondents" color="#2e7d32" />
          <Metric label="Avg. Knowledge Rating" value={data.avgKnowledgeRating} sub="out of 5" color="#1a6b8a" />
          <Metric label="Validation Gap" value={data.validationGap} sub="said Yes but couldn't describe" color="#c62828" />
        </MetricGrid>
      </ReportCard>

      <SummaryBox icon={BookOpen} text={data.summary} />

      <AlertBox type="info">
        📋 <strong>Interpretation:</strong> Based on Anisa's hypothesis, inadequate training is a primary <em>cause</em> of improper waste disposal. If training rates are below 70%, this directly supports the hypothesis. The validation gap reveals how many staff may have answered "Yes" to training due to social desirability — a key bias risk in self-reported surveys.
      </AlertBox>

      {gapPct > 30 && (
        <AlertBox type="danger">
          ⚠️ <strong>Social Desirability Bias Detected:</strong> {gapPct}% of staff who claimed training could not describe correct disposal procedures — their "Yes" may not reflect actual knowledge.
        </AlertBox>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Pie chart */}
        <ReportCard title="Training Status — Pie Chart" accent="#2e7d32">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.trainingStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, pct }) => `${pct}%`}>
                {data.trainingStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ReportCard>

        {/* Radial bar */}
        <ReportCard title="Training vs No Training — Radial" accent="#2e7d32">
          <ResponsiveContainer width="100%" height={220}>
            <RadialBarChart cx="50%" cy="50%" innerRadius={40} outerRadius={90} data={radialData} startAngle={180} endAngle={0}>
              <RadialBar dataKey="value" label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${v}%`]} />
            </RadialBarChart>
          </ResponsiveContainer>
        </ReportCard>
      </div>

      {/* Knowledge bar chart */}
      <ReportCard title="Self-Rated Knowledge Distribution (1=No Knowledge → 5=Expert)" accent="#2e7d32">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.knowledgeDistribution} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <XAxis dataKey="score" tick={{ fontSize: 13 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" radius={[6,6,0,0]} name="Respondents" label={{ position: 'top', fontSize: 12 }}>
              {data.knowledgeDistribution.map((e, i) => (
                <Cell key={i} fill={e.score <= '2' ? '#c62828' : e.score === '3' ? '#f57c00' : '#2e7d32'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.5 }}>
          A concentration of ratings at 1–2 confirms the hypothesis that training inadequacy is widespread at Honiara Referral Hospital.
        </p>
      </ReportCard>

      {/* Protocol familiarity horizontal bar */}
      <ReportCard title="Protocol Familiarity — Horizontal Bar" accent="#2e7d32">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
          {data.familiarity.map((f, i) => (
            <StatRow key={f.name} label={f.name} value={f.value} pct={f.pct} color={COLORS[i]} />
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12, lineHeight: 1.5 }}>
          High "Not familiar" rates indicate protocols are not being communicated or enforced consistently — supporting the weak enforcement element of the hypothesis.
        </p>
      </ReportCard>
    </>
  )
}
