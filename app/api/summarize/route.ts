import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

async function getVideoDetails(videoId: string) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`
  );
  const data = await response.json();
  return data.items[0];
}

export async function POST(request: Request) {
  const { url } = await request.json();
  const videoId = extractVideoId(url);

  if (!videoId) {
    return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
  }

  try {
    const videoDetails = await getVideoDetails(videoId);
    
    if (!videoDetails) {
      return NextResponse.json({ error: "Failed to fetch video details" }, { status: 500 });
    }

    const { title } = videoDetails.snippet;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `Transcribe the YouTube video with title "${title}" following this exact format:

1. Divide the transcription into clear sections with bold section headers
2. Within each section, create concise bullet points that capture key information
3. Include timestamps in the format [MM:SS] at the end of each bullet point (not at the beginning)
4. Focus on important details, quotes, numbers, and facts
5. Keep each bullet point brief and focused on a single idea or statement
6. Ensure logical flow between sections and bullet points

Example format:
**Section Title**

• Key point with important details and information [MM:SS]
• Another important point with specific details, quotes, or numbers [MM:SS]
• Additional relevant information mentioned in the video [MM:SS]

**Next Section Title**

• First key point in this section [MM:SS]
• Second key point with important details [MM:SS]
• And so on...

The transcription should be accurate, well-structured, and capture the most valuable information from the video.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let summary = response.text();
    
    // Clean up any potential remaining special characters but keep section headers
    summary = summary.replace(/\*\*/g, "<strong>");
    summary = summary.replace(/\*/g, "</strong>");
    
    // Convert timestamps to clickable links with blue color
    summary = summary.replace(/\[(\d+):(\d+)(?::(\d+))?\]/g, (match, minutes, seconds, hours) => {
      const videoUrl = url.includes('youtu.be') ? 
        `${url}?t=` : 
        `${url}&t=`;
      
      const totalSeconds = hours ? 
        parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds) : 
        parseInt(minutes) * 60 + parseInt(seconds);
      
      return `<a href="${videoUrl}${totalSeconds}" target="_blank" class="timestamp-link" style="color: #3b82f6; font-weight: normal;">${match}</a>`;
    });

    // Format bullet points
    summary = summary.replace(/•/g, "&#8226;");
    
    return NextResponse.json({ 
      summary: summary, 
      disclaimer: "This AI-generated transcription is based on video content and may not capture all details with 100% accuracy."
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to transcribe video" }, { status: 500 });
  }
}