// src/app/api/ai-audit/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { url, domain, title, metaDesc, headings, paragraphs, wordCount, imagesCount, linksCount, hasPhone, hasEmail, ctas } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ fallback: true, message: 'No API key provided, using deep heuristic engine.' });
    }

    const prompt = `
You are a world-class senior digital agency director auditing a website for a non-technical business owner.
Analyze this website thoroughly based on its real scraped data:

Domain: ${domain}
Full URL: ${url}
Title Tag: ${title}
Meta Description: ${metaDesc || 'None'}
Main Headings: ${JSON.stringify(headings)}
Opening Copy / Paragraphs: ${JSON.stringify(paragraphs.slice(0, 5))}
Word Count: ~${wordCount} words
Images Count: ${imagesCount}
Links Count: ${linksCount}
Has Phone: ${hasPhone ? 'Yes' : 'No'}
Has Email: ${hasEmail ? 'Yes' : 'No'}
Detected Action Buttons/CTAs: ${JSON.stringify(ctas)}

Generate a massive, comprehensive, and UNLIMITED problem-and-solution audit categorized into the 6 perspectives:
1. Google View (SERP presentation, title optimization, snippet, click-through-rate, crawl signals)
2. Visitor View (5-second clarity, trust, confusion points, mobile reading, visual hierarchy)
3. AI Bot View (LLM comprehension, entity mapping, Schema.org needs, semantic landmark tags)
4. SEO View (On-page technical factors, keyword placement, image accessibility, topical depth)
5. AEO View (Answer Engine Optimization for ChatGPT/Perplexity, Q&A headers, direct 40-word answers)
6. Business View (Commercial value proposition, objection busting, checkout/contact friction, buyer journey)

Assign every single issue to one of the 5 teams:
- "SEO Team"
- "Development Team"
- "Designer Team"
- "Content Team"
- "Marketing Team"

Also provide 5 Top Executive FAQ answers specifically addressing:
1. Why this website is losing or not getting enough Google leads.
2. Estimated Google SERP placement (Page 1 contender or Page 2-3+) for its main commercial keyword.
3. Speed & mobile user friction.
4. AI readiness (ChatGPT / Perplexity).
5. Exact priority tasks for the owner to assign to their agency/teams.

CRITICAL INSTRUCTION: Return ONLY valid, raw JSON with this exact JSON schema:
{
  "derivedMainKeyword": "string",
  "estimatedSerpPage": "Page 1 Contender" or "Page 2-3 (Needs Work)",
  "speedIndexSeconds": "1.8",
  "speedRating": "Fast" or "Moderate" or "Slow",
  "linkAuthorityScore": 65,
  "ownerFaqs": [
    { "q": "string", "a": "string" }
  ],
  "googleView": {
    "ownerSummary": "string",
    "checklist": [
      { "team": "SEO Team", "keyword": "string", "problem": "string", "solution": "string" }
    ]
  },
  "visitorView": {
    "ownerSummary": "string",
    "checklist": [
      { "team": "Content Team", "keyword": "string", "problem": "string", "solution": "string" }
    ]
  },
  "aiBotView": {
    "ownerSummary": "string",
    "checklist": [
      { "team": "Development Team", "keyword": "string", "problem": "string", "solution": "string" }
    ]
  },
  "seoView": {
    "ownerSummary": "string",
    "score": 82,
    "checklist": [
      { "team": "SEO Team", "keyword": "string", "problem": "string", "solution": "string" }
    ]
  },
  "aeoView": {
    "ownerSummary": "string",
    "readiness": "High Potential" or "Moderate",
    "checklist": [
      { "team": "Content Team", "keyword": "string", "problem": "string", "solution": "string" }
    ]
  },
  "businessView": {
    "ownerSummary": "string",
    "corePromise": "string",
    "checklist": [
      { "team": "Marketing Team", "keyword": "string", "problem": "string", "solution": "string" }
    ]
  }
}
Do not include markdown codeblocks (no \`\`\`json). Just the raw JSON object.
`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const aiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.statusText}`);
    }

    const aiData = await aiResponse.json();
    const rawText = aiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsedAudit = JSON.parse(rawText);

    return NextResponse.json({ success: true, aiAudit: parsedAudit });

  } catch (error) {
    console.warn('AI endpoint encountered issue, falling back to deep rule engine:', error.message);
    return NextResponse.json({ fallback: true, error: error.message });
  }
}