export const SURVEY_SECTIONS = [
  {
    id: 'demographics', title: 'Section A: Demographic Information',
    icon: 'User', color: '#1a6b8a',
    questions: [
      { id: 'role', text: 'What is your current role/position?', type: 'single',
        options: ['Nurse','Doctor','Waste Management Officer','Cleaner / Sanitation Staff','Administrator','Other'] },
      { id: 'years_experience', text: 'How many years have you worked in this medical facility?', type: 'single',
        options: ['Less than 1 year','1–3 years','4–6 years','7–10 years','More than 10 years'] },
      { id: 'department', text: 'Which department do you work in?', type: 'single',
        options: ['Emergency','General Ward','Surgery','Outpatient','Administration','Cleaners / Sanitation','Other'] },
      { id: 'education', text: 'What is your highest level of education?', type: 'single',
        options: ['Primary school','Secondary school','Certificate / Diploma','Degree or higher'] },
      { id: 'employment_type', text: 'What is your employment type?', type: 'single',
        options: ['Permanent','Contract','Casual / Relief'],
        hint: 'Employment type affects training exposure and protocol familiarity.' },
    ]
  },
  {
    id: 'training', title: 'Section B: Training and Awareness',
    icon: 'BookOpen', color: '#2e7d32',
    questions: [
      { id: 'received_training', text: 'Have you received formal training on how to handle and dispose of medical hazardous waste?',
        type: 'single', options: ['Yes','No','I am unsure'],
        followUp: { condition: 'Yes', questions: [
          { id: 'training_when', text: 'When did you last receive this training? (Month and Year)', type: 'text' },
          { id: 'training_who',  text: 'Who conducted the training?', type: 'text' },
          { id: 'training_describe', text: 'In your own words, describe the correct procedure for disposing of sharps (e.g., needles):', type: 'textarea' },
          { id: 'training_certificate', text: 'Is there a certificate or attendance record from this training?', type: 'single', options: ['Yes','No','Unsure'] },
        ]}},
      { id: 'protocol_familiarity', text: 'How familiar are you with the current protocols for managing medical hazardous waste in your facility?',
        type: 'single', options: ['Very familiar','Somewhat familiar','Not familiar at all'],
        followUp: { condition: ['Very familiar','Somewhat familiar'], questions: [
          { id: 'protocol_name',     text: 'Can you name one specific protocol currently in place?', type: 'text' },
          { id: 'protocol_location', text: 'Where is this protocol documented?', type: 'text' },
        ]}},
      { id: 'knowledge_rating', text: 'On a scale of 1–5, how would you rate your own knowledge of medical waste management?',
        type: 'rating', min: 1, max: 5, labels: { 1:'No knowledge', 3:'Moderate', 5:'Very knowledgeable' },
        followUp: { condition: 'any', questions: [
          { id: 'knowledge_rating_reason', text: 'Please explain your rating:', type: 'textarea' },
        ]}},
      { id: 'dept_drill', text: 'Has your department conducted a waste management drill or awareness session in the past 12 months?',
        type: 'single', options: ['Yes','No','I am unsure'],
        hint: 'This helps assess institutional commitment beyond individual training.',
        followUp: { condition: 'Yes', questions: [
          { id: 'dept_drill_desc', text: 'Briefly describe what the session covered:', type: 'textarea' },
        ]}},
    ]
  },
  {
    id: 'disease', title: 'Section C: Disease Transmission & Infection Control',
    icon: 'AlertTriangle', color: '#c62828',
    questions: [
      { id: 'improper_waste_frequency', text: 'How often do you encounter improperly disposed medical waste in your workplace?',
        type: 'single', options: ['Daily','Several times a week','Once a week','Rarely','Never'],
        followUp: { condition: ['Daily','Several times a week','Once a week'], questions: [
          { id: 'waste_type',     text: 'What type of waste do you most commonly encounter?', type: 'text' },
          { id: 'waste_location', text: 'Where in the facility does this most often occur?', type: 'text' },
          { id: 'waste_action',   text: 'What do you do when you encounter it?', type: 'textarea' },
        ]}},
      { id: 'personal_sharps_injury', text: 'Have you personally suffered a needlestick or sharps injury in the past 12 months?',
        type: 'single', options: ['Yes','No'],
        hint: 'This is direct evidence of disease transmission risk — not just perception.',
        followUp: { condition: 'Yes', questions: [
          { id: 'injury_reported', text: 'Was this injury formally reported to management?', type: 'single', options: ['Yes','No','Unsure'] },
          { id: 'injury_action',   text: 'What action was taken after the injury?', type: 'textarea' },
        ]}},
      { id: 'reported_incidents', text: 'Have there been any reported incidents of healthcare workers or patients being exposed to infectious diseases from improper disposal at your facility?',
        type: 'single', options: ['Yes','No','I am unaware of any incidents'],
        followUp: { condition: 'Yes', questions: [
          { id: 'incident_when',     text: 'Approximately when did this occur?', type: 'text' },
          { id: 'incident_type',     text: 'What type of incident was it?', type: 'text' },
          { id: 'incident_reported', text: 'Was it formally reported to management?', type: 'single', options: ['Yes','No','Unsure'] },
          { id: 'incident_action',   text: 'What action was taken afterward?', type: 'textarea' },
        ]}},
      { id: 'health_risks_observed', text: 'What health risks do you associate with improperly disposed medical waste? (Select all that apply)',
        type: 'multi', options: ['Exposure to infectious diseases (e.g., HIV, hepatitis)','Respiratory problems','Skin infections or puncture wounds','Waterborne diseases (e.g., cholera, typhoid)','Other'] },
    ]
  },
  {
    id: 'air_pollution', title: 'Section D: Air Pollution & Disposal Practices',
    icon: 'Wind', color: '#6a1b9a',
    questions: [
      { id: 'burning_practice', text: 'Does your medical center use incineration or open-air burning for disposal of medical waste?',
        type: 'single', options: ['Yes','No','I am unsure'],
        followUp: { condition: 'Yes', questions: [
          { id: 'burning_frequency', text: 'How frequently does this occur?', type: 'single', options: ['Daily','Weekly','Monthly','Occasionally'] },
          { id: 'burning_location',  text: 'Where on the facility grounds does burning take place?', type: 'text' },
          { id: 'burning_distance',  text: 'How far from the nearest residential area does burning take place?',
            type: 'single', options: ['Less than 50 metres','50 to 100 metres','More than 100 metres','I do not know'] },
          { id: 'burning_safety',    text: 'Are safety measures in place during burning?', type: 'single', options: ['Yes','No','Unsure'] },
          { id: 'burning_safety_desc', text: 'If yes, describe the safety measures:', type: 'textarea' },
        ]}},
      { id: 'respiratory_symptoms', text: 'Have you personally noticed any respiratory symptoms among staff or community members near the facility?',
        type: 'single', options: ['Yes','No'],
        followUp: { condition: 'Yes', questions: [
          { id: 'respiratory_desc', text: 'Please describe the symptoms observed:', type: 'textarea' },
        ]}},
      { id: 'air_pollution_concern', text: 'How concerned are you about the health risks of open-air burning?',
        type: 'single', options: ['Very concerned','Somewhat concerned','Not concerned','I am unaware of such concerns'] },
    ]
  },
  {
    id: 'soil_water', title: 'Section E: Soil & Water Pollution',
    icon: 'Droplets', color: '#0277bd',
    questions: [
      { id: 'soil_water_contamination', text: 'Do you think improper medical waste disposal leads to contamination of local soil or water sources in Honiara?',
        type: 'single', options: ['Yes','No','I am unsure'],
        followUp: { condition: 'any', questions: [
          { id: 'contamination_evidence', text: 'Can you describe any specific instance you have personally observed?', type: 'textarea' },
        ]}},
      { id: 'water_contamination', text: 'Has there been any observed contamination of local water sources near your facility?',
        type: 'single', options: ['Yes','No','I am unaware of any contamination'],
        followUp: { condition: 'Yes', questions: [
          { id: 'water_source',   text: 'Which water source was affected?', type: 'text' },
          { id: 'water_when',     text: 'When was this observed?', type: 'text' },
          { id: 'water_reported', text: 'Was it reported to any authority?', type: 'single', options: ['Yes','No'] },
        ]}},
      { id: 'env_testing', text: 'Has your facility ever conducted a formal water or soil quality test near waste disposal areas?',
        type: 'single', options: ['Yes','No','I do not know'],
        hint: 'This distinguishes facilities that actively monitor from those that do not.',
        followUp: { condition: 'Yes', questions: [
          { id: 'env_testing_result', text: 'What were the results of that test?', type: 'textarea' },
        ]}},
      { id: 'soil_impact', text: 'What impact do you think soil contamination from medical waste has on the local environment?',
        type: 'single', options: ['Severe impact (e.g., destruction of crops, loss of biodiversity)','Moderate impact','Minimal impact','No impact','I am unsure'],
        followUp: { condition: 'any', questions: [
          { id: 'soil_impact_reason', text: 'Please explain your answer:', type: 'textarea' },
        ]}},
    ]
  },
  {
    id: 'challenges', title: 'Section F: Challenges & Recommendations',
    icon: 'Settings', color: '#e65100',
    questions: [
      { id: 'facility_rating', text: "On a scale of 1–5, how would you rate your facility's current medical waste management system?",
        type: 'rating', min: 1, max: 5, labels: { 1:'Very Poor', 3:'Average', 5:'Excellent' },
        followUp: { condition: 'any', questions: [
          { id: 'facility_rating_reason', text: 'Please explain your rating with a specific reason:', type: 'textarea' },
        ]}},
      { id: 'challenges_list', text: 'What are the biggest challenges in managing medical hazardous waste at your facility? (Select all that apply)',
        type: 'multi', options: ['Lack of proper training or knowledge','Insufficient resources or equipment','Inadequate waste disposal facilities','Poor adherence to protocols','Lack of management support','Other'],
        followUp: { condition: 'any', questions: [
          { id: 'biggest_challenge', text: 'Which do you consider the single biggest challenge and why?', type: 'textarea' },
        ]}},
      { id: 'accountability', text: 'In your opinion, who is most responsible for improving waste management at this facility?',
        type: 'single', options: ['Individual healthcare workers','Department heads','Hospital management','Ministry of Health','All of the above'],
        hint: 'Captures accountability perceptions which feeds directly into policy implications.' },
      { id: 'recommendations', text: 'What measures would you recommend to improve medical waste management? (Select all that apply)',
        type: 'multi', options: ['More training for healthcare workers','Better waste disposal equipment','Stricter regulations and enforcement','Regular monitoring and audits','Improved waste segregation practices','Public awareness campaigns','Other'] },
    ]
  },
  {
    id: 'policy', title: 'Section G: Policy & Regulation',
    icon: 'FileText', color: '#37474f',
    questions: [
      { id: 'gov_regulations', text: 'Do you think there are sufficient government regulations to ensure proper disposal of medical hazardous waste in Honiara?',
        type: 'single', options: ['Yes','No','I am unsure'],
        followUp: { condition: 'Yes', questions: [
          { id: 'regulation_name',     text: 'Can you name one specific regulation or policy you are aware of?', type: 'text' },
          { id: 'regulation_enforced', text: 'Is this regulation actively enforced at your facility?', type: 'single', options: ['Yes','No','Unsure'] },
        ]}},
      { id: 'policy_communicated', text: 'Have you received any communication from management about waste management policies in the past 12 months?',
        type: 'single', options: ['Yes','No','I am unsure'],
        hint: 'Tests whether policy is actively communicated — not just whether it exists on paper.',
        followUp: { condition: 'Yes', questions: [
          { id: 'policy_comm_type', text: 'How was this communicated? (e.g., memo, meeting, notice board)', type: 'text' },
        ]}},
      { id: 'stricter_enforcement', text: 'Do you think stricter enforcement of existing regulations would reduce health risks and environmental damage?',
        type: 'single', options: ['Yes','No','I am unsure'],
        followUp: { condition: 'any', questions: [
          { id: 'enforcement_reason', text: 'Please explain your answer:', type: 'textarea' },
        ]}},
      { id: 'policy_recommendations', text: 'What changes would you recommend to local policies to improve medical waste management in Honiara?',
        type: 'textarea' },
    ]
  },
  {
    id: 'experience', title: 'Section H: Overall Safety Experience',
    icon: 'Shield', color: '#0e8a7a',
    questions: [
      { id: 'safety_rating', text: 'On a scale of 1–5, how safe do you feel at work because of current waste management practices?',
        type: 'rating', min: 1, max: 5, labels: { 1:'Very unsafe', 3:'Neutral', 5:'Very safe' },
        hint: 'Safety perception captures the lived experience of working under current conditions.',
        followUp: { condition: 'any', questions: [
          { id: 'safety_rating_reason', text: 'Why did you give that rating?', type: 'textarea' },
        ]}},
      { id: 'one_change', text: 'If you could change ONE thing about waste management at this hospital, what would it be?',
        type: 'textarea',
        hint: 'This open question often produces the most powerful qualitative data in the study.' },
      { id: 'additional_comments', text: 'Is there anything else you would like to share about waste management at your facility?',
        type: 'textarea' },
    ]
  },
]

export const TOTAL_QUESTIONS = SURVEY_SECTIONS.reduce((a, s) => a + s.questions.length, 0)
