import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { ReportCard, SummaryBox, MetricGrid, Metric, AlertBox } from './ReportCard'
import { Users } from 'lucide-react'

const COLORS = ['#1a6b8a','#2e7d32','#e65100','#6a1b9a','#c62828','#0277bd','#37474f','#d4a843']

export default function DemographicReport({ data }) {
  if (!data) return null
  return (
    <>
      <ReportCard accent="#1a6b8a">
        <MetricGrid>
          <Metric label="Total Respondents" value={data.total}               sub="surveyed"       color="#0f1f3d"/>
          <Metric label="Roles Represented" value={data.roles.length}        sub="job categories"  color="#1a6b8a"/>
          <Metric label="Departments"       value={data.departments.length}  sub="covered"        color="#2e7d32"/>
        </MetricGrid>
      </ReportCard>

      <SummaryBox icon={Users} text={data.summary}/>

      <AlertBox type="info">
        📋 <b>Hypothesis link:</b> {data.hypothesisLink} A sample dominated by frontline staff with low education and short experience strongly predicts low training rates — directly supporting the first cause in the hypothesis.
      </AlertBox>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <ReportCard title="Respondents by Role" accent="#1a6b8a">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data.roles} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({pct})=>`${pct}%`} fontSize={10}>
                {data.roles.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Pie>
              <Tooltip formatter={v=>[v,'Count']}/><Legend iconSize={10} wrapperStyle={{fontSize:11}}/>
            </PieChart>
          </ResponsiveContainer>
        </ReportCard>

        <ReportCard title="Employment Type" accent="#1a6b8a">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data.employmentType} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} label={({name,pct})=>`${name} ${pct}%`} fontSize={10}>
                {data.employmentType.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Pie>
              <Tooltip/>
            </PieChart>
          </ResponsiveContainer>
        </ReportCard>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <ReportCard title="Years of Experience" accent="#1a6b8a">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.experience} margin={{top:5,right:10,left:0,bottom:40}}>
              <XAxis dataKey="name" tick={{fontSize:9}} angle={-25} textAnchor="end" interval={0}/>
              <YAxis tick={{fontSize:11}}/><Tooltip/>
              <Bar dataKey="value" fill="#1a6b8a" radius={[4,4,0,0]} name="Respondents"/>
            </BarChart>
          </ResponsiveContainer>
        </ReportCard>

        <ReportCard title="Education Level" accent="#1a6b8a">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data.education} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75}>
                {data.education.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Pie>
              <Tooltip/><Legend iconSize={10} wrapperStyle={{fontSize:11}}/>
            </PieChart>
          </ResponsiveContainer>
        </ReportCard>
      </div>

      <ReportCard title="Department Breakdown" accent="#1a6b8a">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data.departments} layout="vertical" margin={{top:0,right:30,left:120,bottom:0}}>
            <XAxis type="number" tick={{fontSize:11}}/><YAxis type="category" dataKey="name" tick={{fontSize:11}} width={120}/>
            <Tooltip/><Bar dataKey="value" fill="#2e7d32" radius={[0,4,4,0]} label={{position:'right',fontSize:11}}/>
          </BarChart>
        </ResponsiveContainer>
      </ReportCard>
    </>
  )
}
