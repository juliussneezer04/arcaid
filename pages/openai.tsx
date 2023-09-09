import env from '../config.json'
import { useCallback } from 'react';

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: env.OPENAI_APIKEY
});

export default function Prompt() {
  const generateResponse = useCallback(async (input: string) => {
    const completion = await openai.chat.completions.create({
      model: "text-davinci-003",
      messages: [{ role: 'user', content: 'Say this is a test' }],
      max_tokens: 64
    });

    return completion.choices[0].message;
  }, [])

  return (<></>)
}

