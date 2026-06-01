// Utility functions to compute all 8 reports from respondent data

export function computeReports(respondents) {
  if (!respondents || respondents.length === 0) return null

  return {
    demographic: computeDemographic(respondents),
    training: computeTraining(respondents),
    disposal: computeDisposal(respondents),
    disease: computeDisease(respondents),
    environmental: computeEnvironmental(respondents),
    policy: computePolicy(respondents),
    challenges: computeChallenges(respondents),
    composite: computeComposite(respondents)
  }
}

function pct(count, total) {
  return total === 0 ? 0 : Math.round((count / total) * 100)
}

function countBy(respondents, field) {
  return respondents.reduce((acc, r) => {
    const val = r.answers?.[field]
    if (val) acc[val] = (acc[val] || 0) + 1
    return acc
  }, {})
}

function multiCount(respondents, field) {
  return respondents.reduce((acc, r) => {
    const vals = r.answers?.[field]
    if (Array.isArray(vals)) {
      vals.forEach(v => { acc[v] = (acc[v] || 0) + 1 })
    }
    return acc
  }, {})
}

function computeDemographic(respondents) {
  const n = respondents.length
  const roles = countBy(respondents, 'role')
  const experience = countBy(respondents, 'years_experience')
  const departments = countBy(respondents, 'department')
  const education = countBy(respondents, 'education')

  return {
    title: 'Demographic Profile Report',
    total: n,
    roles: Object.entries(roles).map(([name, value]) => ({ name, value, pct: pct(value, n) })),
    experience: Object.entries(experience).map(([name, value]) => ({ name, value, pct: pct(value, n) })),
    departments: Object.entries(departments).map(([name, value]) => ({ name, value, pct: pct(value, n) })),
    education: Object.entries(education).map(([name, value]) => ({ name, value, pct: pct(value, n) })),
    summary: `Survey completed by ${n} hospital personnel across ${Object.keys(departments).length} departments.`
  }
}

function computeTraining(respondents) {
  const n = respondents.length
  const trainingYes = respondents.filter(r => r.answers?.received_training === 'Yes').length
  const trainingNo = respondents.filter(r => r.answers?.received_training === 'No').length
  const trainingUnsure = respondents.filter(r => r.answers?.received_training === 'I am unsure').length

  // Validation: said yes but couldn't describe procedure
  const saidYes = respondents.filter(r => r.answers?.received_training === 'Yes')
  const couldDescribe = saidYes.filter(r => r.answers?.training_describe && r.answers.training_describe.trim().length > 20).length
  const validationGap = saidYes.length - couldDescribe

  const familiarity = countBy(respondents, 'protocol_familiarity')
  const knowledgeRatings = respondents.map(r => r.answers?.knowledge_rating).filter(Boolean).map(Number)
  const avgKnowledge = knowledgeRatings.length ? (knowledgeRatings.reduce((a,b) => a+b, 0) / knowledgeRatings.length).toFixed(1) : 0

  return {
    title: 'Training & Awareness Report',
    total: n,
    trainingStatus: [
      { name: 'Received Training', value: trainingYes, pct: pct(trainingYes, n) },
      { name: 'No Training', value: trainingNo, pct: pct(trainingNo, n) },
      { name: 'Unsure', value: trainingUnsure, pct: pct(trainingUnsure, n) }
    ],
    validationGap,
    saidYesCount: saidYes.length,
    couldDescribe,
    familiarity: Object.entries(familiarity).map(([name, value]) => ({ name, value, pct: pct(value, n) })),
    avgKnowledgeRating: avgKnowledge,
    knowledgeDistribution: [1,2,3,4,5].map(score => ({
      score: `${score}`,
      count: knowledgeRatings.filter(r => r === score).length
    })),
    summary: `${pct(trainingYes, n)}% of staff reported receiving training. Of those, only ${pct(couldDescribe, saidYes.length || 1)}% could adequately describe disposal procedures — indicating a training-knowledge gap of ${validationGap} respondents.`
  }
}

function computeDisposal(respondents) {
  const n = respondents.length
  const burning = countBy(respondents, 'burning_practice')
  const burningFreq = countBy(respondents, 'burning_frequency')
  const safetyConcern = countBy(respondents, 'air_pollution_concern')
  const respiratory = countBy(respondents, 'respiratory_symptoms')

  return {
    title: 'Waste Disposal Practices Report',
    total: n,
    burningPractice: Object.entries(burning).map(([name, value]) => ({ name, value, pct: pct(value, n) })),
    burningFrequency: Object.entries(burningFreq).map(([name, value]) => ({ name, value })),
    safetyConcern: Object.entries(safetyConcern).map(([name, value]) => ({ name, value, pct: pct(value, n) })),
    respiratorySymptoms: {
      yes: respiratory['Yes'] || 0,
      no: respiratory['No'] || 0,
      yesPct: pct(respiratory['Yes'] || 0, n)
    },
    summary: `${pct((burning['Yes'] || 0), n)}% of respondents confirmed use of incineration or open-air burning. ${pct(respiratory['Yes'] || 0, n)}% observed respiratory symptoms among staff or nearby community members.`
  }
}

function computeDisease(respondents) {
  const n = respondents.length
  const wasteFreq = countBy(respondents, 'improper_waste_frequency')
  const incidents = countBy(respondents, 'reported_incidents')
  const healthRisks = multiCount(respondents, 'health_risks_observed')

  const incidentYes = incidents['Yes'] || 0
  const unreported = respondents.filter(r =>
    r.answers?.reported_incidents === 'Yes' && r.answers?.incident_reported === 'No'
  ).length

  return {
    title: 'Disease Transmission & Infection Risk Report',
    total: n,
    wasteEncounterFrequency: Object.entries(wasteFreq).map(([name, value]) => ({ name, value, pct: pct(value, n) })),
    incidents: [
      { name: 'Yes', value: incidentYes, pct: pct(incidentYes, n) },
      { name: 'No', value: incidents['No'] || 0, pct: pct(incidents['No'] || 0, n) },
      { name: 'Unaware', value: incidents['I am unaware of any incidents'] || 0, pct: pct(incidents['I am unaware of any incidents'] || 0, n) }
    ],
    unreportedIncidents: unreported,
    healthRisks: Object.entries(healthRisks).map(([name, value]) => ({ name, value, pct: pct(value, n) })).sort((a,b) => b.value - a.value),
    summary: `${pct(incidentYes, n)}% of respondents reported disease exposure incidents. Critically, ${unreported} incident(s) were reportedly not formally logged — suggesting under-reporting of actual risk events.`
  }
}

function computeEnvironmental(respondents) {
  const n = respondents.length
  const soilWater = countBy(respondents, 'soil_water_contamination')
  const waterContam = countBy(respondents, 'water_contamination')
  const soilImpact = countBy(respondents, 'soil_impact')

  return {
    title: 'Environmental Pollution Perception Report',
    total: n,
    soilWaterContamination: Object.entries(soilWater).map(([name, value]) => ({ name, value, pct: pct(value, n) })),
    waterContamination: Object.entries(waterContam).map(([name, value]) => ({ name, value, pct: pct(value, n) })),
    soilImpact: Object.entries(soilImpact).map(([name, value]) => ({ name, value, pct: pct(value, n) })),
    summary: `${pct(soilWater['Yes'] || 0, n)}% believe improper disposal causes soil/water contamination. ${pct(waterContam['Yes'] || 0, n)}% have observed actual water source contamination near the facility.`
  }
}

function computePolicy(respondents) {
  const n = respondents.length
  const govReg = countBy(respondents, 'gov_regulations')
  const stricterEnf = countBy(respondents, 'stricter_enforcement')

  const canNameRegulation = respondents.filter(r =>
    r.answers?.gov_regulations === 'Yes' && r.answers?.regulation_name && r.answers.regulation_name.trim().length > 3
  ).length
  const saidYesReg = respondents.filter(r => r.answers?.gov_regulations === 'Yes').length

  return {
    title: 'Policy & Regulation Awareness Report',
    total: n,
    govRegulations: Object.entries(govReg).map(([name, value]) => ({ name, value, pct: pct(value, n) })),
    stricterEnforcement: Object.entries(stricterEnf).map(([name, value]) => ({ name, value, pct: pct(value, n) })),
    saidYesReg,
    canNameRegulation,
    regulationKnowledgeGap: saidYesReg - canNameRegulation,
    summary: `${pct(govReg['Yes'] || 0, n)}% believe sufficient regulations exist, but only ${pct(canNameRegulation, saidYesReg || 1)}% of those could actually name a regulation — suggesting significant unawareness of existing policy.`
  }
}

function computeChallenges(respondents) {
  const n = respondents.length
  const challenges = multiCount(respondents, 'challenges_list')
  const recommendations = multiCount(respondents, 'recommendations')

  const facilityRatings = respondents.map(r => r.answers?.facility_rating).filter(Boolean).map(Number)
  const avgRating = facilityRatings.length ? (facilityRatings.reduce((a,b) => a+b, 0) / facilityRatings.length).toFixed(1) : 0

  return {
    title: 'Challenges & Recommendations Report',
    total: n,
    topChallenges: Object.entries(challenges).map(([name, value]) => ({ name, value, pct: pct(value, n) })).sort((a,b) => b.value - a.value),
    topRecommendations: Object.entries(recommendations).map(([name, value]) => ({ name, value, pct: pct(value, n) })).sort((a,b) => b.value - a.value),
    facilityRatingAvg: avgRating,
    facilityRatingDistribution: [1,2,3,4,5].map(score => ({
      score: `${score}`,
      count: facilityRatings.filter(r => r === score).length
    })),
    summary: `Average facility waste management rating: ${avgRating}/5. The most cited challenge was "${Object.entries(challenges).sort((a,b) => b[1]-a[1])[0]?.[0] || 'N/A'}". The top recommended improvement was "${Object.entries(recommendations).sort((a,b) => b[1]-a[1])[0]?.[0] || 'N/A'}".`
  }
}

function computeComposite(respondents) {
  const n = respondents.length

  // Score each dimension 0-100
  const trainingScore = pct(respondents.filter(r => r.answers?.received_training === 'Yes').length, n)

  const facilityRatings = respondents.map(r => r.answers?.facility_rating).filter(Boolean).map(Number)
  const avgFacility = facilityRatings.length ? facilityRatings.reduce((a,b) => a+b, 0) / facilityRatings.length : 0
  const infrastructureScore = Math.round((avgFacility / 5) * 100)

  const policyAware = respondents.filter(r => r.answers?.gov_regulations === 'Yes').length
  const policyScore = pct(policyAware, n)

  const noIncidents = respondents.filter(r => r.answers?.reported_incidents === 'No').length
  const safetyScore = pct(noIncidents, n)

  const noBurning = respondents.filter(r => r.answers?.burning_practice === 'No').length
  const disposalScore = pct(noBurning, n)

  const overallScore = Math.round((trainingScore + infrastructureScore + policyScore + safetyScore + disposalScore) / 5)

  const getRisk = (score) => {
    if (score >= 70) return { level: 'Low Risk', color: '#2e7d32' }
    if (score >= 40) return { level: 'Moderate Risk', color: '#f57c00' }
    return { level: 'High Risk', color: '#c62828' }
  }

  const dimensions = [
    { name: 'Training Adequacy', score: trainingScore, ...getRisk(trainingScore) },
    { name: 'Infrastructure', score: infrastructureScore, ...getRisk(infrastructureScore) },
    { name: 'Policy Awareness', score: policyScore, ...getRisk(policyScore) },
    { name: 'Safety Record', score: safetyScore, ...getRisk(safetyScore) },
    { name: 'Disposal Practices', score: disposalScore, ...getRisk(disposalScore) }
  ]

  return {
    title: 'Composite Risk Score Report',
    total: n,
    overallScore,
    overallRisk: getRisk(overallScore),
    dimensions,
    summary: `Based on ${n} respondents, Honiara Referral Hospital scores ${overallScore}/100 overall — classified as "${getRisk(overallScore).level}". This ${overallScore < 40 ? 'confirms' : overallScore < 70 ? 'partially supports' : 'challenges'} the hypothesis that current waste management practices pose significant health and environmental risks.`
  }
}
