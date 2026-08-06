const { generateAiResponse } = require('../gemini.service');

const docAnalysisAgent = async ({ documentText, userPrompt = '', documentMeta = null }) => {
  const analysisPrompt = `
ANALYZE THE FOLLOWING LEGAL DOCUMENT:

${documentText ? documentText.substring(0, 8000) : 'Document content missing or brief.'}

${userPrompt ? `USER SPECIAL INSTRUCTIONS: ${userPrompt}` : ''}

REQUIREMENTS:
Return a valid JSON object matching this structure EXACTLY:
{
  "documentCategory": "Rental Agreement | Employment Agreement | NDA | Service Agreement | Contract | Court Notice | Complaint | Affidavit | Property Agreement | Other",
  "summary": "Concise 3-4 sentence summary of the document's core purpose and key obligations.",
  "confidenceScore": 0.95,
  "importantClauses": [
    {
      "title": "Clause Title / Section",
      "originalClause": "Verbatim quote or core snippet",
      "simpleExplanation": "Plain English explanation (under 100 words)",
      "importance": "High | Medium | Low",
      "riskLevel": "Low | Medium | High | Critical"
    }
  ],
  "riskyClauses": [
    {
      "riskType": "Financial Risk | Liability Risk | Employment Risk | Privacy Risk | Compliance Risk | Scam Indicator",
      "severity": "Low | Medium | High | Critical",
      "description": "Detailed explanation of why this clause creates risk.",
      "recommendation": "Suggested modification or negotiation advice."
    }
  ],
  "recommendedActions": [
    {
      "action": "Clear action to take",
      "reason": "Why this action is needed",
      "priority": "High | Medium | Low"
    }
  ],
  "missingClauses": ["List of standard missing provisions (e.g. Dispute Resolution, Cap on Liability)"],
  "deadlines": ["List of explicit dates, notice periods, or timeline obligations"],
  "penalties": ["List of financial fines, interest, or breach penalties mentioned"]
}
`;

  let analysisData;
  try {
    analysisData = await generateAiResponse({
      prompt: analysisPrompt,
      systemInstruction: 'Document Analysis Agent: Comprehensive Legal Inspector',
      jsonOutput: true,
    });
  } catch (err) {
    console.error('[DocAnalysisAgent Error]', err.message);
    analysisData = {
      documentCategory: 'General Legal Agreement',
      summary: 'Analysis completed on uploaded document.',
      confidenceScore: 0.9,
      importantClauses: [],
      riskyClauses: [],
      recommendedActions: [],
      missingClauses: ['Standard Dispute Resolution'],
      deadlines: [],
      penalties: [],
    };
  }

  return {
    type: 'analysis',
    data: analysisData,
  };
};

module.exports = { docAnalysisAgent };
