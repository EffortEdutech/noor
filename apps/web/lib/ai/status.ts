import { getOpenAiModelName, hasOpenAiApiKey } from './openai-client';

export type AiAssistantStatus = {
  provider: 'OpenAI';
  configured: boolean;
  model: string;
  keyStorage: 'server-environment';
  safetyMode: 'locked';
};

export function getAiAssistantStatus(): AiAssistantStatus {
  return {
    provider: 'OpenAI',
    configured: hasOpenAiApiKey(),
    model: getOpenAiModelName(),
    keyStorage: 'server-environment',
    safetyMode: 'locked'
  };
}
