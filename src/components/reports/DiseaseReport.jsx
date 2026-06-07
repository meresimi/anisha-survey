import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid } from 'recharts'
import { ReportCard, SummaryBox, StatRow, MetricGrid, Metric, AlertBox } from './ReportCard'
import { AlertTriangle } from 'lucide-react'

const FREQ_COLORS = {'Daily':'#c62828','Several times a week':'#e65100','Once a week':'#f57c00','Rarely':'#2e7d32','Never':'#1a6b8a'}
const PIE_COLORS  = ['#c62828','#2e7d32','#f57c00']

export default function DiseaseReport({ data }) {
  if (!data) return null
  const areaData = ['Daily','Several times a week','Once a week','Rarely','Never'].map(name=>({
    name: name.replace('Several times a week','Several/wk'),
    value: data.wasteEncounterFrequency.find(f=>f.name===name)?.value||0
  }))

  return (
    <>
      <ReportCard accent="#c62828">
        <MetricGrid>
          <Metric label="Personal Sharps Injuries" value={`${data.personalSharpsInjury.pct}%`}     sub="in past 12 months"      color="#c62828"/>
          <Metric label="Injuries Not Reported"     value={data.sharpsNotReported}                   sub="no formal record"       color="#e65100"/>
          <Metric label="Reported Incidents"         value={data.incidents.find(i=>i.name==='Yes')?.value||0} sub="disease exposure events" color="#6a1b9a"/>
          <Metric label="Unreported Incidents"       value={data.unreportedIncidents}                sub="systemic under-reporting" color="#c62828"/>
        </MetricGrid>
      </ReportCard>

      <SummaryBox icon={AlertTriangle} text={data.summary}/>

      <AlertBox type="info">
        📋 <b>Hypothesis link:</b> {data.hypothesisLink} Personal sharps injuries are direct evidence — not perception. Unreported incidents prove the enforcement system is failing: events occur but no formal response follows.
      </AlertBox>

      {data.sharpsNotReported > 0 && (
        <AlertBox type="danger">
          ⚠️ <b>Critical Finding:</b> {data.sharpsNotReported} personal sharps injur{data.sharpsNotReported===1?'y':'ies'} in the past 12 months went unreported. This is direct evidence of both disease risk AND failed enforcement simultaneously.
        </AlertBox>
      )}

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <ReportCard title="Personal Sharps Injuries (Direct Evidence)" accent="#c62828">
          <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:8}}>
            <StatRow label="Suffered a sharps injury (Yes)" value={data.personalSharpsInjury.yes} pct={data.personalSharpsInjury.pct} color="#c62828"/>
            <StatRow label="Not reported to management" value={data.sharpsNotReported} pct={data.personalSharpsInjury.yes>0?Math.round((data.sharpsNotReported/data.personalSharpsInjury.yes)*100):0} color="#e65100"/>
          </div>
        </ReportCard>
        <ReportCard title="Reported Disease Exposure Incidents — Donut" accent="#c62828">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data.incidents} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} label={({name,pct})=>`${pct}%`} fontSize={10}>
                {data.incidents.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
              </Pie>
              <Tooltip/>
            </PieChart>
          </ResponsiveContainer>
        </ReportCard>
      </div>

      <ReportCard title="Frequency of Encountering Improper Waste — Area Chart" accent="#c62828">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={areaData} margin={{top:10,right:20,left:0,bottom:5}}>
            <defs>
              <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c62828" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#c62828" stopOpacity={0.02}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
            <XAxis dataKey="name" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}} allowDecimals={false}/>
            <Tooltip/>
            <Area type="monotone" dataKey="value" stroke="#c62828" strokeWidth={2} fill="url(#redGrad)" name="Respondents"/>
          </AreaChart>
        </ResponsiveContainer>
        <p style={{fontSize:12,color:'#64748b',marginTop:8,lineHeight:1.6}}>A left-heavy curve (high daily/weekly encounters) confirms improper disposal is systemic, not occasional. This is structural failure evidence.</p>
      </ReportCard>

      <ReportCard title="Associated Health Risks (Multiple Selection)" accent="#c62828">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.healthRisks} layout="vertical" margin={{top:0,right:30,left:240,bottom:0}}>
            <XAxis type="number" tick={{fontSize:11}}/><YAxis type="category" dataKey="name" tick={{fontSize:10}} width={240}/>
            <Tooltip formatter={v=>[v,'Respondents']}/>
            <Bar dataKey="value" fill="#c62828" radius={[0,6,6,0]} label={{position:'right',fontSize:11}}/>
          </BarChart>
        </ResponsiveContainer>
      </ReportCard>
    </>
  )
}
