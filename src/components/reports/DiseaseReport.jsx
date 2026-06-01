import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid } from 'recharts'
import { ReportCard, SummaryBox, StatRow, MetricGrid, Metric, AlertBox } from './ReportCard'
import { AlertTriangle } from 'lucide-react'

const FREQ_COLORS = { 'Daily':'#c62828','Several times a week':'#e65100','Once a week':'#f57c00','Rarely':'#2e7d32','Never':'#1a6b8a' }
const PIE_COLORS = ['#c62828','#2e7d32','#f57c00']

export default function DiseaseReport({ data }) {
  if (!data) return null
  const dailyOrWeekly = data.wasteEncounterFrequency.filter(f=>['Daily','Several times a week','Once a week'].includes(f.name)).reduce((a,b)=>a+b.value,0)
  const dailyPct = Math.round((dailyOrWeekly / data.total) * 100)

  // Build cumulative exposure data for area chart
  const freqOrder = ['Daily','Several times a week','Once a week','Rarely','Never']
  const areaData = freqOrder.map(name => ({
    name: name.replace('Several times a week','Several/week'),
    value: data.wasteEncounterFrequency.find(f=>f.name===name)?.value || 0
  }))

  return (
    <>
      <ReportCard accent="#c62828">
        <MetricGrid>
          <Metric label="Reported Incidents" value={data.incidents.find(i=>i.name==='Yes')?.value||0} sub="disease exposure events" color="#c62828" />
          <Metric label="Unreported Incidents" value={data.unreportedIncidents} sub="not formally logged" color="#e65100" />
          <Metric label="Encounter Waste Regularly" value={`${dailyPct}%`} sub="daily to weekly" color="#6a1b9a" />
        </MetricGrid>
      </ReportCard>

      <SummaryBox icon={AlertTriangle} text={data.summary} />

      <AlertBox type="info">
        📋 <strong>Interpretation (Disease Transmission):</strong> Anisa's literature review identifies HIV, tuberculosis, pneumonia, and influenza as key disease risks from improper waste. High rates of regular improper waste encounters among staff directly confirm the disease transmission risk element of the hypothesis. Any unreported incidents suggest the true risk is underestimated in official records.
      </AlertBox>

      {data.unreportedIncidents > 0 && (
        <AlertBox type="danger">
          ⚠️ <strong>Under-Reporting Alert:</strong> {data.unreportedIncidents} incident(s) involving disease exposure were never formally logged. Actual risk levels are likely higher than official records show.
        </AlertBox>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <ReportCard title="Improper Waste Encounter Frequency — Pie" accent="#c62828">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.wasteEncounterFrequency} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={85} paddingAngle={3} label={({ pct }) => `${pct}%`} fontSize={10}>
                {data.wasteEncounterFrequency.map((entry) => <Cell key={entry.name} fill={FREQ_COLORS[entry.name]||'#999'} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ReportCard>

        <ReportCard title="Reported Disease Incidents — Donut" accent="#c62828">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.incidents} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} label={({ name, pct }) => `${pct}%`} fontSize={11}>
                {data.incidents.map((_, i) => <Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ReportCard>
      </div>

      {/* Area chart — waste exposure frequency as trend */}
      <ReportCard title="Waste Encounter Frequency — Area Chart" accent="#c62828">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={areaData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c62828" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#c62828" stopOpacity={0.02}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#c62828" strokeWidth={2} fill="url(#redGrad)" name="Respondents" />
          </AreaChart>
        </ResponsiveContainer>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.5 }}>
          The area chart visualises how concentrated encounters are at the high-frequency end of the scale. A left-heavy curve confirms frequent exposure to improperly disposed waste.
        </p>
      </ReportCard>

      {/* Health risks horizontal bar */}
      <ReportCard title="Associated Health Risks — Horizontal Bar (Multiple Selection)" accent="#c62828">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.healthRisks} layout="vertical" margin={{ top: 0, right: 30, left: 220, bottom: 0 }}>
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={220} />
            <Tooltip formatter={(v)=>[v,'Respondents']} />
            <Bar dataKey="value" fill="#c62828" radius={[0,6,6,0]} label={{ position: 'right', fontSize: 11 }} />
          </BarChart>
        </ResponsiveContainer>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.5 }}>
          Cross-reference with Anisa's literature: HIV/hepatitis exposure from sharps, respiratory problems from burning, waterborne diseases from leachate contamination — all four risk categories from the proposal should appear here.
        </p>
      </ReportCard>
    </>
  )
}
