import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

dotenv.config({ path: '.env.local' }); // Local environment variables-a load panna

import { createClient } from '@supabase/supabase-js';

// Env variables-a read pannurom
const supabaseUrl = process.env.SUPABASE_URL || 'https://ysbzeazbrpgnzrrdqkel.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
 // TypeScript key path checking string type assertion
if (!supabaseServiceKey && process.env.NODE_ENV === "production") {
  console.warn("Warning: Missing env.SUPABASE_SERVICE_ROLE_KEY. Make sure to add it in the Render Dashboard Environment tab.");
}
// Backend Supabase client
export const supabase = createClient(supabaseUrl, supabaseServiceKey || "fallback-key-for-build");
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini SDK with server-side API Key
const getAi = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "GrandStay Hotel CRM", version: "1.0.0" });
});
app.get("/api/supabase-test", async (req, res) => {
  try {
    const { error } = await supabase.from("_test").select("*").limit(1);

    if (error) {
      return res.json({
        connected: true,
        message: "Supabase is reachable, but the test table does not exist."
      });
    }

    res.json({
      connected: true,
      message: "Supabase connected successfully!"
    });
  } catch (error: any) {
    res.status(500).json({
      connected: false,
      message: error.message
    });
  }
});

// AI Assistant Endpoint
// Gemini Connection Test
app.get("/api/gemini-test", async (req, res) => {
  try {
    const ai = getAi();

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: "Say hello in one short sentence."
    });

    res.json({
      connected: true,
      message: response.text
    });

  } catch (error: any) {
    console.error("Gemini Test Error:", error);

    res.status(500).json({
      connected: false,
      message: error.message || String(error)
    });
  }
});
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, hotelContext } = req.body;
    const ai = getAi();
    

    const systemInstruction = `You are "GrandStay AI", the dedicated AI Hotel Operations & CRM Assistant for GrandStay Boutique Hotel.
You have real-time access to the hotel's operational and guest data:
${JSON.stringify(hotelContext || {
  occupancy: "78%",
  revenueToday: "₹1,24,500",
  newLeadsToday: 32,
  confirmedBookingsToday: 24,
  todayCheckIns: 24,
  todayCheckOuts: 18,
  pendingServiceRequests: 7,
  vipArrivalsTomorrow: ["Arjun Kumar (Deluxe Room 402 - 5th stay)"],
  urgentTasks: ["AC Maintenance in Room 304", "Special anniversary setup for Room 205"]
}, null, 2)}

Provide concise, professional, actionable hotel management advice or data summaries.
Structure responses clearly with bullet points where appropriate. Always assist hotel staff efficiently.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text || "I'm sorry, I couldn't generate a response at this time." });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    res.status(500).json({
      error: "Failed to communicate with AI Assistant.",
      details: error.message || String(error),
    });
  }
});

// AI Guest Summary Endpoint
app.post("/api/ai/guest-summary", async (req, res) => {
  try {
    const { guest } = req.body;
    const ai = getAi();

    const prompt = `Summarize this hotel guest profile into a concise 2-3 sentence executive guest summary for reception and sales staff:
Guest Name: ${guest.name}
Total Stays: ${guest.totalStays}
Lifetime Spend: ₹${guest.lifetimeSpend}
VIP Status: ${guest.vipStatus ? "Yes" : "No"}
Room Preferences: ${guest.roomPreferences?.join(", ") || "Standard"}
Bed Preferences: ${guest.bedPreferences || "King"}
Food Preferences: ${guest.foodPreferences?.join(", ") || "None"}
Special Requests: ${guest.specialRequests || "None"}
Recent Feedback/Notes: ${guest.notes || "High satisfaction on previous stays"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({ summary: response.text });
  } catch (error: any) {
    console.error("AI Guest Summary Error:", error);
    res.status(500).json({ error: "Failed to generate AI Guest Summary" });
  }
});

// AI Lead Score Endpoint
app.post("/api/ai/lead-score", async (req, res) => {
  try {
    const { lead } = req.body;
    const ai = getAi();

    const prompt = `Analyze this hotel booking lead and evaluate its conversion probability score (0-100) and provide 3 key reasons:
Lead Name: ${lead.name}
Requirement: ${lead.requirement}
Guests: ${lead.guestCount}
Expected Check-In: ${lead.expectedCheckIn}
Expected Check-Out: ${lead.expectedCheckOut}
Estimated Value: ₹${lead.estimatedValue}
Source: ${lead.source}
Status: ${lead.status}
Notes: ${lead.notes}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "Respond in valid JSON format with keys: score (number 0-100), qualification ('HOT' | 'WARM' | 'COLD'), reasons (array of strings), recommendedAction (string).",
        responseMimeType: "application/json",
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("AI Lead Score Error:", error);
    res.status(500).json({ error: "Failed to compute lead score" });
  }
});

// AI Daily Briefing Endpoint
app.post("/api/ai/daily-briefing", async (req, res) => {
  try {
    const { metrics } = req.body;
    const ai = getAi();

    const prompt = `Generate a 3-bullet morning AI Daily Briefing for a hotel manager based on these metrics:
Revenue: ₹${metrics?.revenue || "1,24,500"}
Occupancy Rate: ${metrics?.occupancy || "78%"}
Check-ins Today: ${metrics?.checkIns || 24}
Check-outs Today: ${metrics?.checkOuts || 18}
Pending Service Requests: ${metrics?.pendingRequests || 7}
New Leads: ${metrics?.newLeads || 32}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({ briefing: response.text });
  } catch (error: any) {
    console.error("AI Daily Briefing Error:", error);
    res.status(500).json({ error: "Failed to generate briefing" });
  }
});

// AI Message Drafting Endpoint
app.post("/api/ai/generate-message", async (req, res) => {
  try {
    const { recipientName, channel, topic, context } = req.body;
    const ai = getAi();

    const prompt = `Write a polite, professional ${channel} message to guest/lead ${recipientName} regarding "${topic}".
Context details: ${context || "Welcome offer and confirmation"}.
Keep it concise, friendly, and suitable for hotel communication.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({ messageText: response.text });
  } catch (error: any) {
    console.error("AI Message Gen Error:", error);
    res.status(500).json({ error: "Failed to generate message text" });
  }
});

// Vite Middleware & Production Static File Handler
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
   // const distPath = __dirname;
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
