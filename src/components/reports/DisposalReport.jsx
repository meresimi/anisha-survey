import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { ReportCard, SummaryBox, StatRow, MetricGrid, Metric, AlertBox } from './ReportCard'
import { Wind } from 'lucide-react'
const COLORS = ['#c62828','#2e7d32','#f57c00','#1a6b8a']
export default function DisposalReport({ data }) {
  if (!data) return null
  const burningYes = data.burningPractice.find(b=>b.name==='Yes')
  return (
    <>
      <ReportCard accent="#6a1b9a">
        <MetricGrid>
          <Metric label="Use Burning/Incineration"     value={`${burningYes?.pct||0}%`} sub="confirmed open burning"   color="#c62828"/>
          <Metric label="Observed Respiratory Symptoms" value={`${data.respiratorySymptoms.yesPct}%`} sub="in staff/community" color="#6a1b9a"/>
          <Metric label="Very Concerned About Air Risk"  value={`${data.safetyConcern.find(s=>s.name==='Very concerned')?.pct||0}%`} sub="of respondents" color="#e65100"/>
        </MetricGrid>
      </ReportCard>
      <SummaryBox icon={Wind} text={data.summary}/>
      <AlertBox type="info">📋 <b>Hypothesis link:</b> {data.hypothesisLink} No proper incinerator → open burning → toxic smoke (dioxins, particulate matter) → respiratory symptoms in staff and community. The proximity data shows how close this harm is to residential areas.</AlertBox>
      {(burningYes?.pct||0) > 50 && <AlertBox type="danger">⚠️ Over half confirmed open-air burning, significantly increasing exposure to toxic air pollutants including dioxins, furans, and particulate matter.</AlertBox>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <ReportCard title="Burning / Incineration Practice" accent="#6a1b9a">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data.burningPractice} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({name,pct})=>`${name} ${pct}%`} fontSize={10}>
                {data.burningPractice.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Pie><Tooltip/>
            </PieChart>
          </ResponsiveContainer>
        </ReportCard>
        <ReportCard title="Proximity to Nearest Residential Area" accent="#6a1b9a">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.proximityToCommunity} margin={{top:10,right:20,left:0,bottom:30}}>
              <XAxis dataKey="name" tick={{fontSize:9}} angle={-20} textAnchor="end" interval={0}/><YAxis tick={{fontSize:11}} allowDecimals={false}/><Tooltip/>
              <Bar dataKey="value" radius={[4,4,0,0]} name="Respondents" label={{position:'top',fontSize:11}}>
                {data.proximityToCommunity.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ReportCard>
      </div>
      <ReportCard title="Air Pollution Concern Level" accent="#6a1b9a">
        <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:8}}>
          {data.safetyConcern.map((s,i)=>(<StatRow key={s.name} label={s.name} value={s.value} pct={s.pct} color={COLORS[i%COLORS.length]}/>))}
        </div>
      </ReportCard>
      <ReportCard title="Respiratory Symptoms Observed" accent="#6a1b9a">
        <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:8}}>
          <StatRow label="Observed symptoms in staff/community" value={data.respiratorySymptoms.yes} pct={data.respiratorySymptoms.yesPct} color="#c62828"/>
          <StatRow label="No symptoms observed" value={data.respiratorySymptoms.no} pct={100-data.respiratorySymptoms.yesPct} color="#2e7d32"/>
        </div>
      </ReportCard>
    </>
  )
}
