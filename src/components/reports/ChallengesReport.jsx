import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid, PieChart, Pie } from 'recharts'
import { ReportCard, SummaryBox, MetricGrid, Metric, AlertBox } from './ReportCard'
import { Settings } from 'lucide-react'
const COLORS = ['#c62828','#e65100','#f57c00','#1a6b8a','#2e7d32','#6a1b9a']
export default function ChallengesReport({ data }) {
  if (!data) return null
  return (
    <>
      <ReportCard accent="#e65100">
        <MetricGrid>
          <Metric label="Avg Facility Rating" value={`${data.facilityRatingAvg}/5`} sub="waste management score" color={Number(data.facilityRatingAvg)<3?'#c62828':'#2e7d32'}/>
          <Metric label="Top Challenge"       value="#1" sub={data.topChallenges[0]?.name?.split('(')[0]?.trim()||'N/A'} color="#e65100"/>
          <Metric label="Top Recommendation"  value="#1" sub={data.topRecommendations[0]?.name?.split('(')[0]?.trim()||'N/A'} color="#1a6b8a"/>
        </MetricGrid>
      </ReportCard>
      <SummaryBox icon={Settings} text={data.summary}/>
      <AlertBox type="info">📋 <b>Hypothesis link:</b> {data.hypothesisLink} If top challenges align with the three hypothesis causes (training, infrastructure, enforcement), staff have independently confirmed the hypothesis. This is strong internal validity.</AlertBox>
      <ReportCard title="Facility Rating Distribution — Line Chart" accent="#e65100">
        <ResponsiveContainer width="100%" height={190}>
          <LineChart data={data.facilityRatingDistribution} margin={{top:10,right:20,left:0,bottom:5}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
            <XAxis dataKey="score" tick={{fontSize:13}}/><YAxis tick={{fontSize:11}} allowDecimals={false}/><Tooltip/>
            <Line type="monotone" dataKey="count" stroke="#e65100" strokeWidth={3} dot={{r:6,fill:'#e65100'}} name="Respondents" label={{position:'top',fontSize:12,fill:'#e65100'}}/>
          </LineChart>
        </ResponsiveContainer>
      </ReportCard>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <ReportCard title="Top Challenges Ranked" accent="#e65100">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={data.topChallenges.slice(0,6)} layout="vertical" margin={{top:0,right:30,left:190,bottom:0}}>
              <XAxis type="number" tick={{fontSize:11}}/><YAxis type="category" dataKey="name" tick={{fontSize:10}} width={190}/>
              <Tooltip formatter={v=>[v,'Respondents']}/>
              <Bar dataKey="value" radius={[0,6,6,0]} label={{position:'right',fontSize:11}}>
                {data.topChallenges.slice(0,6).map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ReportCard>
        <ReportCard title="Top Recommendations Ranked" accent="#e65100">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={data.topRecommendations.slice(0,6)} layout="vertical" margin={{top:0,right:30,left:190,bottom:0}}>
              <XAxis type="number" tick={{fontSize:11}}/><YAxis type="category" dataKey="name" tick={{fontSize:10}} width={190}/>
              <Tooltip formatter={v=>[v,'Respondents']}/>
              <Bar dataKey="value" radius={[0,6,6,0]} label={{position:'right',fontSize:11}}>
                {data.topRecommendations.slice(0,6).map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ReportCard>
      </div>
      <ReportCard title="Accountability Perceptions — Who Should Fix This?" accent="#e65100">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={data.accountability} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({name,pct})=>`${pct}%`} fontSize={10}>
              {data.accountability.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
            </Pie><Tooltip/>
          </PieChart>
        </ResponsiveContainer>
        <p style={{fontSize:12,color:'#64748b',marginTop:8,lineHeight:1.6}}>If staff and management blame different parties, that disconnect is itself a finding with direct implications for policy design.</p>
      </ReportCard>
    </>
  )
}
