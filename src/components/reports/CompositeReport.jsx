import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { ReportCard, SummaryBox, MetricGrid, Metric, AlertBox } from './ReportCard'
import { BarChart3 } from 'lucide-react'
export default function CompositeReport({ data }) {
  if (!data) return null
  const radarData = data.dimensions.map(d=>({ subject:d.name, score:d.score, fullMark:100 }))
  const riskType = data.overallRisk.level.includes('High')?'danger':data.overallRisk.level.includes('Moderate')?'warning':'success'
  return (
    <>
      <ReportCard accent={data.overallRisk.color}>
        <div style={{display:'flex',alignItems:'center',gap:32,flexWrap:'wrap'}}>
          <div style={{textAlign:'center'}}>
            <div style={{fontFamily:'DM Serif Display,serif',fontSize:76,lineHeight:1,color:data.overallRisk.color}}>{data.overallScore}</div>
            <div style={{fontSize:15,color:'#94a3b8'}}>out of 100</div>
            <div style={{marginTop:10,background:data.overallRisk.color,color:'white',borderRadius:20,padding:'4px 16px',fontSize:12,fontWeight:700,display:'inline-block',textTransform:'uppercase'}}>{data.overallRisk.level}</div>
          </div>
          <div style={{flex:1,minWidth:200}}>
            {data.dimensions.map(d=>(
              <div key={d.name} style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                <div style={{fontSize:12,width:155,color:'#1a1a2e'}}>{d.name}</div>
                <div style={{flex:1,height:9,background:'#f1f5f9',borderRadius:4,overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${d.score}%`,background:d.color,borderRadius:4,transition:'width .8s ease'}}/>
                </div>
                <div style={{fontSize:12,fontWeight:700,color:d.color,width:38,textAlign:'right'}}>{d.score}%</div>
                <div style={{fontSize:10,color:'white',background:d.color,borderRadius:10,padding:'1px 7px',whiteSpace:'nowrap'}}>{d.level}</div>
              </div>
            ))}
          </div>
        </div>
      </ReportCard>
      <AlertBox type={riskType}><b>Hypothesis Verdict:</b> {data.summary}</AlertBox>
      <ReportCard title="Risk Profile — Radar Chart" accent={data.overallRisk.color}>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart cx="50%" cy="50%" outerRadius={100} data={radarData}>
            <PolarGrid stroke="#e2e8f0"/><PolarAngleAxis dataKey="subject" tick={{fontSize:11,fill:'#1a1a2e'}}/>
            <PolarRadiusAxis angle={30} domain={[0,100]} tick={{fontSize:9}}/>
            <Radar name="Score" dataKey="score" stroke={data.overallRisk.color} fill={data.overallRisk.color} fillOpacity={0.25} strokeWidth={2}/><Tooltip formatter={v=>[`${v}%`,'Score']}/>
          </RadarChart>
        </ResponsiveContainer>
        <p style={{textAlign:'center',fontSize:12,color:'#94a3b8',marginTop:4}}>Higher scores = better performance / lower risk</p>
      </ReportCard>
      <ReportCard title="Dimension Score Breakdown" accent={data.overallRisk.color}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:12}}>
          {data.dimensions.map(d=>(
            <div key={d.name} style={{background:'#f8f5ef',borderRadius:10,padding:'14px 12px',textAlign:'center',borderTop:`3px solid ${d.color}`}}>
              <div style={{fontFamily:'DM Serif Display,serif',fontSize:32,color:d.color}}>{d.score}%</div>
              <div style={{fontSize:11,color:'#94a3b8',marginTop:3}}>{d.name}</div>
              <div style={{marginTop:6,background:d.color,color:'white',borderRadius:20,padding:'2px 8px',fontSize:10,fontWeight:700,display:'inline-block'}}>{d.level}</div>
            </div>
          ))}
        </div>
      </ReportCard>
    </>
  )
}
