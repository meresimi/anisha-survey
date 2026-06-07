import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts'
import { ReportCard, SummaryBox, StatRow, MetricGrid, Metric, AlertBox } from './ReportCard'
import { FileText } from 'lucide-react'
const COLORS = ['#2e7d32','#c62828','#f57c00']
export default function PolicyReport({ data }) {
  if (!data) return null
  const knowsPct = data.saidYesReg>0 ? Math.round((data.canNameRegulation/data.saidYesReg)*100) : 0
  const wantsStricter = data.stricterEnforcement.find(s=>s.name==='Yes')
  return (
    <>
      <ReportCard accent="#37474f">
        <MetricGrid>
          <Metric label="Believe Regulations Exist" value={`${data.govRegulations.find(g=>g.name==='Yes')?.pct||0}%`} sub="of respondents" color="#2e7d32"/>
          <Metric label="Can Name a Regulation"     value={`${knowsPct}%`} sub="of those who said Yes" color="#c62828"/>
          <Metric label="Received Policy Comms"     value={`${data.policyCommPct}%`} sub="in past 12 months" color="#e65100"/>
          <Metric label="Want Stricter Enforcement" value={`${wantsStricter?.pct||0}%`} sub="of respondents" color="#37474f"/>
        </MetricGrid>
      </ReportCard>
      <SummaryBox icon={FileText} text={data.summary}/>
      <AlertBox type="info">📋 <b>Hypothesis link:</b> {data.hypothesisLink} Two validation gaps prove weak enforcement: (1) staff who say regulations exist but cannot name one, and (2) staff who never received any policy communication. Both gaps confirm regulations exist only on paper.</AlertBox>
      {data.regulationKnowledgeGap > 0 && <AlertBox type="warning">⚠️ <b>Policy Awareness Gap:</b> {data.regulationKnowledgeGap} respondents said regulations exist but could not name a single one. And only {data.policyCommPct}% received any policy communication in the past 12 months — regulations are invisible to frontline staff.</AlertBox>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <ReportCard title="Sufficient Government Regulations?" accent="#37474f">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data.govRegulations} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({name,pct})=>`${name} ${pct}%`} fontSize={10}>
                {data.govRegulations.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Pie><Tooltip/>
            </PieChart>
          </ResponsiveContainer>
        </ReportCard>
        <ReportCard title="Policy Communication in Past 12 Months" accent="#37474f">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data.policyCommunicated} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({name,pct})=>`${name} ${pct}%`} fontSize={10}>
                {data.policyCommunicated.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Pie><Tooltip/>
            </PieChart>
          </ResponsiveContainer>
        </ReportCard>
      </div>
      <ReportCard title="Regulation Knowledge Validation" accent="#37474f">
        <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:8}}>
          <StatRow label="Said regulations exist" value={data.saidYesReg} pct={Math.round((data.saidYesReg/data.total)*100)} color="#2e7d32"/>
          <StatRow label="Could actually name a regulation" value={data.canNameRegulation} pct={knowsPct} color="#c62828"/>
          <StatRow label="Knowledge gap" value={data.regulationKnowledgeGap} pct={data.saidYesReg>0?100-knowsPct:0} color="#f57c00"/>
        </div>
      </ReportCard>
    </>
  )
}
