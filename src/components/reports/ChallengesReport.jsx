import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid } from 'recharts'
import { ReportCard, SummaryBox, MetricGrid, Metric, AlertBox } from './ReportCard'
import { Settings } from 'lucide-react'

const COLORS = ['#c62828','#e65100','#f57c00','#1a6b8a','#2e7d32','#6a1b9a']

export default function ChallengesReport({ data }) {
  if (!data) return null

  // Line chart data — rating distribution as a trend
  const lineData = data.facilityRatingDistribution.map(d => ({
    rating: `Rating ${d.score}`,
    count: d.count
  }))

  return (
    <>
      <ReportCard accent="#e65100">
        <MetricGrid>
          <Metric label="Avg. Facility Rating" value={`${data.facilityRatingAvg}/5`} sub="waste management score" color={Number(data.facilityRatingAvg) < 3 ? '#c62828' : '#2e7d32'} />
          <Metric label="Top Challenge" value="#1" sub={data.topChallenges[0]?.name?.split('(')[0]?.trim() || 'N/A'} color="#e65100" />
          <Metric label="Top Recommendation" value="#1" sub={data.topRecommendations[0]?.name?.split('(')[0]?.trim() || 'N/A'} color="#1a6b8a" />
        </MetricGrid>
      </ReportCard>

      <SummaryBox icon={Settings} text={data.summary} />

      <AlertBox type="info">
        📋 <strong>Interpretation (Challenges):</strong> This report directly answers Anisa's third research question — "What improvements can be made?" The facility rating distribution reveals how staff perceive the current system, while the challenges ranking identifies which of the three hypothesis causes (training, infrastructure, enforcement) staff themselves see as most critical. The recommendations become the foundation for Anisa's policy implications section.
      </AlertBox>

      {/* Facility rating — line chart showing distribution shape */}
      <ReportCard title="Facility Rating Distribution — Line Chart" accent="#e65100">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={lineData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="rating" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#e65100" strokeWidth={3} dot={{ r: 6, fill: '#e65100' }} name="Respondents" label={{ position: 'top', fontSize: 12, fill: '#e65100' }} />
          </LineChart>
        </ResponsiveContainer>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.5 }}>
          A curve peaking at 1–2 indicates staff strongly rate their facility as poor — direct evidence that infrastructure is insufficient. Average below 3.0 confirms the hypothesis.
        </p>
      </ReportCard>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Challenges — coloured bar chart */}
        <ReportCard title="Top Challenges — Ranked Bar" accent="#e65100">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.topChallenges.slice(0,6)} layout="vertical" margin={{ top: 0, right: 30, left: 185, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={185} />
              <Tooltip formatter={(v)=>[v,'Respondents']} />
              <Bar dataKey="value" radius={[0,6,6,0]} label={{ position: 'right', fontSize: 11 }}>
                {data.topChallenges.slice(0,6).map((_, i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ReportCard>

        {/* Recommendations — coloured bar chart */}
        <ReportCard title="Top Recommendations — Ranked Bar" accent="#e65100">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.topRecommendations.slice(0,6)} layout="vertical" margin={{ top: 0, right: 30, left: 185, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={185} />
              <Tooltip formatter={(v)=>[v,'Respondents']} />
              <Bar dataKey="value" radius={[0,6,6,0]} label={{ position: 'right', fontSize: 11 }}>
                {data.topRecommendations.slice(0,6).map((_, i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ReportCard>
      </div>
    </>
  )
}
