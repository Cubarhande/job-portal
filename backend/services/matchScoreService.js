const normalize = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const calculateMatchScore = (candidate, job, resume) => {
  let score = 0;

  const reasons = [];

  // --------------------------------
  // Required Skills = 40 points
  // --------------------------------

  const candidateSkills = [...(candidate.skills || [])].map(normalize);

  const requiredSkills = [...(job.requiredSkills || [])].map(normalize);

  const matchedRequiredSkills = requiredSkills.filter((skill) =>
    candidateSkills.includes(skill),
  );

  const skillScore =
    requiredSkills.length > 0
      ? (matchedRequiredSkills.length / requiredSkills.length) * 40
      : 0;

  score += skillScore;

  if (matchedRequiredSkills.length) {
    reasons.push(`Matched skills: ${matchedRequiredSkills.join(", ")}`);
  }

  // --------------------------------
  // Experience = 20 points
  // --------------------------------

  const experience = Number(candidate.experience) || 0;

  if (experience >= job.minExperience && experience <= job.maxExperience) {
    score += 20;

    reasons.push("Experience matches the job requirement");
  } else {
    const difference =
      experience < job.minExperience
        ? job.minExperience - experience
        : experience - job.maxExperience;

    if (difference <= 1) {
      score += 10;

      reasons.push("Experience is close to the requirement");
    }
  }

  // --------------------------------
  // Location = 15 points
  // --------------------------------

  if (
    job.location &&
    candidate.location &&
    normalize(candidate.location).includes(normalize(job.location))
  ) {
    score += 15;

    reasons.push("Location matches");
  } else if (job.workMode === "Remote") {
    score += 15;

    reasons.push("Remote job");
  }

  // --------------------------------
  // Notice Period = 10 points
  // --------------------------------

  if (candidate.noticePeriod <= job.noticePeriod) {
    score += 10;

    reasons.push("Notice period matches");
  }

  // --------------------------------
  // Preferred Skills = 5 points
  // --------------------------------

  const preferredSkills = [...(job.preferredSkills || [])].map(normalize);

  const matchedPreferredSkills = preferredSkills.filter((skill) =>
    candidateSkills.includes(skill),
  );

  if (preferredSkills.length > 0 && matchedPreferredSkills.length > 0) {
    score += 5;

    reasons.push(`Preferred skills: ${matchedPreferredSkills.join(", ")}`);
  }

  // --------------------------------
  // Resume Text Bonus
  // --------------------------------

  if (resume?.extractedText && requiredSkills.length) {
    const resumeText = normalize(resume.extractedText);

    const resumeMatches = requiredSkills.filter((skill) =>
      resumeText.includes(skill),
    );

    if (resumeMatches.length > 0) {
      reasons.push("Required skills found in resume");
    }
  }

  return {
    score: Math.min(Math.round(score), 100),

    matchedSkills: matchedRequiredSkills,

    reasons,
  };
};

module.exports = calculateMatchScore;
