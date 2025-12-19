import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, Role, Attachment } from '../types';

const MODEL_NAME = 'gemini-2.5-flash';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_INSTRUCTION = `
You are NeuralMark, an elite AI academic mentor.
Your Goal: Help users solve past paper questions with maximum efficiency.

**CRITICAL GUIDELINES FOR RESPONSE STYLE:**
1.  **Be Minimalist:** Do not use fluff, filler words, or conversational pleasantries. Get straight to the point.
2.  **High Readability:** Use whitespace, short sentences, and bullet points. Large blocks of text are forbidden.
3.  **Structure:**
    *   **Concept:** One sentence explaining the core principle.
    *   **Steps:** Numbered list of solving steps.
    *   **Solution:** The final answer clearly highlighted.
4.  **Formatting:**
    *   Use **bold** for keywords.
    *   Use \`code\` for formulas or variables.
    *   Use > Blockquotes for critical notes.
5.  If the user provides an image/PDF, extract the question first, then solve it.

Maintain a calm, sophisticated, "less is more" tone.
`;

const GUIDED_SYSTEM_INSTRUCTION = `
You are NeuralMark, operating in **GUIDED LEARNING MODE**.
Your Goal: Act as a Socratic Tutor. **DO NOT** provide the final answer immediately.

**PROTOCOL:**
1.  **Analyze:** Identify the core concept of the user's question.
2.  **Guide:** Break the problem down into logical steps.
3.  **Interact:** Ask the user a leading question about the *first step* to get them started.
4.  **Feedback:** If the user replies, validate their thinking. If they are wrong, provide a hint, not the answer.
5.  **Progression:** Only move to the next step once the user understands the current one.
6.  **Tone:** Encouraging, patient, but academically rigorous. 
7.  **Completion:** Only provide the full solution if the user explicitly gives up or asks to "reveal the answer".

**FORMATTING:**
*   Keep responses short and conversational.
*   Use bullet points for clarity.
*   End every turn with a question for the user (unless revealing the final solution).
`;

const NOTES_SYSTEM_INSTRUCTION = `
You are NeuralMark, in **CREATIVE NOTES MODE**.
Your Goal: Create fun, vibrant, and simple study notes for the user's topic.

**STYLE GUIDE:**
1.  **Visuals & Colors:** 
    *   Use **Emojis** generously (🌟, 🚀, 💡, 🎨, 📚) to act as visual bullets and add color.
    *   Use **Bold Text** for all key terms (this renders in purple).
    *   Use \`Code Blocks\` for definitions, formulas, or short lists (this renders with a distinct background).
2.  **Structure:**
    *   Start with a **Big Fun Header** with emojis.
    *   Use **> Blockquotes** for "Fun Facts" or "Pro Tips".
    *   Use bullet points for everything else.
3.  **Content:**
    *   Keep it simple and easy to memorize.
    *   Focus on the "Big Picture" concepts.
    *   No long paragraphs.

**Example Layout:**
# 🚀 Topic Name
> 💡 **Core Idea:** The main thing you need to know.

## 🌈 Key Concepts
*   **Term 1:** Definition
*   **Term 2:** Definition

## ⚡ Quick Formula
\`E = mc^2\`
`;

export const sendMessageToGemini = async (
  history: Message[],
  newMessage: string,
  attachments: Attachment[] = [],
  isGuidedMode: boolean = false,
  isNotesMode: boolean = false
): Promise<string> => {
  const ai = getClient();
  
  // Prepare history for the API
  const historyContent = history.map(msg => {
    const parts: any[] = [{ text: msg.text }];
    if (msg.attachments && msg.attachments.length > 0) {
      msg.attachments.forEach(att => {
        parts.push({
          inlineData: {
            mimeType: att.mimeType,
            data: att.data
          }
        });
      });
    }
    return {
      role: msg.role,
      parts: parts
    };
  });

  // Prepare current message content
  const currentParts: any[] = [{ text: newMessage }];
  attachments.forEach(att => {
    currentParts.push({
      inlineData: {
        mimeType: att.mimeType,
        data: att.data
      }
    });
  });

  // Determine System Instruction
  let instruction = SYSTEM_INSTRUCTION;
  if (isNotesMode) instruction = NOTES_SYSTEM_INSTRUCTION;
  else if (isGuidedMode) instruction = GUIDED_SYSTEM_INSTRUCTION;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        ...historyContent.map(h => ({ role: h.role, parts: h.parts })),
        { role: Role.USER, parts: currentParts }
      ],
      config: {
        systemInstruction: instruction,
        temperature: isNotesMode ? 0.8 : (isGuidedMode ? 0.7 : 0.3), // Higher temp for creative notes
      }
    });

    return response.text || "No response generated.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Neural core disrupted.");
  }
};

export const generateQuestionsFromTopic = async (topic: string): Promise<string[]> => {
  const ai = getClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Search for rigorous, academic past paper questions related to the topic: "${topic}". 
      Return exactly 3 distinct, challenging questions found from reputable educational sources on the web.
      
      Format the output simply as a list of strings separated by a triple pipe "|||". 
      Do not include numbering, bullet points, or introductory text. Just the raw question text separated by |||.`,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.5,
      }
    });

    const text = response.text || "";
    // Clean up response if the model adds extra formatting despite instructions
    const cleanText = text.replace(/\|\|\|\s*$/, '').trim();
    
    // Split by delimiter
    let questions = cleanText.split('|||').map(q => q.trim()).filter(q => q.length > 10);
    
    // Fallback if split fails (model ignored instruction)
    if (questions.length < 2) {
      questions = cleanText.split('\n').map(q => q.replace(/^\d+\.\s*/, '').trim()).filter(q => q.length > 10);
    }

    return questions.slice(0, 3);
  } catch (error: any) {
    console.error("Gemini Search Error:", error);
    throw new Error("Unable to access global knowledge lattice.");
  }
};