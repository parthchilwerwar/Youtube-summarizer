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

    const { title, description, tags } = videoDetails.snippet;
    const { viewCount, likeCount, commentCount } = videoDetails.statistics;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Please summarize the following video :

    Title: ${title}
    Description: ${description}
    Tags: ${tags ? tags.join(', ') : 'None'}
    Views: ${viewCount}
    Likes: ${likeCount}
    Comments: ${commentCount}

    Please provide a concise summary that captures the main points and potential content of the video based on this information. The summary should be about 3-4 paragraphs long.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();
    
    return NextResponse.json({ 
      summary: summary, 
      disclaimer: "This is the AI based summary it may be accurate maybe not"
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to summarize video" }, { status: 500 });
  }
}