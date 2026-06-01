import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { ReportCard, SummaryBox, StatRow, MetricGrid, Metric, AlertBox } from './ReportCard'
import { Wind } from 'lucide-react'

const COLORS = ['#c62828','#2e7d32','#f57c00','#1a6b8a']

export default function DisposalReport({ data }) {
  if (!data) return null
  const burningYes = data.burningPractice.find(b => b.name === 'Yes')

  return (
    <>
      <ReportCard accent="#6a1b9a">
        <MetricGrid>
          <Metric label="Use Burning/Incineration" value={`${burningYes?.pct || 0}%`} sub="of respondents" color="#c62828" />
          <Metric label="Observed Respiratory Symptoms" value={`${data.respiratorySymptoms.yesPct}%`} sub="of respondents" color="#6a1b9a" />
          <Metric label="Very Concerned About Air Risk" value={`${data.safetyConcern.find(s=>s.name==='Very concerned')?.pct||0}%`} sub="of respondents" color="#e65100" />
        </MetricGrid>
      </ReportCard>

      <SummaryBox icon={Wind} text={data.summary} />

      {(burningYes?.pct || 0) > 50 && (
        <AlertBox type="danger">
          ⚠️ Over half of respondents confirmed open-air burning or incineration is practiced, significantly increasing exposure to toxic air pollutants including dioxins and particulate matter.
        </AlertBox>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <ReportCard title="Burning / Incineration Practice" accent="#6a1b9a">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data.burningPractice} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, pct }) => `${name} ${pct}%`} fontSize={11}>
                {data.burningPractice.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ReportCard>

        <ReportCard title="Air Pollution Concern Level" accent="#6a1b9a">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
            {data.safetyConcern.map((s, i) => (
              <StatRow key={s.name} label={s.name} value={s.value} pct={s.pct} color={COLORS[i]} />
            ))}
          </div>
        </ReportCard>
      </div>

      {data.burningFrequency.length > 0 && (
        <ReportCard title="Burning Frequency (among those who confirmed burning)" accent="#6a1b9a">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data.burningFrequency} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#6a1b9a" radius={[4,4,0,0]} name="Respondents" label={{ position: 'top', fontSize: 12 }} />
            </BarChart>
          </ResponsiveContainer>
        </ReportCard>
      )}

      <ReportCard title="Respiratory Symptoms Observed" accent="#6a1b9a">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          <StatRow label="Observed symptoms in staff/community" value={data.respiratorySymptoms.yes} pct={data.respiratorySymptoms.yesPct} color="#c62828" />
          <StatRow label="No symptoms observed" value={data.respiratorySymptoms.no} pct={100 - data.respiratorySymptoms.yesPct} color="#2e7d32" />
        </div>
      </ReportCard>
    </>
  )
}
