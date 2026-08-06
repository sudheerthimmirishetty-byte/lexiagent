const { generateAiResponse } = require('../gemini.service');

const legalChatAgent = async ({ userPrompt, conversationHistory = [], documentText = '' }) => {
  const historySnippet = conversationHistory
    .slice(-6)
    .map((h) => `${h.sender.toUpperCase()}: ${h.message}`)
    .join('\n');

  const chatPrompt = `
CONVERSATION HISTORY:
${historySnippet || 'No previous messages.'}

${documentText ? `REFERENCED DOCUMENT CONTEXT:\n${documentText.substring(0, 1500)}\n` : ''}

USER QUESTION / REQUEST:
"${userPrompt}"

INSTRUCTIONS:
1. Provide clear, empathetic, and actionable legal guidance in simple English.
2. Avoid dense legal jargon. Explain terms simply.
3. If an uploaded document is present, reference relevant sections directly.
4. Recommend concrete next steps or questions the user should ask their counterparty.
`;

  const responseText = await generateAiResponse({
    prompt: chatPrompt,
    systemInstruction: 'Legal Conversation Agent: Intelligent Legal Advisor',
    jsonOutput: false,
  });

  return {
    type: 'chat',
    response: responseText,
  };
};

module.exports = { legalChatAgent };
