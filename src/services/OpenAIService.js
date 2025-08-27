const OpenAI = require('openai');

class OpenAIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
    this.temperature = parseFloat(process.env.OPENAI_TEMPERATURE) || 0.8;
    
    if (this.apiKey) {
      this.openai = new OpenAI({
        apiKey: this.apiKey
      });
    }
  }

  async rewrite(text, style = null) {
    // If no API key is provided, return mock variants
    if (!this.apiKey) {
      return this.getMockVariants(text);
    }

    try {
      const prompt = this.buildPrompt(text, style);
      
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: this.temperature,
        max_tokens: 500
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      return this.parseVariants(response);
    } catch (error) {
      console.error('OpenAI service error:', error);
      // Fallback to mock variants on error
      return this.getMockVariants(text);
    }
  }

  buildPrompt(text, style) {
    let prompt = `Rewrite the following text in 3-5 punchy, viral variations. Make them engaging and shareable. Return only the variations, one per line, numbered:

Original: "${text}"`;

    if (style) {
      prompt += `\nStyle: ${style}`;
    }

    return prompt;
  }

  parseVariants(response) {
    // Split by lines and filter out empty lines, remove numbering
    const variants = response
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^\d+\.\s*/, '')) // Remove numbering like "1. "
      .filter(line => line.length > 0);

    // Ensure we have at least 3 variants
    if (variants.length < 3) {
      return this.getMockVariants(response);
    }

    return variants;
  }

  getMockVariants(text) {
    const baseVariants = [
      `💥 ${text} - but make it VIRAL!`,
      `🔥 Hot take: ${text.toLowerCase()}`,
      `✨ Plot twist: ${text}`,
      `🚀 Breaking: ${text}`,
      `💎 Golden truth: ${text}`
    ];

    // Return 3-5 random variants
    const shuffled = baseVariants.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(5, Math.max(3, shuffled.length)));
  }
}

module.exports = OpenAIService;