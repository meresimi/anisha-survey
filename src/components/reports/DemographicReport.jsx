import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { ReportCard, SummaryBox, MetricGrid, Metric } from './ReportCard'
import { Users } from 'lucide-react'

const COLORS = ['#1a6b8a','#2e7d32','#e65100','#6a1b9a','#c62828','#0277bd','#37474f','#d4a843']

export default function DemographicReport({ data }) {
  if (!data) return null
  return (
    <>
      <ReportCard accent="#1a6b8a">
        <MetricGrid>
          <Metric label="Total Respondents" value={data.total} sub="surveyed" color="var(--navy)" />
          <Metric label="Roles Represented" value={data.roles.length} sub="job categories" color="#1a6b8a" />
          <Metric label="Departments" value={data.departments.length} sub="covered" color="#2e7d32" />
        </MetricGrid>
      </ReportCard>

      <SummaryBox icon={Users} text={data.summary} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <ReportCard title="Respondents by Role" accent="#1a6b8a">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.roles} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, pct }) => `${name} ${pct}%`} labelLine={false} fontSize={11}>
                {data.roles.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => [v, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </ReportCard>

        <ReportCard title="Years of Experience" accent="#1a6b8a">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.experience} margin={{ top: 5, right: 10, left: 0, bottom: 40 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" interval={0} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#1a6b8a" radius={[4,4,0,0]} name="Respondents" />
            </BarChart>
          </ResponsiveContainer>
        </ReportCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <ReportCard title="Department Breakdown" accent="#1a6b8a">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.departments} layout="vertical" margin={{ top: 0, right: 20, left: 80, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
              <Tooltip />
              <Bar dataKey="value" fill="#2e7d32" radius={[0,4,4,0]} name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </ReportCard>

        <ReportCard title="Education Level" accent="#1a6b8a">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.education} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                {data.education.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => [v, 'Count']} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ReportCard>
      </div>
    </>
  )
}
