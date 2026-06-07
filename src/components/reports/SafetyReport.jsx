import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { ReportCard, SummaryBox, MetricGrid, Metric, AlertBox } from './ReportCard'
import { Shield } from 'lucide-react'

export default function SafetyReport({ data }) {
  if (!data) return null
  const avg = Number(data.avgSafetyRating)
  const riskColor = avg <= 2 ? '#c62828' : avg <= 3 ? '#f57c00' : '#2e7d32'

  return (
    <>
      <ReportCard accent="#0e8a7a">
        <MetricGrid>
          <Metric label="Avg Safety Rating" value={`${data.avgSafetyRating}/5`} sub="perceived workplace safety" color={riskColor}/>
          <Metric label="One-Change Responses" value={data.oneChangeResponses.length} sub="qualitative insights" color="#0e8a7a"/>
          <Metric label="Additional Comments" value={data.additionalComments.length} sub="open-ended responses" color="#1a3260"/>
        </MetricGrid>
      </ReportCard>

      <SummaryBox icon={Shield} text={data.summary}/>

      <AlertBox type="info">
        📋 <b>Interpretation:</b> Safety perception captures the lived experience of working under current waste management conditions. A rating below 3 means staff do not feel safe — this is direct human evidence supporting all four effects in the hypothesis. Open-text responses provide the qualitative voice that numbers alone cannot convey.
      </AlertBox>

      <ReportCard title="Safety Perception Rating Distribution (1=Very Unsafe → 5=Very Safe)" accent="#0e8a7a">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.safetyDistribution} margin={{top:5,right:20,left:0,bottom:5}}>
            <XAxis dataKey="score" tick={{fontSize:13}}/>
            <YAxis tick={{fontSize:11}} allowDecimals={false}/>
            <Tooltip/>
            <Bar dataKey="count" radius={[6,6,0,0]} name="Respondents" label={{position:'top',fontSize:12}}>
              {data.safetyDistribution.map((e,i)=>(
                <Cell key={i} fill={Number(e.score)<=2?'#c62828':Number(e.score)===3?'#f57c00':'#2e7d32'}/>
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ReportCard>

      {data.topWords.length > 0 && (
        <ReportCard title="Most Frequently Used Words in 'What Would You Change?' Responses" accent="#0e8a7a">
          <div style={{display:'flex',flexWrap:'wrap',gap:8,padding:'8px 0'}}>
            {data.topWords.map(({word,count})=>(
              <span key={word} style={{
                background:`rgba(14,138,122,${Math.min(0.15+count*0.08,0.7)})`,
                color:'#0f1f3d', padding:'5px 13px', borderRadius:20,
                fontSize: Math.min(11+count*1.5, 18), fontWeight:600
              }}>{word} ({count})</span>
            ))}
          </div>
          <p style={{fontSize:12,color:'#64748b',marginTop:10,lineHeight:1.6}}>
            Word frequency analysis of open-text responses reveals which themes dominate staff concerns. Larger words appear more frequently across all responses.
          </p>
        </ReportCard>
      )}

      {data.oneChangeResponses.length > 0 && (
        <ReportCard title={`Staff Responses: "If you could change ONE thing..." (${data.oneChangeResponses.length} responses)`} accent="#0e8a7a">
          <div style={{display:'flex',flexDirection:'column',gap:8,maxHeight:320,overflowY:'auto'}}>
            {data.oneChangeResponses.slice(0,10).map((text,i)=>(
              <div key={i} style={{background:'#f8f5ef',borderRadius:8,padding:'10px 14px',
                borderLeft:'3px solid #0e8a7a',fontSize:13,color:'#1a1a2e',lineHeight:1.6}}>
                "{text}"
              </div>
            ))}
            {data.oneChangeResponses.length > 10 && (
              <p style={{fontSize:12,color:'#94a3b8',textAlign:'center'}}>
                + {data.oneChangeResponses.length-10} more responses in the full dataset
              </p>
            )}
          </div>
        </ReportCard>
      )}
    </>
  )
}
