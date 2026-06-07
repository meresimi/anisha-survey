export function computeReports(respondents) {
  if (!respondents || respondents.length === 0) return null
  return {
    demographic:   computeDemographic(respondents),
    training:      computeTraining(respondents),
    disposal:      computeDisposal(respondents),
    disease:       computeDisease(respondents),
    environmental: computeEnvironmental(respondents),
    policy:        computePolicy(respondents),
    challenges:    computeChallenges(respondents),
    safety:        computeSafety(respondents),
    composite:     computeComposite(respondents),
  }
}

function pct(count, total) { return total === 0 ? 0 : Math.round((count / total) * 100) }

function countBy(respondents, field) {
  return respondents.reduce((acc, r) => {
    const val = r.answers?.[field]
    if (val !== undefined && val !== '') acc[val] = (acc[val] || 0) + 1
    return acc
  }, {})
}

function multiCount(respondents, field) {
  return respondents.reduce((acc, r) => {
    const vals = r.answers?.[field]
    if (Array.isArray(vals)) vals.forEach(v => { acc[v] = (acc[v] || 0) + 1 })
    return acc
  }, {})
}

function toEntries(obj, n) {
  return Object.entries(obj).map(([name, value]) => ({ name, value, pct: pct(value, n) }))
}

function computeDemographic(respondents) {
  const n = respondents.length
  return {
    title: 'Demographic Profile Report',
    total: n,
    roles:          toEntries(countBy(respondents,'role'), n),
    experience:     toEntries(countBy(respondents,'years_experience'), n),
    departments:    toEntries(countBy(respondents,'department'), n),
    education:      toEntries(countBy(respondents,'education'), n),
    employmentType: toEntries(countBy(respondents,'employment_type'), n),
    hypothesisLink: 'Establishes credibility and representativeness of the dataset.',
    summary: `Survey completed by ${n} hospital personnel. Demographic breakdown enables cross-tabulation of findings by role, experience, and department.`
  }
}

function computeTraining(respondents) {
  const n = respondents.length
  const trainingYes = respondents.filter(r => r.answers?.received_training === 'Yes').length
  const trainingNo  = respondents.filter(r => r.answers?.received_training === 'No').length
  const trainingUnsure = respondents.filter(r => r.answers?.received_training === 'I am unsure').length
  const saidYes     = respondents.filter(r => r.answers?.received_training === 'Yes')
  const couldDescribe = saidYes.filter(r => r.answers?.training_describe?.trim().length > 20).length
  const validationGap = saidYes.length - couldDescribe
  const familiarity = countBy(respondents, 'protocol_familiarity')
  const drillYes    = respondents.filter(r => r.answers?.dept_drill === 'Yes').length
  const ratings     = respondents.map(r => r.answers?.knowledge_rating).filter(Boolean).map(Number)
  const avgKnowledge = ratings.length ? (ratings.reduce((a,b)=>a+b,0)/ratings.length).toFixed(1) : 0

  // Knowledge vs Experience cross-tab
  const expGroups = ['Less than 1 year','1–3 years','4–6 years','7–10 years','More than 10 years']
  const knowledgeByExp = expGroups.map(exp => {
    const group = respondents.filter(r => r.answers?.years_experience === exp)
    const groupRatings = group.map(r => r.answers?.knowledge_rating).filter(Boolean).map(Number)
    const avg = groupRatings.length ? (groupRatings.reduce((a,b)=>a+b,0)/groupRatings.length).toFixed(1) : 0
    return { name: exp.replace(' years','yr').replace('Less than ','<').replace('More than ','>'), avg: Number(avg) }
  })

  return {
    title: 'Training & Awareness Report',
    total: n,
    trainingStatus: [
      { name:'Received Training', value:trainingYes, pct:pct(trainingYes,n) },
      { name:'No Training',       value:trainingNo,  pct:pct(trainingNo,n)  },
      { name:'Unsure',            value:trainingUnsure, pct:pct(trainingUnsure,n) },
    ],
    validationGap, saidYesCount: saidYes.length, couldDescribe,
    familiarity: toEntries(familiarity, n),
    avgKnowledgeRating: avgKnowledge,
    knowledgeDistribution: [1,2,3,4,5].map(s=>({ score:`${s}`, count: ratings.filter(r=>r===s).length })),
    knowledgeByExp,
    drillYes, drillPct: pct(drillYes, n),
    hypothesisLink: 'Tests CAUSE 1: Inadequate training — the primary driver in the hypothesis.',
    summary: `${pct(trainingYes,n)}% reported training. Validation gap: ${validationGap} claimed training but could not describe procedures. Only ${pct(drillYes,n)}% had a recent departmental awareness session.`
  }
}

function computeDisposal(respondents) {
  const n = respondents.length
  const burning     = countBy(respondents, 'burning_practice')
  const burningFreq = countBy(respondents, 'burning_frequency')
  const distance    = countBy(respondents, 'burning_distance')
  const concern     = countBy(respondents, 'air_pollution_concern')
  const respiratory = countBy(respondents, 'respiratory_symptoms')

  return {
    title: 'Waste Disposal Practices Report',
    total: n,
    burningPractice:   toEntries(burning, n),
    burningFrequency:  toEntries(burningFreq, n),
    proximityToCommunity: toEntries(distance, n),
    safetyConcern:     toEntries(concern, n),
    respiratorySymptoms: { yes: respiratory['Yes']||0, no: respiratory['No']||0, yesPct: pct(respiratory['Yes']||0,n) },
    hypothesisLink: 'Tests CAUSE 2: Insufficient disposal infrastructure → EFFECT 2: Air pollution.',
    summary: `${pct(burning['Yes']||0,n)}% confirmed open-air burning or incineration. ${pct(respiratory['Yes']||0,n)}% observed respiratory symptoms in staff or nearby community members.`
  }
}

function computeDisease(respondents) {
  const n = respondents.length
  const wasteFreq   = countBy(respondents, 'improper_waste_frequency')
  const incidents   = countBy(respondents, 'reported_incidents')
  const sharpsYes   = respondents.filter(r => r.answers?.personal_sharps_injury === 'Yes').length
  const sharpsNotReported = respondents.filter(r =>
    r.answers?.personal_sharps_injury === 'Yes' && r.answers?.injury_reported === 'No'
  ).length
  const unreported  = respondents.filter(r =>
    r.answers?.reported_incidents === 'Yes' && r.answers?.incident_reported === 'No'
  ).length
  const healthRisks = multiCount(respondents, 'health_risks_observed')

  return {
    title: 'Disease Transmission & Infection Risk Report',
    total: n,
    wasteEncounterFrequency: toEntries(wasteFreq, n),
    incidents: [
      { name:'Yes',     value:incidents['Yes']||0,    pct:pct(incidents['Yes']||0,n)    },
      { name:'No',      value:incidents['No']||0,     pct:pct(incidents['No']||0,n)     },
      { name:'Unaware', value:incidents['I am unaware of any incidents']||0, pct:pct(incidents['I am unaware of any incidents']||0,n) },
    ],
    personalSharpsInjury: { yes:sharpsYes, pct:pct(sharpsYes,n) },
    sharpsNotReported, unreportedIncidents: unreported,
    healthRisks: toEntries(healthRisks, n).sort((a,b)=>b.value-a.value),
    hypothesisLink: 'Tests EFFECT 1: Disease transmission risk from improper disposal.',
    summary: `${pct(sharpsYes,n)}% suffered a personal sharps injury in the past 12 months. ${sharpsNotReported} of those were never reported. ${unreported} general incident(s) also went unlogged.`
  }
}

function computeEnvironmental(respondents) {
  const n = respondents.length
  const soilWater   = countBy(respondents, 'soil_water_contamination')
  const waterContam = countBy(respondents, 'water_contamination')
  const soilImpact  = countBy(respondents, 'soil_impact')
  const envTesting  = countBy(respondents, 'env_testing')
  const noTesting   = (envTesting['No']||0) + (envTesting['I do not know']||0)

  return {
    title: 'Environmental Pollution Perception Report',
    total: n,
    soilWaterContamination: toEntries(soilWater, n),
    waterContamination:     toEntries(waterContam, n),
    soilImpact:             toEntries(soilImpact, n),
    envTesting:             toEntries(envTesting, n),
    noTestingPct:           pct(noTesting, n),
    hypothesisLink: 'Tests EFFECTS 3 & 4: Soil degradation and water contamination.',
    summary: `${pct(soilWater['Yes']||0,n)}% believe waste causes contamination. ${pct(waterContam['Yes']||0,n)}% observed actual water contamination. ${pct(noTesting,n)}% report no formal environmental testing has ever been conducted.`
  }
}

function computePolicy(respondents) {
  const n = respondents.length
  const govReg      = countBy(respondents, 'gov_regulations')
  const stricterEnf = countBy(respondents, 'stricter_enforcement')
  const policyComm  = countBy(respondents, 'policy_communicated')
  const saidYesReg  = respondents.filter(r => r.answers?.gov_regulations === 'Yes').length
  const canName     = respondents.filter(r => r.answers?.gov_regulations==='Yes' && r.answers?.regulation_name?.trim().length>3).length
  const commYes     = policyComm['Yes']||0

  return {
    title: 'Policy & Regulation Awareness Report',
    total: n,
    govRegulations:      toEntries(govReg, n),
    stricterEnforcement: toEntries(stricterEnf, n),
    policyCommunicated:  toEntries(policyComm, n),
    saidYesReg, canNameRegulation: canName,
    regulationKnowledgeGap: saidYesReg - canName,
    policyCommPct: pct(commYes, n),
    hypothesisLink: 'Tests CAUSE 3: Weak enforcement of waste management protocols.',
    summary: `${pct(govReg['Yes']||0,n)}% believe regulations exist but only ${pct(canName,saidYesReg||1)}% of those could name one. Only ${pct(commYes,n)}% received any policy communication in the past 12 months.`
  }
}

function computeChallenges(respondents) {
  const n = respondents.length
  const challenges    = multiCount(respondents, 'challenges_list')
  const recommendations = multiCount(respondents, 'recommendations')
  const accountability  = countBy(respondents, 'accountability')
  const ratings = respondents.map(r => r.answers?.facility_rating).filter(Boolean).map(Number)
  const avgRating = ratings.length ? (ratings.reduce((a,b)=>a+b,0)/ratings.length).toFixed(1) : 0

  return {
    title: 'Challenges & Recommendations Report',
    total: n,
    topChallenges:      toEntries(challenges, n).sort((a,b)=>b.value-a.value),
    topRecommendations: toEntries(recommendations, n).sort((a,b)=>b.value-a.value),
    accountability:     toEntries(accountability, n),
    facilityRatingAvg:  avgRating,
    facilityRatingDistribution: [1,2,3,4,5].map(s=>({ score:`${s}`, count:ratings.filter(r=>r===s).length })),
    hypothesisLink: 'Triangulates all three causes through staff-identified challenges.',
    summary: `Average facility rating: ${avgRating}/5. Top challenge: "${toEntries(challenges,n).sort((a,b)=>b.value-a.value)[0]?.name||'N/A'}". Top recommendation: "${toEntries(recommendations,n).sort((a,b)=>b.value-a.value)[0]?.name||'N/A'}".`
  }
}

function computeSafety(respondents) {
  const n = respondents.length
  const safetyRatings = respondents.map(r => r.answers?.safety_rating).filter(Boolean).map(Number)
  const avgSafety = safetyRatings.length ? (safetyRatings.reduce((a,b)=>a+b,0)/safetyRatings.length).toFixed(1) : 0
  const oneChange = respondents.map(r => r.answers?.one_change).filter(Boolean)
  const additional= respondents.map(r => r.answers?.additional_comments).filter(Boolean)

  // Simple word frequency for one_change
  const wordFreq = {}
  oneChange.forEach(text => {
    text.toLowerCase().split(/\s+/).forEach(word => {
      if (word.length > 4) wordFreq[word] = (wordFreq[word]||0) + 1
    })
  })
  const topWords = Object.entries(wordFreq).sort((a,b)=>b[1]-a[1]).slice(0,15).map(([word,count])=>({word,count}))

  return {
    title: 'Safety Perception & Qualitative Insights Report',
    total: n,
    avgSafetyRating: avgSafety,
    safetyDistribution: [1,2,3,4,5].map(s=>({ score:`${s}`, count:safetyRatings.filter(r=>r===s).length })),
    oneChangeResponses: oneChange,
    additionalComments: additional,
    topWords,
    hypothesisLink: 'Captures lived safety experience — qualitative evidence supporting all four effects.',
    summary: `Average safety rating: ${avgSafety}/5. ${oneChange.length} respondents identified a single priority change. ${additional.length} provided additional qualitative insights.`
  }
}

function computeComposite(respondents) {
  const n = respondents.length
  const trainingScore = pct(respondents.filter(r=>r.answers?.received_training==='Yes').length, n)
  const ratings = respondents.map(r=>r.answers?.facility_rating).filter(Boolean).map(Number)
  const avgFacility = ratings.length ? ratings.reduce((a,b)=>a+b,0)/ratings.length : 0
  const infraScore  = Math.round((avgFacility/5)*100)
  const policyScore = pct(respondents.filter(r=>r.answers?.gov_regulations==='Yes').length, n)
  const noIncidents = respondents.filter(r=>r.answers?.reported_incidents==='No').length
  const safetyScore = pct(noIncidents, n)
  const noBurning   = respondents.filter(r=>r.answers?.burning_practice==='No').length
  const disposalScore = pct(noBurning, n)
  const safetyRatings = respondents.map(r=>r.answers?.safety_rating).filter(Boolean).map(Number)
  const avgSafety = safetyRatings.length ? safetyRatings.reduce((a,b)=>a+b,0)/safetyRatings.length : 3
  const perceptionScore = Math.round((avgSafety/5)*100)

  const overallScore = Math.round((trainingScore+infraScore+policyScore+safetyScore+disposalScore+perceptionScore)/6)

  const getRisk = s => s>=70 ? { level:'Low Risk', color:'#2e7d32' }
                      : s>=40 ? { level:'Moderate Risk', color:'#f57c00' }
                              : { level:'High Risk', color:'#c62828' }

  const dimensions = [
    { name:'Training Adequacy',    score:trainingScore,  ...getRisk(trainingScore)  },
    { name:'Infrastructure',       score:infraScore,     ...getRisk(infraScore)     },
    { name:'Policy Awareness',     score:policyScore,    ...getRisk(policyScore)    },
    { name:'Safety Record',        score:safetyScore,    ...getRisk(safetyScore)    },
    { name:'Disposal Practices',   score:disposalScore,  ...getRisk(disposalScore)  },
    { name:'Safety Perception',    score:perceptionScore,...getRisk(perceptionScore) },
  ]

  const verdict = overallScore < 40 ? 'confirms the hypothesis in full'
                : overallScore < 70 ? 'partially supports the hypothesis'
                : 'challenges the hypothesis — conditions are better than predicted'

  return {
    title: 'Composite Risk Score Report',
    total: n, overallScore, overallRisk: getRisk(overallScore), dimensions, verdict,
    hypothesisLink: 'Synthesises all three causes and four effects into a single evidence-based verdict.',
    summary: `Based on ${n} respondents, Honiara Referral Hospital scores ${overallScore}/100 — ${getRisk(overallScore).level}. This ${verdict}.`
  }
}
