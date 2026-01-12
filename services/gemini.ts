
import { GoogleGenAI, Type } from "@google/genai";
import { ContentFormData, ContentOutput, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function generateInstagramContent(data: ContentFormData, lang: Language): Promise<ContentOutput> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = lang === 'fa' 
    ? `شما یک دستیار حرفه‌ای تولید محتوای اینستاگرام برای بازار ایران هستید. 
       محتوا باید کاملا بومی، جذاب، عامیانه یا رسمی (بسته به لحن انتخابی) و مناسب فرهنگ اینستاگرام فارسی باشد.
       از ترجمه کلمه به کلمه پرهیز کنید. از ایموجی‌های مناسب استفاده کنید.
       در تولید کپشن‌ها حتما به شخصیت (Persona) و تأثیری (Effect) که کاربر انتخاب کرده توجه ویژه داشته باشید.
       اگر کاربر جزییات نهایی خاصی وارد کرده، حتما آن‌ها را در اولویت قرار دهید.`
    : `You are a professional Instagram content assistant. 
       Generate native-level, engaging, and high-quality content optimized for Instagram culture.
       Use appropriate emojis. Focus heavily on the desired Persona and Effect provided by the user.
       If the user provided specific final details, prioritize incorporating them into the output.`;

  const prompt = `
    Generate an Instagram content plan based on these details:
    - Page Type: ${data.pageType}
    - Topic: ${data.topic}
    - Target Audience Age Range: ${data.ageRange[0]} to ${data.ageRange[1]} years old
    - Audience Gender: ${data.audienceGender || 'N/A'}
    - Audience Main Concern: ${data.audienceConcern || 'N/A'}
    - Tone: ${data.tone}
    - Frequency: ${data.frequency}
    - Desired Effect on Audience: ${data.effect}
    - Desired Personality/Persona: ${data.persona}
    - IMPORTANT - Final Specific Details to include/influence: ${data.finalDetails || 'None'}
    - Target Language: ${lang === 'fa' ? 'Persian (Farsi)' : 'English'}

    Requirements:
    1. A weekly content calendar.
    2. 3 High-quality ready-to-post captions (approx 150-250 words each).
    3. 15-20 relevant hashtags (mix of broad and niche).
    4. 5 Creative story ideas.
    5. 5 Simple Reel scenarios.
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
    ? "شما یک مشاور حرفه‌ای اینستاگرام هستید. پاسخ‌های شما باید کوتاه، کاربردی و به زبان فارسی باشد."
    : "You are a professional Instagram marketing consultant. Provide short, actionable advice.";

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
