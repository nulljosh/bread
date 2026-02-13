// Truncate long strings with ellipsis
export const tldr = (question, maxLen = 50) => {
  if (!question || question.length <= maxLen) return question;
  const truncated = question.slice(0, maxLen);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 20 ? truncated.slice(0, lastSpace) : truncated) + '...';
};
