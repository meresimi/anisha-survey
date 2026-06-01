import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { ReportCard, SummaryBox, StatRow, MetricGrid, Metric, AlertBox } from './ReportCard'
import { FileText } from 'lucide-react'

const COLORS = ['#2e7d32','#c62828','#f57c00']

export default function PolicyReport({ data }) {
  if (!data) return null
  const knowsRegPct = data.saidYesReg > 0 ? Math.round((data.canNameRegulation / data.saidYesReg) * 100) : 0
  const wantsStricter = data.stricterEnforcement.find(s => s.name === 'Yes')

  return (
    <>
      <ReportCard accent="#37474f">
        <MetricGrid>
          <Metric label="Believe Regulations Exist" value={`${data.govRegulations.find(g=>g.name==='Yes')?.pct||0}%`} sub="of respondents" color="#2e7d32" />
          <Metric label="Can Name a Regulation" value={`${knowsRegPct}%`} sub="of those who said Yes" color="#c62828" />
          <Metric label="Want Stricter Enforcement" value={`${wantsStricter?.pct||0}%`} sub="of respondents" color="#37474f" />
        </MetricGrid>
      </ReportCard>

      <SummaryBox icon={FileText} text={data.summary} />

      {data.regulationKnowledgeGap > 0 && (
        <AlertBox type="warning">
          ⚠️ <strong>Policy Awareness Gap:</strong> {data.regulationKnowledgeGap} respondent(s) said regulations exist but could not name a single one. This suggests regulations are not being communicated or enforced in ways visible to frontline staff.
        </AlertBox>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <ReportCard title="Are Government Regulations Sufficient?" accent="#37474f">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.govRegulations} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, pct }) => `${name} ${pct}%`} fontSize={11}>
                {data.govRegulations.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ReportCard>

        <ReportCard title="Would Stricter Enforcement Help?" accent="#37474f">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.stricterEnforcement} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, pct }) => `${name} ${pct}%`} fontSize={11}>
                {data.stricterEnforcement.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ReportCard>
      </div>

      <ReportCard title="Regulation Knowledge Validation" accent="#37474f">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
          <StatRow label="Said regulations exist" value={data.saidYesReg} pct={Math.round((data.saidYesReg/data.total)*100)} color="#2e7d32" />
          <StatRow label="Could actually name a regulation" value={data.canNameRegulation} pct={knowsRegPct} color="#c62828" />
          <StatRow label="Knowledge gap (said Yes but couldn't name one)" value={data.regulationKnowledgeGap} pct={data.saidYesReg > 0 ? 100 - knowsRegPct : 0} color="#f57c00" />
        </div>
      </ReportCard>
    </>
  )
}
