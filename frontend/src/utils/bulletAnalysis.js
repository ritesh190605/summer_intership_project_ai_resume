/**
 * Bullet point analysis utility for resume experience/project entries.
 * Provides real-time feedback on bullet points including weak phrase detection,
 * quantified achievement checks, and improvement suggestions.
 */

// Weak / passive / overused phrases to flag
const WEAK_PHRASES = [
  { pattern: /\bwas responsible for\b/i, severity: "high", suggestion: "Replace with a strong action verb (e.g., 'Led', 'Managed', 'Delivered')" },
  { pattern: /\bhelped with\b/i, severity: "high", suggestion: "Replace with 'Contributed to', 'Supported', or be more specific about your direct role" },
  { pattern: /\bworked on\b/i, severity: "medium", suggestion: "Use a specific action verb like 'Developed', 'Implemented', 'Designed'" },
  { pattern: /\binvolved in\b/i, severity: "high", suggestion: "Be direct — use 'Participated in', 'Contributed to', or specify your exact role" },
  { pattern: /\bwas part of\b/i, severity: "high", suggestion: "Replace with an active verb like 'Collaborated on', 'Co-led', 'Contributed to'" },
  { pattern: /\bduties included\b/i, severity: "high", suggestion: "Start with a strong action verb instead of listing generic duties" },
  { pattern: /\bresponsible for\b/i, severity: "medium", suggestion: "Swap for 'Owned', 'Managed', 'Oversaw', or 'Directed'" },
  { pattern: /\bused to\b/i, severity: "medium", suggestion: "Be more direct — 'Built X using Y' is stronger than 'Used Y to build X'" },
  { pattern: /\bwould\b/i, severity: "low", suggestion: "Use past tense action verbs describing what you actually did" },
  { pattern: /\b(just|simply|basically|merely)\b/i, severity: "medium", suggestion: "Remove minimizers — your contribution matters, present it confidently" },
  { pattern: /\bthought\b/i, severity: "medium", suggestion: "Replace with 'Proposed', 'Conceptualized', 'Recommended'" },
  { pattern: /\btried to\b/i, severity: "high", suggestion: "Replace with what you actually achieved — 'Implemented', 'Tested', 'Piloted'" },
  { pattern: /\bmade sure\b/i, severity: "medium", suggestion: "Replace with 'Ensured', 'Verified', 'Validated'" },
  { pattern: /\bhelped\b/i, severity: "medium", suggestion: "Specify exactly how you contributed — 'Streamlined', 'Accelerated', 'Facilitated'" },
  { pattern: /\bparticipated in\b/i, severity: "low", suggestion: "Be more specific — 'Co-developed', 'Contributed to', 'Assisted with'" },
  { pattern: /\blearned about\b/i, severity: "medium", suggestion: "Frame as achievement — 'Gained expertise in', 'Mastered', 'Became proficient in'" },
  { pattern: /\bwas tasked with\b/i, severity: "high", suggestion: "Start with what you accomplished, not what you were told to do" },
  { pattern: /\bhad to\b/i, severity: "high", suggestion: "Reframe proactively — 'Addressed', 'Resolved', 'Handled'" },
  { pattern: /\bgave\b/i, severity: "low", suggestion: "Use a more impactful verb: 'Presented', 'Delivered', 'Provided'" },
  { pattern: /\bmade\b/i, severity: "low", suggestion: "Use a precise verb: 'Created', 'Built', 'Developed', 'Produced'" },
  { pattern: /\bgot\b/i, severity: "medium", suggestion: "Replace with 'Achieved', 'Secured', 'Obtained', 'Earned'" },
];

// Action verbs by category for suggestions
const ACTION_VERBS = {
  leadership: ["Led", "Directed", "Managed", "Orchestrated", "Spearheaded", "Championed", "Coordinated", "Supervised", "Mentored", "Guided"],
  achievement: ["Achieved", "Delivered", "Drove", "Generated", "Secured", "Exceeded", "Accelerated", "Produced", "Completed", "Accomplished"],
  improvement: ["Improved", "Optimized", "Streamlined", "Enhanced", "Reduced", "Transformed", "Revamped", "Refined", "Overhauled", "Upgraded"],
  creation: ["Built", "Developed", "Created", "Designed", "Implemented", "Established", "Launched", "Engineered", "Architected", "Founded"],
  analysis: ["Analyzed", "Evaluated", "Assessed", "Audited", "Investigated", "Researched", "Validated", "Forecasted", "Modeled", "Quantified"],
  communication: ["Presented", "Authored", "Published", "Documented", "Pitched", "Demonstrated", "Facilitated", "Negotiated", "Persuaded", "Advocated"],
  technical: ["Automated", "Integrated", "Deployed", "Configured", "Migrated", "Scaled", "Programmed", "Coded", "Refactored", "Containerized"],
  metric: ["Increased", "Decreased", "Reduced", "Grew", "Boosted", "Cut", "Minimized", "Expanded", "Maximized", "Tripled"],
};

// Quantified achievement regex patterns
const QUANTIFIED_PATTERNS = [
  /\d+%/,
  /\$\d[\d,]*\.?\d*/,
  /\d+[KRMBkmb]?\b/,
  /\b\d{2,}\b/,
  /[1-9]\d* ×/,
  /\d+[ -]?(percent|fold|times|users|customers|clients|projects|teams|people|members|revenue|sales|cost|budget|hours|days|weeks|months|years|requests|queries|transactions|records|files|documents|reports|countries|cities|offices|locations|sessions|page views|downloads|installs|ratings|reviews|articles|posts|tweets|emails|calls|meetings|presentations|reports)/i,
];

const COMMON_ACTION_STARTERS = [
  "Led", "Managed", "Developed", "Created", "Built", "Implemented",
  "Designed", "Launched", "Delivered", "Improved", "Optimized", "Reduced",
  "Increased", "Established", "Generated", "Transformed", "Automated",
];

/**
 * Analyze a single bullet point for weak phrases.
 */
export function findWeakPhrases(text) {
  if (!text || text.trim().length < 3) return [];
  return WEAK_PHRASES.filter(({ pattern }) => pattern.test(text));
}

/**
 * Check if a bullet point contains quantified achievements.
 */
export function hasQuantifiedAchievement(text) {
  if (!text || text.trim().length < 3) return false;
  return QUANTIFIED_PATTERNS.some((re) => re.test(text));
}

/**
 * Generate improvement suggestions for a bullet point.
 */
export function generateSuggestions(text) {
  const suggestions = [];

  if (!text || text.trim().length < 3) return suggestions;

  const weakPhrases = findWeakPhrases(text);
  const hasQuantified = hasQuantifiedAchievement(text);

  // 1. Weak phrase suggestions
  weakPhrases.forEach((wp) => {
    suggestions.push({
      type: "weak_phrase",
      severity: wp.severity,
      message: wp.suggestion,
      priority: wp.severity === "high" ? 1 : wp.severity === "medium" ? 2 : 3,
    });
  });

  // 2. Quantified achievement check
  if (!hasQuantified) {
    suggestions.push({
      type: "quantification",
      severity: "medium",
      message: "Add measurable impact — include percentages, dollar amounts, time saved, or user/customer metrics",
      priority: 2,
    });
  }

  // 3. Check for action verb at start
  const firstWord = text.trim().split(/\s+/)[0];
  if (firstWord && !COMMON_ACTION_STARTERS.some((v) => text.trim().toLowerCase().startsWith(v.toLowerCase() + " ")) && !text.trim().toLowerCase().startsWith(firstWord.toLowerCase() + " ")) {
    const hasWeakStart = WEAK_PHRASES.some((wp) => wp.pattern.test(text));
    if (!hasWeakStart && !weakPhrases.some((wp) => wp.pattern.test(text))) {
      suggestions.push({
        type: "action_verb",
        severity: "low",
        message: `Start with a strong action verb such as: ${getRandomVerbs(3).join(", ")}`,
        priority: 3,
      });
    }
  }

  // 4. Check length - too short
  if (text.trim().split(/\s+/).length < 6) {
    suggestions.push({
      type: "too_short",
      severity: "medium",
      message: "This bullet point is very short — add more context about what you did and the impact",
      priority: 2,
    });
  }

  // 5. Check for technology mention
  const techKeywords = /\b(React|Node|Python|Java|AWS|Azure|Docker|Kubernetes|SQL|MongoDB|Redis|GraphQL|REST|API|Git|CI\/CD|Agile|Scrum|Jira)\b/i;
  if (!techKeywords.test(text)) {
    suggestions.push({
      type: "tech_context",
      severity: "low",
      message: "Consider mentioning specific technologies, tools, or frameworks used",
      priority: 3,
    });
  }

  // Sort by priority
  suggestions.sort((a, b) => a.priority - b.priority);

  return suggestions;
}

/**
 * Get a complete analysis object for a bullet point.
 */
export function analyzeBulletPoint(text) {
  if (!text || text.trim().length < 3) {
    return {
      weakPhrases: [],
      hasQuantified: false,
      suggestions: [],
      score: 0,
    };
  }

  const weakPhrases = findWeakPhrases(text);
  const hasQuantified = hasQuantifiedAchievement(text);
  const suggestions = generateSuggestions(text);

  // Calculate a score 0-100
  let score = 50; // base
  score -= weakPhrases.filter((wp) => wp.severity === "high").length * 15;
  score -= weakPhrases.filter((wp) => wp.severity === "medium").length * 8;
  score -= weakPhrases.filter((wp) => wp.severity === "low").length * 3;
  if (hasQuantified) score += 25;
  if (text.trim().length > 60) score += 10;
  if (text.trim().length > 120) score += 5;
  score = Math.max(0, Math.min(100, score));

  return {
    weakPhrases,
    hasQuantified,
    suggestions,
    score,
  };
}

function getRandomVerbs(count = 3) {
  const all = Object.values(ACTION_VERBS).flat();
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
