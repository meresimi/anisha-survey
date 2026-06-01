import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from 'recharts'
import { ReportCard, SummaryBox, StatRow, MetricGrid, Metric, AlertBox } from './ReportCard'
import { Droplets } from 'lucide-react'

const COLORS = ['#c62828','#2e7d32','#f57c00','#1a6b8a']

export default function EnvironmentalReport({ data }) {
  if (!data) return null
  const contaminationYes = data.soilWaterContamination.find(s=>s.name==='Yes')
  const waterYes = data.waterContamination.find(w=>w.name==='Yes')

  // Radar data combining all three pollution dimensions
  const radarData = [
    { subject: 'Soil/Water Belief', value: contaminationYes?.pct || 0 },
    { subject: 'Water Observed', value: waterYes?.pct || 0 },
    { subject: 'Severe Soil Impact', value: data.soilImpact.find(s=>s.name?.includes('Severe'))?.pct || 0 },
    { subject: 'Moderate Impact', value: data.soilImpact.find(s=>s.name?.includes('Moderate'))?.pct || 0 },
    { subject: 'No Impact Belief', value: data.soilImpact.find(s=>s.name?.includes('No impact'))?.pct || 0 },
  ]

  return (
    <>
      <ReportCard accent="#0277bd">
        <MetricGrid>
          <Metric label="Believe Waste Contaminates" value={`${contaminationYes?.pct||0}%`} sub="soil/water" color="#c62828" />
          <Metric label="Observed Water Contamination" value={`${waterYes?.pct||0}%`} sub="near facility" color="#0277bd" />
          <Metric label="Severe Soil Impact Reported" value={`${data.soilImpact.find(s=>s.name?.includes('Severe'))?.pct||0}%`} sub="of respondents" color="#e65100" />
        </MetricGrid>
      </ReportCard>

      <SummaryBox icon={Droplets} text={data.summary} />

      <AlertBox type="info">
        📋 <strong>Interpretation (Soil & Water Pollution):</strong> Anisa's proposal highlights leachate from unlined landfills contaminating groundwater (leading to cholera, typhoid) and pharmaceutical contamination of waterways. High "Yes" rates on water contamination observations provide direct observational evidence — not just opinion — making these findings particularly strong in supporting the hypothesis.
      </AlertBox>

      {(waterYes?.pct||0) > 20 && (
        <AlertBox type="danger">
          ⚠️ A significant proportion of respondents have <strong>personally observed</strong> water source contamination near the hospital — direct evidence linking waste practices to environmental harm.
        </AlertBox>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <ReportCard title="Belief: Waste Causes Contamination — Pie" accent="#0277bd">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data.soilWaterContamination} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, pct }) => `${name} ${pct}%`} fontSize={11}>
                {data.soilWaterContamination.map((_, i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ReportCard>

        <ReportCard title="Observed Water Contamination — Bar" accent="#0277bd">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.waterContamination} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[6,6,0,0]} name="Respondents" label={{ position: 'top', fontSize: 12 }}>
                {data.waterContamination.map((_, i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ReportCard>
      </div>

      {/* Radar chart — pollution perception across all dimensions */}
      <ReportCard title="Environmental Pollution Perception — Radar Chart" accent="#0277bd">
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart cx="50%" cy="50%" outerRadius={100} data={radarData}>
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--text)' }} />
            <PolarRadiusAxis angle={30} domain={[0,100]} tick={{ fontSize: 9 }} />
            <Radar name="%" dataKey="value" stroke="#0277bd" fill="#0277bd" fillOpacity={0.25} strokeWidth={2} />
            <Tooltip formatter={(v)=>[`${v}%`]} />
          </RadarChart>
        </ResponsiveContainer>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.5 }}>
          The radar chart maps all pollution perception dimensions simultaneously. A large polygon skewed toward contamination beliefs and water observations strongly supports the environmental pollution effects in the hypothesis.
        </p>
      </ReportCard>

      <ReportCard title="Perceived Soil Impact Level" accent="#0277bd">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          {data.soilImpact.map((s, i) => (
            <StatRow key={s.name} label={s.name} value={s.value} pct={s.pct} color={COLORS[i%COLORS.length]} />
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12, lineHeight: 1.5 }}>
          Soil degradation from medical waste reduces agricultural productivity near Honiara — a finding with direct implications for food security and community wellbeing beyond the hospital itself.
        </p>
      </ReportCard>
    </>
  )
}
