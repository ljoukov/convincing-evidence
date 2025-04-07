import type { APIRoute } from 'astro';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.GOOGLE_AI_API_KEY || "" });

const llmModel = 'gemini-2.5-pro-preview-03-25';

const docs = [
  {job:'f9985cba-6c84-4c43-bd6b-63332c908170', file:'2014_sag-aftra_tv_agreement_7.pdf'},
  {job:'220d781e-7eb9-4218-ab06-e27e9fe2de8c', file:'2024 MOA National Code of Fair Practice for Network TV Broadcasting.pdf'},
  {job:'7d6fd7a5-d5a8-4776-8244-ad14fd9d2b46', file:'2020 SAG-AFTRA MOA 7-22-20 (00223283xBE9D7)-signed.pdf'},
  {job:'e7125f53-c35e-4ec3-aef5-fb811738eaf0', file:'2023_Theatrical_Television_MOA.pdf'},
  {job:'aef4419b-e81c-408f-aac5-6d9477e016e3', file:'Network Code 2021-24 MOA FE.pdf'},
  {job:'54879fd1-46f3-493a-b3c5-70a9ca1b7c6f', file:'2017_sag-aftra_theatrical-television_moa_7.pdf'},
  {job:'eadca3c2-586a-4d8e-896d-f9d2cbc4b88d', file:'memorandum_of_agreement_theatrical_television_2014_1_3_11.pdf'},
  {job:'154fe44d-9758-491d-ae48-ada5d12f4d49', file:'2018MOA-TV-National-Code_0.pdf'}
];

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!request.body) {
      throw new Error('Request body is empty');
    }

    const body = await request.json();
    if (!body || typeof body.message !== 'string') {
      throw new Error('Invalid message format');
    }

    // const { userQuery } = body;
    // console.log('Received message:', userQuery);

    const userQuery = `\
Compare the provisions governing performer auditions, specifically focusing on requirements related to self-taped auditions, as outlined in the 2017 Theatrical/Television MOA versus those detailed in the 2020 Theatrical/Television MOA. What key differences or new requirements were introduced by the 2020 MOA regarding self-tapes? Cite the relevant clauses from both MOAs.`;

    const modelInput = `\
You are an AI assistant designed to identify the necessary source documents for answering questions about SAG-AFTRA contracts, based on a provided list of available documents and their associated job IDs.

**Context:**
Your knowledge base consists ONLY of the following documents. You MUST select from these job IDs.

**Available Documents:**
*   job:'f9985cba-6c84-4c43-bd6b-63332c908170', file:'2014_sag-aftra_tv_agreement_7.pdf' (Description: Appears to be the 2014 TV Base Agreement, though user previously stated it might be missing - assume available for selection *if relevant*)
*   job:'220d781e-7eb9-4218-ab06-e27e9fe2de8c', file:'2024 MOA National Code of Fair Practice for Network TV Broadcasting.pdf' (Description: Latest MOA for Network Code)
*   job:'7d6fd7a5-d5a8-4776-8244-ad14fd9d2b46', file:'2020 SAG-AFTRA MOA 7-22-20 (00223283xBE9D7)-signed.pdf' (Description: 2020 Theatrical/Television MOA)
*   job:'e7125f53-c35e-4ec3-aef5-fb811738eaf0', file:'2023_Theatrical_Television_MOA.pdf' (Description: 2023 Theatrical/Television MOA)
*   job:'aef4419b-e81c-408f-aac5-6d9477e016e3', file:'Network Code 2021-24 MOA FE.pdf' (Description: 2021 MOA for Network Code)
*   job:'54879fd1-46f3-493a-b3c5-70a9ca1b7c6f', file:'2017_sag-aftra_theatrical-television_moa_7.pdf' (Description: 2017 Theatrical/Television MOA)
*   job:'eadca3c2-586a-4d8e-896d-f9d2cbc4b88d', file:'memorandum_of_agreement_theatrical_television_2014_1_3_11.pdf' (Description: 2014 Theatrical/Television MOA)
*   job:'154fe44d-9758-491d-ae48-ada5d12f4d49', file:'2018MOA-TV-National-Code_0.pdf' (Description: 2018 MOA for Network Code)

**Unavailable Documents (Do NOT select these even if potentially relevant):**
*   2014-2018 SAG-AFTRA Network Code (The base agreement for Network Code - assume its contents might be referenced *within* its MOAs, but the base file itself is NOT available for selection unless an available file clearly IS this base agreement). *Correction: The user's list does not explicitly contain a file named this. If a query requires this specific base, state that it's needed but not clearly available in the list.*
*   2018-2022 National Public Television MOA

**Understanding the Documents:**
*   Memoranda of Agreement (MOAs) modify existing base agreements (like the TV Agreement or the Network Code).
*   MOAs often contain specific rate changes, updated rules, or new sections that supersede corresponding sections in the base agreement or previous MOAs.
*   To answer questions about a specific date or rule, you often need the relevant base agreement (if available) AND the MOA(s) that were in effect *at that time* or introduced the rule change.
*   Questions about evolution require comparing provisions across multiple MOAs or between a base agreement and MOAs.

**Your Task:**
Analyze the user's query below. Identify the minimum set of documents from the **Available Documents** list absolutely required to answer the query accurately, considering the dates, topics, and document types mentioned. Output *only* the list of corresponding job_ids. If a necessary document (like a specific base agreement) is not clearly identifiable in the available list, state that.

**User Query:**
${userQuery}

**Output Format:**
Provide a JSON array with job IDs. For example: ['f9985cba-6c84-4c43-bd6b-63332c908170'] (note that 'job:' is not required)`;
    
    const response = await ai.models.generateContent({
      model: llmModel,
      contents: modelInput,
    });
    
    const generatedText = response.text;
    console.log('AI response:', generatedText);
    
    return new Response(JSON.stringify({ 
      text: generatedText
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error processing chat request:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
