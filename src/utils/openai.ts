import OpenAI from 'openai';
import { ApiResponse } from '../types';

export async function analyzeResponse(apiKey: string, response: ApiResponse) {
  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  const prompt = `Analyze this API response and provide insights:

Status: ${response.status} ${response.statusText}
Headers: ${JSON.stringify(response.headers, null, 2)}
Body: ${JSON.stringify(response.body, null, 2)}

Please provide:
1. A summary of the response
2. Any potential issues or concerns
3. Suggestions for improvement
4. Data structure analysis
`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to analyze response');
  }
}