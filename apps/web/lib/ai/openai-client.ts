type GenerateOpenAiTextOptions = {
  systemPrompt: string;
  userPrompt: string;
};

type OpenAiChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
};

export function getOpenAiModelName() {
  return process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini';
}

export function hasOpenAiApiKey() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export async function generateOpenAiText({ systemPrompt, userPrompt }: GenerateOpenAiTextOptions) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: getOpenAiModelName(),
      temperature: 0.2,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    })
  });

  const data = (await response.json().catch(() => ({}))) as OpenAiChatCompletionResponse;

  if (!response.ok) {
    const message = data.error?.message || `OpenAI request failed with status ${response.status}.`;
    throw new Error(message);
  }

  const text = data.choices?.[0]?.message?.content?.trim();

  if (!text) {
    throw new Error('OpenAI returned an empty response.');
  }

  return text;
}
