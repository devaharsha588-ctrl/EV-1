const parseJson = (text, fallback = {}) => {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return JSON.parse(match ? match[0] : text);
  } catch (error) {
    return fallback;
  }
};

module.exports = { parseJson };
