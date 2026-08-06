const { generateAiResponse } = require('../gemini.service');
const { legalChatAgent } = require('./legalChat.agent');
const { docAnalysisAgent } = require('./docAnalysis.agent');
const { riskDetectionAgent } = require('./riskDetection.agent');
const { draftGeneratorAgent } = require('./draftGenerator.agent');

const orchestratorAgent = async ({ userPrompt, documentText = '', conversationHistory = [], documentMeta = null }) => {
  const intentPrompt = `
System Instruction: Analyze the user's input and context to classify intent and plan execution.
User Input: "${userPrompt}"
Document Present: ${documentText ? 'YES (' + documentText.substring(0, 300) + '...)' : 'NO'}

Classify intent into one of:
- "legal_chat": Asking legal questions or general consultation.
- "document_analysis": Requesting analysis, summary, clause breakdown, or risk inspection of a document.
- "risk_detection": Deep risk inspection specifically.
- "draft_generation": Requesting legal document creation (notice, NDA, contract, rental agreement, complaint, affidavit).

Return JSON ONLY:
{
  "intent": "legal_chat" | "document_analysis" | "risk_detection" | "draft_generation",
  "missingInformation": ["item1", "item2"],
  "followUpQuestions": ["question1"],
  "plan": "Short statement of planned steps"
}
`;

  let intentResult;
  try {
    intentResult = await generateAiResponse({
      prompt: intentPrompt,
      systemInstruction: 'Orchestrator Intent Classifier',
      jsonOutput: true,
    });
  } catch (e) {
    intentResult = {
      intent: documentText ? 'document_analysis' : 'legal_chat',
      missingInformation: [],
      followUpQuestions: [],
      plan: 'Executing legal processing.',
    };
  }

  const intent = intentResult.intent || (documentText ? 'document_analysis' : 'legal_chat');

  let result;
  switch (intent) {
    case 'document_analysis':
      result = await docAnalysisAgent({ documentText, userPrompt, documentMeta });
      break;

    case 'risk_detection':
      result = await riskDetectionAgent({ documentText, userPrompt });
      break;

    case 'draft_generation':
      result = await draftGeneratorAgent({ prompt: userPrompt, documentText });
      break;

    case 'legal_chat':
    default:
      result = await legalChatAgent({ userPrompt, conversationHistory, documentText });
      break;
  }

  return {
    orchestratorPlan: intentResult.plan || 'Completed autonomous agent execution.',
    intent,
    followUpQuestions: intentResult.followUpQuestions || [],
    agentOutput: result,
  };
};

module.exports = { orchestratorAgent };
