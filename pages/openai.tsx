import { useCallback } from "react";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_APIKEY,
});

export default function Prompt() {
  const generateResponse = useCallback(async (input: string) => {
    const completion = await openai.chat.completions.create({
      model: "text-davinci-003",
      messages: [
        {
          role: "user",
          content:
            input +
            "Generate a response in JSON format. There should  be 3 fields, studentIncome, househouldIncome, expectedHouseholdContribution.",
        },
      ],
      max_tokens: 64,
      temperature: 0.2,
    });

    const messageString = completion.choices[0].message;
    try {
      const messageJSON = JSON.parse(messageString.toString());
      return messageJSON;
    } catch (error) {
      console.error("The message is not in valid JSON format:", error);
      return null;
    }
  }, []);

  return <></>;
}
