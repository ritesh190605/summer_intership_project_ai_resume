import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Strict system prompt shared by both providers. Forces a single JSON object
 * response so the controller can parse it deterministically.
 */
const buildSystemPrompt = () => `
You are an expert technical resume reviewer and ATS (Applicant Tracking System)
optimization specialist with 15+ years of experience across software engineering,
product, and design hiring. You are precise, constructive, and never generic.

You will receive a candidate's resume as structured JSON (personalInfo, education,
experience, skills, projects, targetRole).

Your task: analyze the resume and return ONLY a single valid JSON object — no markdown
fences, no prose, no commentary before or after — matching EXACTLY this shape:

{
  "overallScore": <integer 0-100>,
  "improvements": [
    {
      "section": "personalInfo" | "experience" | "education" | "skills" | "projects" | "certifications" | "languages" | "general",
      "originalText": "<verbatim snippet from the resume this suggestion targets>",
      "suggestedText": "<your improved rewrite of that snippet>",
      "reason": "<concise explanation, 1-2 sentences, of why this is stronger (e.g. quantification, action verbs, ATS keyword alignment)>"
    }
  ],
  "missingKeywords": ["<industry/role-specific keyword or skill not present in the resume>"]
}

Rules:
- "overallScore" must reflect clarity, quantified impact, keyword relevance to targetRole,
  and structure. Be honest — do not default to high scores.
- Provide between 3 and 8 items in "improvements", prioritizing experience bullet points
  and the professional summary. Only include an improvement if "originalText" is an actual
  excerpt found in the provided resume JSON.
- "missingKeywords" should contain 5-12 realistic, role-relevant terms (skills, tools,
  certifications, or phrases) an ATS would scan for, that are absent from the resume.
- Return valid, parseable JSON only. Do not wrap the JSON in \`\`\`json or any other text.
`.trim();

const buildUserPrompt = (resumeData) => `
Analyze the following resume JSON and respond with the JSON object described in your
instructions only:

${JSON.stringify(resumeData, null, 2)}
`.trim();

/**
 * Extracts a JSON object from a raw LLM string, defensively stripping
 * markdown code fences if the model adds them despite instructions.
 */
const safeParseJSON = (raw) => {
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  const jsonSlice = cleaned.slice(firstBrace, lastBrace + 1);
  return JSON.parse(jsonSlice);
};

/* ------------------------------ Gemini ------------------------------ */

const callGemini = async (resumeData) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-3.5-flash",
    systemInstruction: buildSystemPrompt(),
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.4,
    },
  });

  const result = await model.generateContent(buildUserPrompt(resumeData));
  const text = result.response.text();
  return safeParseJSON(text);
};

/* ------------------------------ OpenAI ------------------------------ */

const callOpenAI = async (resumeData) => {
  // Lazy import so the OpenAI SDK is only required if actually selected.
  const { default: OpenAI } = await import("openai");
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: buildUserPrompt(resumeData) },
    ],
  });

  const text = completion.choices[0].message.content;
  return safeParseJSON(text);
};

/**
 * Public entry point used by the controller. Picks the provider based on
 * AI_PROVIDER env var so switching vendors requires no code changes.
 */
export const analyzeResumeWithAI = async (resumeData) => {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();

  if (provider === "openai") {
    return callOpenAI(resumeData);
  }
  return callGemini(resumeData);
};

/* ===================================================================
   ADVANCED ANALYSIS FUNCTIONS
   Each function returns a structured JSON object for a specific
   analysis dimension. They share the same provider-agnostic pattern.
   =================================================================== */

/**
 * Generic helper to call the configured AI provider with an arbitrary
 * system prompt + user prompt and return parsed JSON.
 */
const callAI = async (systemPrompt, userPrompt, temperature = 0.3) => {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();

  if (provider === "openai") {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });
    return safeParseJSON(completion.choices[0].message.content);
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-3.5-flash",
    systemInstruction: systemPrompt,
    generationConfig: {
      responseMimeType: "application/json",
      temperature,
    },
  });
  const result = await model.generateContent(userPrompt);
  return safeParseJSON(result.response.text());
};

/* ------- 1. ATS & Job Description Matching ------- */

const buildATSSystemPrompt = () => `
You are an ATS (Applicant Tracking System) compatibility expert and hiring optimization specialist.

You will receive:
1. A candidate's resume as structured JSON.
2. A job description (plain text) if provided, otherwise infer from the resume's targetRole.

Return ONLY a single valid JSON object matching EXACTLY this shape:

{
  "overall": <integer 0-100>,
  "keywordMatch": <integer 0-100>,
  "formatCompatibility": <integer 0-100>,
  "sectionCompleteness": <integer 0-100>,
  "missingSections": ["<section name that is absent or too sparse>"],
  "recommendations": ["<actionable recommendation 1>", "<recommendation 2>"]
}

Rules:
- "overall" is the weighted ATS compatibility score.
- "keywordMatch" measures how well the resume's skills, experience, and education align with the job description keywords.
- "formatCompatibility" scores how ATS-friendly the resume structure is (standard headings, no columns/tables, proper section ordering).
- "sectionCompleteness" evaluates if all expected sections are present with sufficient detail.
- "missingSections" lists sections typically expected by ATS that are missing or severely lacking.
- "recommendations" provides 3-7 specific, actionable suggestions to improve ATS score.
- Return valid parseable JSON only.
`.trim();

/**
 * Evaluate ATS compatibility of a resume against a job description.
 * @param {object} resumeData - structured resume JSON
 * @param {string|null} jobDescription - plain text job description (optional)
 * @returns {object} ATS score object
 */
export const analyzeATSCompatibility = async (resumeData, jobDescription = null) => {
  const userPrompt = `
Resume JSON:
${JSON.stringify(resumeData, null, 2)}

${jobDescription ? `Job Description:\n${jobDescription}` : `Target Role: ${resumeData.targetRole || "Not specified"}`}
`.trim();
  return callAI(buildATSSystemPrompt(), userPrompt, 0.3);
};

/* ------- 2. Skill Gap Analysis ------- */

const buildSkillGapSystemPrompt = () => `
You are a skill gap analysis expert for technical hiring. You analyze a candidate's current skills against the requirements of their target role or a provided job description.

You will receive:
1. A candidate's resume as structured JSON (with skills, experience, education).
2. A target role or job description.

Return ONLY a single valid JSON object matching EXACTLY this shape:

{
  "skillGaps": [
    {
      "skill": "<string, the missing or underdeveloped skill>",
      "category": "Technical" | "Soft" | "Tool" | "Other",
      "importance": "Critical" | "Important" | "Nice-to-have",
      "currentStatus": "Missing" | "Present but needs improvement" | "Partially present",
      "suggestion": "<string, actionable advice to acquire or improve this skill>"
    }
  ]
}

Rules:
- Identify 5-12 skill gaps most relevant to the target role.
- "importance" is how crucial the skill is for the role (Critical = dealbreaker, Important = highly valued, Nice-to-have = bonus).
- "suggestion" must be actionable (e.g., "Take a React advanced patterns course", "Build a project with Docker").
- For skills that are partially present, explain what's missing.
- Consider both technical skills and soft skills.
- Return valid parseable JSON only.
`.trim();

/**
 * Analyze gaps between candidate's skills and target role requirements.
 * @param {object} resumeData - structured resume JSON
 * @param {string|null} jobDescription - optional job description text
 * @returns {object} { skillGaps: [...] }
 */
export const analyzeSkillGaps = async (resumeData, jobDescription = null) => {
  const userPrompt = `
Resume JSON (skills, experience, projects, education):
${JSON.stringify({ skills: resumeData.skills, experience: resumeData.experience, projects: resumeData.projects, education: resumeData.education, targetRole: resumeData.targetRole }, null, 2)}

${jobDescription ? `Job Description:\n${jobDescription}` : `Target Role: ${resumeData.targetRole || "Not specified"}`}
`.trim();
  return callAI(buildSkillGapSystemPrompt(), userPrompt, 0.3);
};

/* ------- 3. Keyword Density & Context Check ------- */

const buildKeywordDensitySystemPrompt = () => `
You are an SEO and ATS keyword optimization specialist for resumes. You analyze keyword usage frequency, density, and the quality of context around each keyword.

You will receive a candidate's resume as structured JSON.

Return ONLY a single valid JSON object matching EXACTLY this shape:

{
  "keywordDensity": [
    {
      "keyword": "<string, the keyword or phrase>",
      "count": <integer, number of occurrences>,
      "density": <number, percentage of total content this keyword represents>,
      "context": "<string, a brief snippet showing how the keyword is used>",
      "relevance": "High" | "Medium" | "Low"
    }
  ],
  "overallKeywordScore": <integer 0-100>,
  "suggestions": ["<string suggestion 1>", "<string suggestion 2>"]
}

Rules:
- Analyze the full resume content across all sections.
- Identify 8-15 important keywords relevant to the target role.
- "density" is approximate percentage (keyword count / total word count * 100).
- "context" should show the surrounding phrase showing proper usage (up to 100 chars).
- "relevance" indicates how critical this keyword is for the target industry/role.
- "overallKeywordScore" rates how well the resume uses industry keywords.
- "suggestions" provides 2-5 ideas for better keyword optimization.
- Return valid parseable JSON only.
`.trim();

/**
 * Analyze keyword density, frequency, and usage context in a resume.
 * @param {object} resumeData - structured resume JSON
 * @returns {object} { keywordDensity: [...], overallKeywordScore: number, suggestions: [...] }
 */
export const analyzeKeywordDensity = async (resumeData) => {
  const userPrompt = `
Analyze keyword density for this resume JSON. Consider all fields (personalInfo.summary, experience[].responsibilities, skills[].name, projects[].technologies, etc.):

${JSON.stringify(resumeData, null, 2)}
`.trim();
  return callAI(buildKeywordDensitySystemPrompt(), userPrompt, 0.3);
};

/* ------- 4. Context Quality & Impact Evaluation ------- */

const buildContextQualitySystemPrompt = () => `
You are a resume writing quality expert. You evaluate each experience bullet point and project description for impact, quantified results, action verbs, and contextual richness.

You will receive a candidate's resume experience and projects as structured JSON.

Return ONLY a single valid JSON object matching EXACTLY this shape:

{
  "contextQuality": [
    {
      "section": "experience" | "projects",
      "item": "<string, the original bullet point or description text>",
      "score": <integer 0-100>,
      "feedback": "<string, specific constructive feedback>",
      "hasQuantifiedImpact": <boolean>,
      "hasActionVerbs": <boolean>,
      "hasContext": <boolean>
    }
  ],
  "overallContextScore": <integer 0-100>,
  "summaryFeedback": "<string, overall assessment of resume impact quality>"
}

Rules:
- Evaluate each responsibility bullet point from experience[] and description from projects[].
- "hasQuantifiedImpact" = true if the item includes numbers, percentages, dollar amounts, or other metrics.
- "hasActionVerbs" = true if the item starts with or contains strong action verbs (e.g., Led, Developed, Designed, Implemented, Optimized).
- "hasContext" = true if the item explains the situation, scope, or significance beyond just stating a task.
- "score" should reflect: quantified impact (40%), action verbs (30%), context (30%).
- "feedback" should be specific (e.g., "Add the percentage improvement in API response time" or "Start with a stronger action verb like 'Architected' instead of 'Worked on'").
- "overallContextScore" is the average across all evaluated items.
- Return valid parseable JSON only.
`.trim();

/**
 * Evaluate the quality and impact of each bullet point and description.
 * @param {object} resumeData - structured resume JSON
 * @returns {object} { contextQuality: [...], overallContextScore: number, summaryFeedback: string }
 */
export const evaluateContextQuality = async (resumeData) => {
  const userPrompt = `
Evaluate the quality, impact, and action-orientation of each bullet point in this resume:

Experience:
${JSON.stringify(resumeData.experience, null, 2)}

Projects:
${JSON.stringify(resumeData.projects, null, 2)}

Target Role: ${resumeData.targetRole || "Not specified"}
`.trim();
  return callAI(buildContextQualitySystemPrompt(), userPrompt, 0.3);
};

/* ------- 5. Tech Stack Recommendation ------- */

const buildTechStackSystemPrompt = () => `
You are a senior technology advisor and career coach. Based on a candidate's target role, current skills, and experience, you recommend the most relevant technologies to learn or highlight to be competitive in today's job market.

You will receive:
1. The candidate's resume as structured JSON (skills, experience, projects).
2. Their target role.

Return ONLY a single valid JSON object matching EXACTLY this shape:

{
  "techStackRecommendations": [
    {
      "category": "<string, e.g. Frontend, Backend, DevOps, Mobile, Data Science, AI/ML, Design, Testing, Database, Cloud, Security>",
      "recommended": ["<technology 1>", "<technology 2>", "<technology 3>"],
      "rationale": "<string, why these technologies are recommended for the target role and how they complement existing skills>"
    }
  ],
  "overallGuidance": "<string, broader career advice on technology stack positioning>"
}

Rules:
- Recommend 3-6 technology categories.
- Each category should have 2-5 specific technologies.
- "rationale" must tie the recommendation to the candidate's existing skills and the target role's market demands.
- Consider: current industry trends, job market demand, synergy with candidate's existing stack.
- If the candidate already has strong skills in an area, recommend complementary or advanced technologies.
- Be specific with versions or frameworks when relevant (e.g., "React 18 with Next.js 14" not just "React").
- Return valid parseable JSON only.
`.trim();

/**
 * Recommend technologies to learn or highlight based on target role and current skills.
 * @param {object} resumeData - structured resume JSON
 * @returns {object} { techStackRecommendations: [...], overallGuidance: string }
 */
export const recommendTechStack = async (resumeData) => {
  const userPrompt = `
Based on this candidate's profile, recommend technologies to learn or highlight for their target role:

Current Skills:
${JSON.stringify(resumeData.skills, null, 2)}

Experience:
${JSON.stringify(resumeData.experience.map(e => ({ role: e.role, company: e.company, responsibilities: e.responsibilities })), null, 2)}

Projects Technologies:
${JSON.stringify(resumeData.projects?.map(p => p.technologies).flat().filter(Boolean), null, 2)}

Target Role: ${resumeData.targetRole || "Not specified"}
`.trim();
  return callAI(buildTechStackSystemPrompt(), userPrompt, 0.3);
};

/**
 * Run all advanced analyses in parallel for maximum efficiency.
 * @param {object} resumeData - structured resume JSON
 * @param {string|null} jobDescription - optional job description text
 * @returns {object} combined advanced analysis result
 */
export const runFullAdvancedAnalysis = async (resumeData, jobDescription = null) => {
  const [atsResult, skillGapResult, keywordResult, contextResult, techStackResult] =
    await Promise.allSettled([
      analyzeATSCompatibility(resumeData, jobDescription),
      analyzeSkillGaps(resumeData, jobDescription),
      analyzeKeywordDensity(resumeData),
      evaluateContextQuality(resumeData),
      recommendTechStack(resumeData),
    ]);

  return {
    atsScore: atsResult.status === "fulfilled" ? atsResult.value : null,
    skillGaps: skillGapResult.status === "fulfilled" ? skillGapResult.value?.skillGaps || [] : [],
    keywordDensity: keywordResult.status === "fulfilled" ? keywordResult.value?.keywordDensity || [] : [],
    contextQuality: contextResult.status === "fulfilled" ? contextResult.value?.contextQuality || [] : [],
    techStackRecommendations: techStackResult.status === "fulfilled" ? techStackResult.value?.techStackRecommendations || [] : [],
    analyzedAt: new Date(),
  };
};

/**
 * Strict system prompt for extracting raw resume text into structured schema JSON.
 */
const buildParserSystemPrompt = () => `
You are an advanced AI resume parser. Your task is to extract information from raw unstructured resume text and convert it into a single, clean JSON object matching the schema below.

Required JSON Structure:
{
  "personalInfo": {
    "fullName": "<string, required>",
    "email": "<string, required, valid email or empty string if not found>",
    "phone": "<string, digits only, max 10 chars, or empty string>",
    "location": "<string, e.g. City, State or empty string>",
    "headline": "<string, e.g. Senior Software Engineer or empty string>",
    "summary": "<string, professional summary or empty string>",
    "pronouns": "<string, e.g. he/him, she/her, they/them or empty string>",
    "nationality": "<string, e.g. US Citizen, or empty string>",
    "linkedin": "<string, url or empty string>",
    "github": "<string, url or empty string>",
    "portfolio": "<string, url or empty string>"
  },
  "targetRole": "<string, inferred target role, e.g. Frontend Engineer or empty string>",
  "education": [
    {
      "institution": "<string, required>",
      "degree": "<string, required>",
      "fieldOfStudy": "<string or empty string>",
      "startDate": "<string, format YYYY-MM-DD or empty string>",
      "endDate": "<string, format YYYY-MM-DD or empty string>",
      "isCurrent": <boolean>,
      "grade": "<string or empty string>",
      "description": "<string or empty string>"
    }
  ],
  "experience": [
    {
      "company": "<string, required>",
      "role": "<string, required>",
      "location": "<string or empty string>",
      "startDate": "<string, format YYYY-MM-DD or empty string>",
      "endDate": "<string, format YYYY-MM-DD or empty string>",
      "isCurrent": <boolean>,
      "employmentType": "<string, one of Full-time, Part-time, Contract, Internship, Freelance, Other or empty string>",
      "responsibilities": ["<string, responsibility bullet point 1>", "<string, bullet point 2>"]
    }
  ],
  "skills": [
    {
      "name": "<string, required, e.g. JavaScript>",
      "category": "<string, one of Technical, Soft, Tool, Language, Other. Default Technical>",
      "proficiency": "<string, one of Beginner, Intermediate, Advanced, Expert. Default Intermediate>"
    }
  ],
  "projects": [
    {
      "title": "<string, required>",
      "description": "<string or empty string>",
      "technologies": ["<string, technology 1>", "<string, technology 2>"],
      "link": "<string, url or empty string>",
      "startDate": "<string, format YYYY-MM-DD or empty string>",
      "endDate": "<string, format YYYY-MM-DD or empty string>"
    }
  ],
  "certifications": [
    {
      "title": "<string, required>",
      "issuer": "<string or empty string>",
      "date": "<string, format YYYY-MM-DD or empty string>",
      "link": "<string, url or empty string>",
      "description": "<string or empty string>"
    }
  ],
  "languages": [
    {
      "language": "<string, required>",
      "proficiency": "<string, one of Native, Fluent, Advanced, Intermediate, Basic. Default Intermediate>"
    }
  ]
}

Instructions:
1. Only return the JSON object, do not return any prose, markdown block, or conversational text.
2. If certain fields (like linkedin, github, grades) are not present, set them to empty string or empty array as specified.
3. Be as accurate as possible in mapping the raw text to these fields.
4. Keep responsibilities to short phrases or sentences.
5. In date fields, extract as YYYY-MM-DD. If only month and year are available, use YYYY-MM-01.
6. The phone number must consist of digits only (strip spaces, hyphens, and brackets) and be truncated to max 10 digits.
`.trim();

/**
 * Public entry point to parse raw text to structured resume JSON.
 */
export const extractResumeDataWithAI = async (rawText) => {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  const userPrompt = `Parse the following raw resume text into the requested JSON schema:\n\n${rawText}`;

  if (provider === "openai") {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: buildParserSystemPrompt() },
        { role: "user", content: userPrompt },
      ],
    });
    return safeParseJSON(completion.choices[0].message.content);
  } else {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-3.5-flash",
      systemInstruction: buildParserSystemPrompt(),
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });
    const result = await model.generateContent(userPrompt);
    return safeParseJSON(result.response.text());
  }
};


/* ------- 6. Interview Questions Generator ------- */

