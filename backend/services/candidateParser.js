function cleanText(text) {
  return text
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

// ------------------------------------
// Email
// ------------------------------------

function extractEmail(text) {
  const match = text.match(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
  );

  return match ? match[0] : "";
}

// ------------------------------------
// Phone
// ------------------------------------

function extractPhone(text) {
  const match = text.match(
    /(?:\+91[\s-]?)?[6-9]\d{9}/
  );

  return match ? match[0] : "";
}

// ------------------------------------
// Experience
// ------------------------------------

function extractExperience(text) {
  const match = text.match(
    /(\d+(?:\.\d+)?)\s*(?:\+)?\s*(?:years?|yrs?)/i
  );

  return match
    ? Number(match[1])
    : null;
}

// ------------------------------------
// Skills
// ------------------------------------

function extractSkills(text) {
  const skillList = [
    "JavaScript",
    "TypeScript",
    "React",
    "React.js",
    "Next.js",
    "Node.js",
    "Express",
    "Express.js",
    "MongoDB",
    "MySQL",
    "PostgreSQL",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "Bootstrap",
    "Python",
    "Java",
    "C++",
    "Git",
    "GitHub",
    "Docker",
    "AWS",
    "REST API",
  ];

  const lowerText =
    text.toLowerCase();

  const found = skillList.filter(
    (skill) =>
      lowerText.includes(
        skill.toLowerCase()
      )
  );

  return [
    ...new Set(found),
  ];
}

// ------------------------------------
// Location
// ------------------------------------

function extractLocation(text) {
  const locations = [
    "Pune",
    "Mumbai",
    "Chinchwad",
    "Bangalore",
    "Bengaluru",
    "Hyderabad",
    "Delhi",
    "Noida",
    "Gurgaon",
    "Gurugram",
    "Chennai",
    "Ahmedabad",
    "Nagpur",
    "Nashik",
  ];

  const lowerText =
    text.toLowerCase();

  return (
    locations.find((location) =>
      lowerText.includes(
        location.toLowerCase()
      )
    ) || ""
  );
}

// ------------------------------------
// Position
// ------------------------------------

function extractPosition(text) {
  const positions = [
    "MERN Developer",
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "React Developer",
    "Node.js Developer",
    "Software Engineer",
    "Software Developer",
    "Web Developer",
    "Java Developer",
    "Python Developer",
  ];

  const lowerText =
    text.toLowerCase();

  return (
    positions.find((position) =>
      lowerText.includes(
        position.toLowerCase()
      )
    ) || ""
  );
}

// ------------------------------------
// Name
// ------------------------------------

function extractName(text) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const ignoredWords = [
    "resume",
    "curriculum vitae",
    "cv",
    "profile",
    "contact",
    "objective",
  ];

  for (const line of lines.slice(
    0,
    10
  )) {
    const lower =
      line.toLowerCase();

    if (
      ignoredWords.some((word) =>
        lower.includes(word)
      )
    ) {
      continue;
    }

    if (
      /^[A-Za-z]+(?:\s+[A-Za-z]+){1,3}$/.test(
        line
      )
    ) {
      return line;
    }
  }

  return "";
}

// ------------------------------------
// Main Parser
// ------------------------------------

function parseCandidateResume(
  rawText
) {
  const text =
    cleanText(rawText);

  return {
    name: extractName(text),

    email:
      extractEmail(text),

    phone:
      extractPhone(text),

    experience:
      extractExperience(text),

    skills:
      extractSkills(text),

    location:
      extractLocation(text),

    currentPosition:
      extractPosition(text),
  };
}

module.exports = {
  parseCandidateResume,
};