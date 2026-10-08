const fs = require("fs");

let c = fs.readFileSync("backend/utils/aiService.js", "utf8");

// Remove corrupted content after last valid section
let idx = c.lastIndexOf("/* ------- 6. Interview Questions Generator ------- */");
if (idx >= 0) {
  c = c.substring(0, idx);
}
c = c.trimEnd() + "\n\n";

// Build the interview questions code
const nl = "\n";
let out = "";
out += "/* ------- 6. Interview Questions Generator ------- */" + nl;
out += nl;
out += "const buildInterviewQuestionsSystemPrompt = () => {" + nl;
out += '  var prompt = "";' + nl;
out += '  prompt += "You are an expert technical interviewer and career coach.\\n";' + nl;
out += '  prompt += "Based on resume data, generate realistic interview questions tailored to the resume.\\n";' + nl;
out += '  prompt += "\\n";' + nl;
out += '  prompt += "Return ONLY valid JSON matching this shape:\\n";' + nl;
out += '  prompt += "{\\n";' + nl;
out += '  prompt += "  \\"questions\\": [\\n";' + nl;
out += '  prompt += "    {\\n";' + nl;
out += '  prompt += "      \\"category\\": \\"Technical\\" | \\"Behavioral\\" | \\"System Design\\" | \\"Project Deep-Dive\\" | \\"Role-specific\\",\\n";' + nl;
out += '  prompt += "      \\"question\\": \\"string\\",\\n";' + nl;
out += '  prompt += "      \\"context\\": \\"string, why relevant based on resume\\",\\n";' + nl;
out += '  prompt += "      \\"difficulty\\": \\"Easy\\" | \\"Medium\\" | \\"Hard\\",\\n";' + nl;
out += '  prompt += "      \\"suggestedApproach\\": \\"string, answering tips\\"\\n";' + nl;
out += '  prompt += "    }\\n";' + nl;
out += '  prompt += "  ],\\n";' + nl;
out += '  prompt += "  \\"overallGuidance\\": \\"string, general interview prep advice\\"\\n";' + nl;
out += '  prompt += "}\\n";' + nl;
out += '  prompt += "\\nRules: Generate 8-15 questions covering different categories. Include 30% technical, 25% behavioral, 15% system design, 15% project deep-dive, 15% role-specific. Return valid JSON only.\\n";' + nl;
out += "  return prompt;" + nl;
out += "};" + nl;
out += nl;
out += "export const generateInterviewQuestions = async (resumeData) => {" + nl;
out += '  var userPrompt = "";' + nl;
out += '  userPrompt += "Generate custom interview questions for this candidate based on their resume:\\n\\n";' + nl;
out += '  userPrompt += "Full Resume:\\n";' + nl;
out += '  userPrompt += JSON.stringify(resumeData, null, 2) + "\\n\\n";' + nl;
out += '  userPrompt += "Target Role: " + (resumeData.targetRole || "Not specified");' + nl;
out += "  return callAI(buildInterviewQuestionsSystemPrompt(), userPrompt, 0.4);" + nl;
out += "};" + nl;

c += out;
fs.writeFileSync("backend/utils/aiService.js", c, "utf8");
console.log("Interview questions generator added successfully");
