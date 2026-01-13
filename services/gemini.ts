
import { GoogleGenAI, Type } from "@google/genai";
import { ContentFormData, ContentOutput, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function generateInstagramContent(data: ContentFormData, lang: Language): Promise<ContentOutput> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = lang === 'fa' 
    ? `شما یک استراتژیست ارشد بازاریابی و ادمین حرفه‌ای اینستاگرام هستید. 
       وظیفه شما تولید محتوایی است که نه تنها جذاب است، بلکه باعث رشد و فروش واقعی می‌شود.
       قوانین طلایی شما:
       ۱. هر کپشن باید با یک قلاب (Hook) خیره‌کننده شروع شود که مخاطب را در ثانیه اول متوقف کند.
       ۲. اگر پیج فروشگاهی است، از تکنیک‌های روانشناسی فروش (کمیابی، فوریت، اثبات اجتماعی) استفاده کنید.
       ۳. ایده‌های استوری و ریلز باید کاملاً استراتژیک و هدفمند باشند.
       ۴. لحن محتوا باید کاملاً بومی، طبیعی و با رعایت دقیق پرسونای انتخابی باشد.
       ۵. شما معمار اصلی حضور دیجیتال این برند هستید، پس جدی و فوق‌حرفه‌ای عمل کنید.`
    : `You are a World-Class Professional Marketing Strategist and Expert Instagram Page Admin. 
       Your mission is to provide high-impact content that converts and grows the brand.
       Your Golden Rules:
       1. Every caption MUST start with a "Scroll-Stopping Hook" to stop the user instantly.
       2. Use advanced psychological sales techniques (scarcity, urgency, social proof) for sales-oriented content.
       3. Ideas for Stories and Reels must be strategic, goal-oriented, and innovative.
       4. Ensure native-level fluency and perfectly match the chosen Persona and Tone.
       5. Act as the principal architect of the brand's digital presence.`;

  const prompt = `
    Generate a Strategic Instagram Content Plan for:
    - Business Category: ${data.pageType}
    - Niche/Topic: ${data.topic}
    - Audience Profile: Age ${data.ageRange[0]}-${data.ageRange[1]}, Gender: ${data.audienceGender || 'All'}, Main Concern: ${data.audienceConcern || 'N/A'}
    - Brand Persona: ${data.persona}
    - Desired Psychological Effect: ${data.effect}
    - Communication Tone: ${data.tone}
    - Post Frequency: ${data.frequency}
    - MANDATORY CUSTOM INSTRUCTIONS: ${data.finalDetails || 'Use your expertise to influence captions and hashtags for maximum growth.'}
    - Language: ${lang === 'fa' ? 'Persian (Farsi)' : 'English'}

    Deliverables:
    1. A strategic Weekly Content Calendar (Posts/Reels).
    2. 3 Premium Captions with powerful Hooks and clear CTAs (150-250 words).
    3. 15-20 Optimized Hashtags (Niche-specific).
    4. 5 Strategic Story Ideas.
    5. 5 Reel Scenarios with high viral potential.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          calendar: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                type: { type: Type.STRING },
                title: { type: Type.STRING }
              },
              required: ["day", "type", "title"]
            }
          },
          captions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                text: { type: Type.STRING }
              },
              required: ["title", "text"]
            }
          },
          hashtags: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          storyIdeas: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          reelIdeas: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["calendar", "captions", "hashtags", "storyIdeas", "reelIdeas"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as ContentOutput;
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Invalid AI Response");
  }
}

export async function askAdvisor(question: string, lang: Language): Promise<string> {
  const model = "gemini-3-pro-preview";
  const systemInstruction = lang === 'fa'
    ? "شما یک مشاور ارشد بازاریابی اینستاگرام هستید. پاسخ‌های شما باید کوتاه، استراتژیک و کاملاً حرفه‌ای باشد."
    : "You are a senior Instagram marketing strategist. Provide short, strategic, and highly professional advice.";

  const response = await ai.models.generateContent({
    model,
    contents: question,
    config: {
      systemInstruction,
      tools: [{ googleSearch: {} }]
    }
  });

  return response.text || (lang === 'fa' ? "خطایی رخ داد." : "An error occurred.");
}
