import fetch from 'node-fetch';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Log API key status (first/last 4 chars only for security)
if (GROQ_API_KEY) {
  console.log('✅ GroqCloud API Key configured:', GROQ_API_KEY.substring(0, 7) + '...' + GROQ_API_KEY.substring(GROQ_API_KEY.length - 4));
} else {
  console.error('❌ GroqCloud API Key not configured!');
}

// System prompt for medical assistant - Plain text output like Dolo-650 example
const SYSTEM_PROMPT = `You are a medical information assistant. Provide clear, well-structured medicine information in PLAIN TEXT format.

IMPORTANT: Do NOT return JSON. Return ONLY formatted plain text that humans can read directly.

RESPONSE RULES:
1. Answer ONLY medical questions (medicines, symptoms, health, pill identification)
2. If not medical, respond exactly: "I don't know"
3. Format with bold headings using **text**
4. Use bullet points with • symbol
5. NEVER provide prescriptions or emergency advice

FOR MEDICINE/PILL IDENTIFICATION, format your response EXACTLY like this:

**This is [Medicine Name].**
It's [active ingredient] [strength].

**What it's used for**
• [Use 1]
• [Use 2]
• [Use 3]

**How it works**
• [Brief explanation]
• [Key point]
• It is not an antibiotic and does not treat infections. (if applicable)

**Typical adult dose**
• [Dosing instructions]
• Max: [maximum daily dose]
• Do not take continuously without consulting a doctor.

**Important warnings**
• [Warning 1 - be specific about serious risks]
• [Warning 2]
• [Warning 3]

**When to see a doctor**
• [Condition 1]
• [Condition 2]
• [Condition 3]

EXAMPLE (for Dolo-650):

**This is Dolo-650.**
It's paracetamol 650 mg.

**What it's used for**
• Fever
• Headache
• Body pain
• Mild to moderate pain

**How it works**
• Reduces fever.
• Relieves pain.
• It is not an antibiotic and does not treat infections.

**Typical adult dose**
• 1 tablet (650 mg) every 6–8 hours if needed.
• Max: 3,000–4,000 mg per day depending on doctor advice.
• Do not take continuously for many days without consulting a doctor.

**Important warnings**
• Overdose damages the liver. This is serious.
• Avoid alcohol while taking it.
• If you already take other cold/flu meds, check labels. Many contain paracetamol.
• Not for long-term daily use without medical supervision.

**When to see a doctor**
• Fever lasts more than 3 days.
• Pain doesn't improve.
• You have liver disease or are pregnant.

IMPORTANT: Return ONLY this formatted text. Do NOT wrap it in JSON. Do NOT add {"summary": ...}. Just the plain formatted text above.`;

/**
 * Call Groq API with text query
 */
export const queryMedicalAssistant = async (userQuery, conversationHistory = []) => {
  try {
    console.log('\n🤖 AI Assistant Query:', userQuery);

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: userQuery }
    ];

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Groq's fast model
        messages,
        max_tokens: 1000,
        temperature: 0.3 // Lower temperature for factual medical info
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Groq API Error:', response.status, errorText);
      
      let errorMessage = `Groq API error: ${response.status}`;
      
      if (response.status === 401) {
        errorMessage = 'Invalid API key. Please check your GroqCloud API key configuration.';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again in a few moments.';
      } else if (response.status === 500) {
        errorMessage = 'GroqCloud service error. Please try again later.';
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('✅ Groq Response received');

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from AI model');
    }

    const assistantMessage = data.choices[0].message.content;
    
    console.log('✅ AI Response:', assistantMessage.substring(0, 100) + '...');
    
    // Return plain text response (no JSON parsing needed)
    return {
      success: true,
      data: {
        summary: assistantMessage, // Plain formatted text
        intent: assistantMessage.includes("I don't know") ? 'out_of_scope' : 'medicine_info',
        confidence_score: 0.9
      },
      rawResponse: assistantMessage,
      usage: data.usage
    };
  } catch (error) {
    console.error('❌ Medical Assistant Error:', error.message);
    return {
      success: false,
      error: error.message,
      data: {
        query: userQuery,
        intent: 'error',
        result: {},
        evidence: [],
        confidence_score: 0,
        summary: 'I encountered an error processing your request. Please try again.'
      }
    };
  }
};

/**
 * Identify pill from image using vision model
 */
export const identifyPillFromImage = async (imageBase64, userQuery = 'Identify this pill') => {
  try {
    console.log('\n💊 Pill Identification Request');
    console.log('Image size:', Math.round(imageBase64.length / 1024), 'KB');

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { 
        role: 'user', 
        content: [
          {
            type: 'text',
            text: `${userQuery}

Analyze this pill/medicine image and provide information in this EXACT format (plain text, no JSON):

**This is [Medicine Name].**
It's [active ingredient] [strength].

**What it's used for**
• [List uses]

**How it works**
• [Brief explanation]

**Typical adult dose**
• [Dosing info]
• Max: [maximum]

**Important warnings**
• [Critical warnings]

**When to see a doctor**
• [Conditions]

If you cannot identify the pill clearly, say: "I cannot identify this pill with certainty. Please consult a pharmacist or use the pill's imprint code to verify."`
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`
            }
          }
        ]
      }
    ];

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct', // New Groq vision model (Dec 2024+)
        messages,
        max_tokens: 1200,
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Groq Vision API Error:', response.status, errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    console.log('✅ Pill identification response:', assistantMessage.substring(0, 100) + '...');
    
    // Return plain text response (no JSON parsing)
    return {
      success: true,
      data: {
        summary: assistantMessage, // Plain formatted text like Dolo-650
        intent: 'pill_id',
        confidence_score: 0.85
      },
      rawResponse: assistantMessage,
      usage: data.usage
    };

  } catch (error) {
    console.error('❌ Pill Identification Error:', error.message);
    return {
      success: false,
      error: error.message,
      data: {
        query: userQuery,
        intent: 'pill_id',
        result: {
          error: 'Failed to identify pill from image'
        },
        evidence: ['FDA Pillbox: https://pillbox.nlm.nih.gov/'],
        confidence_score: 0,
        summary: 'Unable to identify the pill. Please consult a pharmacist or use FDA Pillbox for verification.'
      }
    };
  }
};

/**
 * Check if query is medical-related
 */
export const isMedicalQuery = (query) => {
  const medicalKeywords = [
    'medicine', 'drug', 'medication', 'pill', 'tablet', 'capsule',
    'symptom', 'disease', 'illness', 'condition', 'treatment',
    'hospital', 'doctor', 'pharmacy', 'health', 'medical',
    'pain', 'fever', 'infection', 'diagnosis', 'prescription',
    'side effect', 'dose', 'dosage', 'contraindication'
  ];
  
  const lowerQuery = query.toLowerCase();
  return medicalKeywords.some(keyword => lowerQuery.includes(keyword));
};

export default {
  queryMedicalAssistant,
  identifyPillFromImage,
  isMedicalQuery
};
