import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIApi } from 'openai/api';
import { Configuration } from 'openai/configuration';

import { ApiError } from '@/core/types/api/error';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (!config.apiKey) {
    res.status(500).json({
      error: {
        message: 'OpenAI API key not configured, please follow instructions in README.md',
      },
    });
    return;
  }

  const text = req.body.text || '';
  if (text.trim().length === 0) {
    res.status(400).json({
      error: {
        message: 'Please, ask a question.',
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: text,
      temperature: 0.2,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    const typedError = error as ApiError;

    // Consider adjusting the error handling logic for your use case
    if (typedError.response) {
      console.error(typedError.response.status, typedError.response.data);
      res.status(typedError.response.status).json(typedError.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${typedError.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    }
  }
}
