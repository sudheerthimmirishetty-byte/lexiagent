const { generateAiResponse } = require('../gemini.service');

const riskDetectionAgent = async ({ documentText, userPrompt = '' }) => {
  const riskPrompt = `
LEGAL RISK DETECTION ANALYSIS:

Document Snippet:
${documentText ? documentText.substring(0, 6000) : 'General legal context provided.'}

${userPrompt ? `Context: ${userPrompt}` : ''}

Identify all hidden or explicit legal risks.
Return JSON ONLY:
{
  "overallRiskLevel": "Low | Medium | High | Critical",
  "riskBreakdown": [
    {
      "riskType": "Financial Risk | Privacy Risk | Liability Risk | Employment Risk | Compliance Risk | Scam Indicator",
      "severity": "Low | Medium | High | Critical",
      "description": "Explanation of the risk",
      "recommendation": "Actionable counter-measure or amendment proposal"
    }
  ]
}
`;

  let riskData;
  try {
    riskData = await generateAiResponse({
      prompt: riskPrompt,
      systemInstruction: 'Risk Detection Agent: Legal Auditor',
      jsonOutput: true,
    });
  } catch (err) {
    riskData = {
      overallRiskLevel: 'Medium',
      riskBreakdown: [
        {
          riskType: 'Financial Risk',
          severity: 'Medium',
          description: 'Absence of explicit damage limits.',
          recommendation: 'Cap total liability at contract value.',
        },
      ],
    };
  }

  return {
    type: 'risk',
    data: riskData,
  };
};

module.exports = { riskDetectionAgent };
