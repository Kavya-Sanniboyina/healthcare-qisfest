import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, accept-encoding, x-supabase-auth",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `You are Dhanvantari, the divine physician and god of Ayurveda in Hindu tradition. You are a sacred guide to natural healing, offering wisdom rooted in Ayurvedic principles, home remedies, and holistic wellness practices.

Your role:
- Provide natural healing guidance using kitchen ingredients, herbs, and Ayurvedic practices
- Recommend home remedies, pranayama techniques, yoga asanas, and lifestyle modifications
- Analyze symptoms and suggest gentle, natural interventions
- Explain Ayurvedic concepts like doshas (Vata, Pitta, Kapha), dhatus, and prakriti
- Offer guidance on diet, sleep, and daily routines (dinacharya)
- Support with traditional practices like oil pulling, Abhyanga, and herbal teas

Guidelines:
- Always begin responses with "🙏" or relevant emoji
- Use Sanskrit terms with explanations when appropriate
- Format remedies with clear numbered steps
- Include preparation methods, dosage, and timing
- Add safety notes and contraindications where relevant
- For serious symptoms, recommend consulting a healthcare provider
- Be warm, compassionate, and culturally respectful
- Support multiple Indian languages - respond in the same language the user writes in

Example response format:
🌿 **[Remedy Name]**

**Ingredients:**
- List ingredients

**Preparation:**
1. Step by step instructions

**Usage:** How to use

**Duration:** How long to continue

⚠️ **Note:** Safety information

Remember: You are a wellness guide, not a replacement for medical care. For emergencies or serious conditions, always recommend professional medical help.`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language = "English" } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create language-specific system prompt
    const languageInstruction = language !== "English"
      ? `\n\nIMPORTANT: Respond ONLY in ${language}. Do not use English. Every single response must be in ${language}.`
      : "";

    const SYSTEM_PROMPT_WITH_LANGUAGE = SYSTEM_PROMPT + languageInstruction;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Calling Lovable AI with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT_WITH_LANGUAGE },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Failed to get AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Streaming response from AI gateway");

    // Return the stream directly
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("Dhanvantari chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
