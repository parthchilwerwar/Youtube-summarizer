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

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const prompt = `I need you to provide a comprehensive transcription of the YouTube video titled "${title}" divided into EXACTLY 4 main points ONLY.

DO NOT ask for the video link or say you need more information. Based on the title provided, please generate a realistic and detailed transcription following this EXACT format:

**Point 1: Introduction & Context**
The speaker opens by introducing the main topic [00:30] and providing essential background information, key context, definitions, and foundational concepts needed to understand the subject. They outline the scope and objectives [02:15] of what will be covered in this comprehensive overview, setting up the framework for the entire discussion and establishing the importance of the topic. [03:45]

**Point 2: Core Concepts & Main Discussion**
The primary subject matter is explored in detail [04:30] with thorough explanations, analysis, important theories, principles, and methodologies presented with supporting evidence. The speaker delves deeper into the complexities [06:45] and nuances of the topic with expert insights, connecting different aspects to show relationships and implications for the audience. [08:20]

**Point 3: Practical Applications & Real-World Examples**
Concrete examples, case studies, and real-world scenarios [09:15] are presented to illustrate how the concepts apply in practice. The speaker demonstrates practical implementations [11:30], tools, techniques, and problem-solving approaches that viewers can use, providing actionable insights and demonstrating the topic in real-world situations. [13:00]

**Point 4: Summary & Key Takeaways**
The most important points from the discussion [14:15] are summarized and reinforced, with final recommendations, best practices, and calls to action provided for the audience. The speaker concludes with closing thoughts [16:45], additional resources, and next steps for viewers to continue their learning journey beyond this video. [18:30]

CRITICAL FORMATTING REQUIREMENTS:
- Use EXACTLY 4 main points, no more, no less
- NO bullet points or sub-points under each main point
- Each point should be 4-5 detailed sentences in paragraph form
- Add 3-4 timestamps [MM:SS] THROUGHOUT each point's content (not just at the end)
- Make timestamps realistic and progressive (distributed evenly throughout each point)
- Make the content comprehensive and educational
- Ensure all 4 points together cover the complete video content
- Write in natural, conversational paragraph format
- Include timestamps at natural breaks in the content
- Keep space between the main points for better readability

Begin the detailed transcription now:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let summary = response.text();
    
    // Remove any bullet points that might have been generated
    summary = summary.replace(/[•·▪▫▸▹►▻⁃]/g, '');
    summary = summary.replace(/^\s*[-\*\+]\s*/gm, '');
    
    // Remove ALL ** formatting and convert to proper HTML headers with much better spacing
    summary = summary.replace(/\*\*(.*?)\*\*/g, "<h3 style='color: #FF6B00; margin: 4rem 0 2rem 0; font-size: 1.2rem; font-weight: 600; border-left: 4px solid #FF6B00; padding-left: 1rem; background: rgba(255, 107, 0, 0.05); padding: 1rem 0 1rem 1rem; border-radius: 0 8px 8px 0;'>$1</h3>");
    
    // Clean up any remaining ** characters (multiple passes to catch all)
    summary = summary.replace(/\*\*/g, '');
    summary = summary.replace(/\*/g, '');
    
    // Convert timestamps to clickable links that work with YouTube
    summary = summary.replace(/\[(\d+):(\d+)(?::(\d+))?\]/g, (match, minutes, seconds, hours) => {
      const totalSeconds = hours ? 
        parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds) : 
        parseInt(minutes) * 60 + parseInt(seconds);
      
      // Create proper YouTube timestamp URL
      let timestampUrl;
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        timestampUrl = `https://www.youtube.com/watch?v=${videoId}&t=${totalSeconds}s`;
      } else if (url.includes('youtube.com/watch')) {
        timestampUrl = url.includes('&t=') ? 
          url.replace(/&t=\d+/, `&t=${totalSeconds}s`) : 
          `${url}&t=${totalSeconds}s`;
      } else {
        timestampUrl = `${url}&t=${totalSeconds}s`;
      }
      
      return `<a href="${timestampUrl}" target="_blank" rel="noopener noreferrer" class="timestamp-link" style="color: #FF6B00 !important; font-weight: 600; padding: 3px 10px; border-radius: 8px; background: rgba(255, 107, 0, 0.15); border: 1px solid rgba(255, 107, 0, 0.3); transition: all 0.3s ease; font-family: 'JetBrains Mono', monospace; text-decoration: none; margin: 0 4px; display: inline-block; font-size: 0.9rem;" onmouseover="this.style.background='rgba(255, 107, 0, 0.25)'; this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(255, 107, 0, 0.4)';" onmouseout="this.style.background='rgba(255, 107, 0, 0.15)'; this.style.transform='translateY(0)'; this.style.boxShadow='none';">${match}</a>`;
    });

    // Convert line breaks to proper paragraphs with better spacing
    summary = summary.replace(/\n\n+/g, '</p><p style="margin-bottom: 2.5rem; line-height: 1.8;">');
    summary = summary.replace(/\n/g, '<br>');
    summary = `<p style="margin-bottom: 2.5rem; line-height: 1.8;">${summary}</p>`;
    
    // Clean up any remaining formatting issues and ensure proper spacing
    summary = summary.replace(/\s+/g, ' ');
    summary = summary.replace(/\s*<\/p>\s*<p[^>]*>\s*/g, '</p><p style="margin-bottom: 2.5rem; line-height: 1.8;">');
    
    // Add extra spacing after each point's content (before the next point header)
    summary = summary.replace(/<\/p>(\s*<h3)/g, '</p><div style="margin-bottom: 3rem;"></div>$1');
    
    // Add spacing after headers
    summary = summary.replace(/(<\/h3>)/g, '$1<div style="margin-bottom: 1rem;"></div>');
    
    return NextResponse.json({ 
      summary: summary
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to transcribe video" }, { status: 500 });
  }
}