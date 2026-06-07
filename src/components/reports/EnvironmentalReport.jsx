import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'
import { ReportCard, SummaryBox, StatRow, MetricGrid, Metric, AlertBox } from './ReportCard'
import { Droplets } from 'lucide-react'
const COLORS = ['#c62828','#2e7d32','#f57c00','#1a6b8a']
export default function EnvironmentalReport({ data }) {
  if (!data) return null
  const contYes = data.soilWaterContamination.find(s=>s.name==='Yes')
  const waterYes = data.waterContamination.find(w=>w.name==='Yes')
  const radarData = [
    { subject:'Soil/Water Belief',   value: contYes?.pct||0 },
    { subject:'Water Observed',      value: waterYes?.pct||0 },
    { subject:'Severe Soil Impact',  value: data.soilImpact.find(s=>s.name?.includes('Severe'))?.pct||0 },
    { subject:'Moderate Impact',     value: data.soilImpact.find(s=>s.name?.includes('Moderate'))?.pct||0 },
    { subject:'No Formal Testing',   value: data.noTestingPct||0 },
  ]
  return (
    <>
      <ReportCard accent="#0277bd">
        <MetricGrid>
          <Metric label="Believe Waste Contaminates" value={`${contYes?.pct||0}%`} sub="soil/water" color="#c62828"/>
          <Metric label="Observed Water Contamination" value={`${waterYes?.pct||0}%`} sub="near facility" color="#0277bd"/>
          <Metric label="No Formal Env Testing" value={`${data.noTestingPct||0}%`} sub="ever conducted" color="#e65100"/>
        </MetricGrid>
      </ReportCard>
      <SummaryBox icon={Droplets} text={data.summary}/>
      <AlertBox type="info">📋 <b>Hypothesis link:</b> {data.hypothesisLink} Personal observations of water contamination are stronger evidence than opinion — direct witness testimony. Zero environmental testing means contamination may be far worse than reported.</AlertBox>
      {data.noTestingPct > 50 && <AlertBox type="danger">⚠️ Over half of respondents report no formal water or soil quality testing has ever been conducted near the hospital's waste disposal areas — meaning contamination levels are entirely unknown.</AlertBox>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <ReportCard title="Contamination Belief — Pie" accent="#0277bd">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data.soilWaterContamination} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({name,pct})=>`${name} ${pct}%`} fontSize={10}>
                {data.soilWaterContamination.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Pie><Tooltip/>
            </PieChart>
          </ResponsiveContainer>
        </ReportCard>
        <ReportCard title="Observed Water Contamination — Bar" accent="#0277bd">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.waterContamination} margin={{top:10,right:20,left:0,bottom:5}}>
              <XAxis dataKey="name" tick={{fontSize:10}}/><YAxis tick={{fontSize:11}} allowDecimals={false}/><Tooltip/>
              <Bar dataKey="value" radius={[6,6,0,0]} name="Respondents" label={{position:'top',fontSize:12}}>
                {data.waterContamination.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ReportCard>
      </div>
      <ReportCard title="Environmental Pollution Perception — Radar Chart" accent="#0277bd">
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart cx="50%" cy="50%" outerRadius={95} data={radarData}>
            <PolarGrid stroke="#e2e8f0"/><PolarAngleAxis dataKey="subject" tick={{fontSize:11,fill:'#1a1a2e'}}/> <PolarRadiusAxis angle={30} domain={[0,100]} tick={{fontSize:9}}/>
            <Radar name="%" dataKey="value" stroke="#0277bd" fill="#0277bd" fillOpacity={0.25} strokeWidth={2}/><Tooltip formatter={v=>[`${v}%`]}/>
          </RadarChart>
        </ResponsiveContainer>
      </ReportCard>
      <ReportCard title="Environmental Testing Status" accent="#0277bd">
        <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:8}}>
          {data.envTesting.map((e,i)=>(<StatRow key={e.name} label={e.name} value={e.value} pct={e.pct} color={COLORS[i%COLORS.length]}/>))}
        </div>
      </ReportCard>
    </>
  )
}
