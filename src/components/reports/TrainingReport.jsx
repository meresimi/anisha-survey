import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend, LineChart, Line, CartesianGrid } from 'recharts'
import { ReportCard, SummaryBox, StatRow, MetricGrid, Metric, AlertBox } from './ReportCard'
import { BookOpen } from 'lucide-react'

const COLORS = ['#2e7d32','#c62828','#f57c00']

export default function TrainingReport({ data }) {
  if (!data) return null
  const gapPct = data.saidYesCount > 0 ? Math.round((data.validationGap/data.saidYesCount)*100) : 0
  const radial = [
    { name:'Trained',   value:data.trainingStatus.find(t=>t.name==='Received Training')?.pct||0, fill:'#2e7d32' },
    { name:'Untrained', value:data.trainingStatus.find(t=>t.name==='No Training')?.pct||0,       fill:'#c62828' },
  ]
  return (
    <>
      <ReportCard accent="#2e7d32">
        <MetricGrid>
          <Metric label="Received Training"   value={`${data.trainingStatus.find(t=>t.name==='Received Training')?.pct||0}%`} sub="of respondents"         color="#2e7d32"/>
          <Metric label="Avg Knowledge Rating" value={data.avgKnowledgeRating}                                                 sub="out of 5"              color="#1a6b8a"/>
          <Metric label="Validation Gap"       value={data.validationGap}                                                      sub="claimed but can't prove" color="#c62828"/>
          <Metric label="Dept Drill Held"      value={`${data.drillPct}%`}                                                     sub="in past 12 months"     color="#e65100"/>
        </MetricGrid>
      </ReportCard>

      <SummaryBox icon={BookOpen} text={data.summary}/>

      <AlertBox type="info">
        📋 <b>Hypothesis link:</b> {data.hypothesisLink} Low training rates below 50% directly confirm this cause. The validation gap reveals social desirability bias — staff who claimed training but cannot describe procedures. This strengthens the value of the improved questionnaire with validation probes.
      </AlertBox>

      {gapPct > 30 && (
        <AlertBox type="danger">
          ⚠️ <b>Social Desirability Bias Detected:</b> {gapPct}% of staff who claimed training could not describe correct procedures — confirming self-reported data is unreliable without validation probes.
        </AlertBox>
      )}

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <ReportCard title="Training Status — Pie Chart" accent="#2e7d32">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data.trainingStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({pct})=>`${pct}%`}>
                {data.trainingStatus.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Pie>
              <Tooltip/><Legend iconSize={10} wrapperStyle={{fontSize:11}}/>
            </PieChart>
          </ResponsiveContainer>
        </ReportCard>
        <ReportCard title="Trained vs Untrained — Radial" accent="#2e7d32">
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart cx="50%" cy="50%" innerRadius={35} outerRadius={85} data={radial} startAngle={180} endAngle={0}>
              <RadialBar dataKey="value" label={{position:'insideStart',fill:'#fff',fontSize:12}}/>
              <Legend iconSize={10} wrapperStyle={{fontSize:11}}/><Tooltip formatter={v=>[`${v}%`]}/>
            </RadialBarChart>
          </ResponsiveContainer>
        </ReportCard>
      </div>

      <ReportCard title="Knowledge Rating vs Years of Experience — Line Chart" accent="#2e7d32">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data.knowledgeByExp} margin={{top:10,right:20,left:0,bottom:5}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
            <XAxis dataKey="name" tick={{fontSize:10}}/><YAxis domain={[0,5]} tick={{fontSize:11}}/>
            <Tooltip formatter={v=>[`${v}/5`,'Avg Knowledge']}/> 
            <Line type="monotone" dataKey="avg" stroke="#2e7d32" strokeWidth={3}
              dot={{r:6,fill:'#2e7d32'}} label={{position:'top',fontSize:11,fill:'#2e7d32'}}/>
          </LineChart>
        </ResponsiveContainer>
        <p style={{fontSize:12,color:'#64748b',marginTop:8,lineHeight:1.6}}>
          If knowledge ratings do not increase significantly with experience, on-the-job learning is not compensating for absent formal training — strengthening the case for mandatory structured training programs.
        </p>
      </ReportCard>

      <ReportCard title="Self-Rated Knowledge Distribution (1–5)" accent="#2e7d32">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data.knowledgeDistribution} margin={{top:5,right:20,left:0,bottom:5}}>
            <XAxis dataKey="score" tick={{fontSize:13}}/><YAxis tick={{fontSize:11}} allowDecimals={false}/>
            <Tooltip/>
            <Bar dataKey="count" radius={[6,6,0,0]} name="Respondents" label={{position:'top',fontSize:12}}>
              {data.knowledgeDistribution.map((e,i)=>(
                <Cell key={i} fill={Number(e.score)<=2?'#c62828':Number(e.score)===3?'#f57c00':'#2e7d32'}/>
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ReportCard>

      <ReportCard title="Protocol Familiarity & Departmental Drills" accent="#2e7d32">
        <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:8}}>
          {data.familiarity.map((f,i)=>(<StatRow key={f.name} label={f.name} value={f.value} pct={f.pct} color={COLORS[i%COLORS.length]}/>))}
        </div>
        <div style={{marginTop:14,padding:'10px 14px',background:'#e8f5e9',borderRadius:8,borderLeft:'3px solid #2e7d32'}}>
          <p style={{fontSize:13,fontWeight:600,color:'#2e7d32'}}>Departmental Awareness Sessions in Past 12 Months</p>
          <p style={{fontSize:13,color:'#1a1a2e',marginTop:4}}><b>{data.drillYes}</b> departments held a session ({data.drillPct}%). {data.drillPct < 30 ? 'Critically low — confirms institutional neglect of waste awareness.' : 'Moderate — some effort exists but coverage is insufficient.'}</p>
        </div>
      </ReportCard>
    </>
  )
}
