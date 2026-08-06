const { generateAiResponse } = require('../gemini.service');

const draftGeneratorAgent = async ({ prompt, draftType = 'Contract', documentText = '' }) => {
  const draftPrompt = `
GENERATE A FORMAL LEGAL DRAFT FOR THE FOLLOWING REQUIREMENTS:

Draft Category: ${draftType}
User Instructions / Details: "${prompt}"
${documentText ? `Background Document Context:\n${documentText.substring(0, 1500)}` : ''}

REQUIREMENTS:
- Produce a complete, professionally formatted legal document in Markdown.
- Include proper formal headings (PARTIES, RECITALS, OBLIGATIONS, CONFIDENTIALITY, GOVERNING LAW, DISPUTE RESOLUTION, SIGNATURE BLOCKS).
- Use clear, authoritative legal structure.
- Include placeholder tags like [Date], [Full Name], [Address], [Amount] where user specific details are needed.
- Return ONLY the clean formatted legal document text.
`;

  const generatedText = await generateAiResponse({
    prompt: draftPrompt,
    systemInstruction: 'Draft Generation Agent: Professional Legal Author',
    jsonOutput: false,
  });

  return {
    type: 'draft',
    draftType,
    generatedDraft: generatedText,
  };
};

module.exports = { draftGeneratorAgent };
