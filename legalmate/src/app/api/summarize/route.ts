import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, lang } = body;
    const language = lang === "en" ? "en" : "he";   

    if (!text) {
      return new Response(JSON.stringify({ error: "Missing text" }), {
        status: 400,
      });
    }

    let prompt = "";

    if (language === "he") {
      prompt = `
    אתה עורך דין מנוסה. סכם את החוזה הבא בעברית, בטון ברור אך מקצועי:
    
    - הסבר את מטרת החוזה
    - הדגש סעיפים חריגים, בעייתיים או חסרים
    - הצע תיקונים במידת הצורך
    - סווג את סוג החוזה אם ניתן
    
    החוזה:
    \"\"\" 
    ${text}
    \"\"\"
    `;
    } else {
      prompt = `
    You are an experienced legal advisor. Please summarize the following contract in clear and professional legal English:
    
    - Explain the purpose of the contract
    - Highlight problematic, unusual, or missing clauses
    - Suggest improvements if needed
    - Classify the contract type if possible
    
    Contract:
    \"\"\"
    ${text}
    \"\"\"
    `;
    }
    

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a legal contract analyst." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    const data = await res.json();

    // בדיקת תקינות תגובת OpenAI
    if (!res.ok) {
      console.error("❌ OpenAI error response:", data);
      return new Response(JSON.stringify({ error: data.error?.message || "OpenAI API error" }), {
        status: res.status,
      });
    }

    const summary = data.choices?.[0]?.message?.content;

    if (!summary) {
      console.warn("⚠️ No summary returned from OpenAI");
      return new Response(JSON.stringify({ error: "No summary returned from OpenAI" }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ summary }), {
      status: 200,
    });
  } catch (err) {
    console.error("🔥 GPT error:", err);
    return new Response(JSON.stringify({ error: "Failed to summarize contract" }), {
      status: 500,
    });
  }
}
