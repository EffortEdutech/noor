import { NextResponse } from 'next/server';
import { buildIslamicAiSystemPrompt, buildIslamicAiUserPrompt, buildNotConfiguredResponse } from '../../../../lib/ai/prompts';
import { generateOpenAiText } from '../../../../lib/ai/openai-client';
import { getAiAssistantStatus } from '../../../../lib/ai/status';
import {
  isAiActionMode,
  isAiWritingStyle,
  type AiReflectionRequest,
  type AiSourceContext
} from '../../../../lib/ai/types';

export const dynamic = 'force-dynamic';

function normalizeOutputLanguage(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : 'English';
}

function isValidContext(value: unknown): value is AiSourceContext {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<AiSourceContext>;

  return (
    (candidate.surface === 'quran' || candidate.surface === 'tafseer') &&
    typeof candidate.reference === 'string' &&
    typeof candidate.surah === 'number' &&
    typeof candidate.fromAyah === 'number' &&
    typeof candidate.toAyah === 'number' &&
    typeof candidate.arabic === 'string'
  );
}

function getSourcesUsed(context: AiSourceContext) {
  const sources = [`Quran ${context.reference}`];

  if (context.tafseer?.sourceLabel) {
    sources.push(context.tafseer.reference
      ? `${context.tafseer.sourceLabel} (${context.tafseer.reference})`
      : context.tafseer.sourceLabel);
  }

  for (const ayah of context.relatedAyat ?? []) {
    sources.push(`Related ayah: ${ayah.reference}`);
  }

  for (const hadith of context.relatedHadith ?? []) {
    sources.push(`Related hadith: ${hadith.collection ? `${hadith.collection} ` : ''}${hadith.reference}`);
  }

  return Array.from(new Set(sources));
}

export async function GET() {
  return NextResponse.json(getAiAssistantStatus());
}

export async function POST(request: Request) {
  let payload: Partial<AiReflectionRequest>;

  try {
    payload = (await request.json()) as Partial<AiReflectionRequest>;
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON request body.' },
      { status: 400 }
    );
  }

  if (!isAiActionMode(payload.mode)) {
    return NextResponse.json(
      { ok: false, error: 'Invalid AI action mode.' },
      { status: 400 }
    );
  }

  if (!isValidContext(payload.context)) {
    return NextResponse.json(
      { ok: false, error: 'Invalid or missing source context.' },
      { status: 400 }
    );
  }

  const status = getAiAssistantStatus();
  const outputLanguage = normalizeOutputLanguage(payload.outputLanguage);
  const writingStyle = isAiWritingStyle(payload.writingStyle) ? payload.writingStyle : 'clear-modern';
  const sourcesUsed = getSourcesUsed(payload.context);

  if (!status.configured) {
    return NextResponse.json({
      ok: true,
      configured: false,
      mode: payload.mode,
      outputLanguage,
      writingStyle,
      text: buildNotConfiguredResponse(payload.mode, outputLanguage, writingStyle, payload.context),
      sourcesUsed,
      warning: 'OPENAI_API_KEY is not configured on the server.'
    });
  }

  try {
    const text = await generateOpenAiText({
      systemPrompt: buildIslamicAiSystemPrompt(),
      userPrompt: buildIslamicAiUserPrompt(payload.mode, outputLanguage, writingStyle, payload.context)
    });

    return NextResponse.json({
      ok: true,
      configured: true,
      mode: payload.mode,
      outputLanguage,
      writingStyle,
      text,
      sourcesUsed
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'AI generation failed.';

    return NextResponse.json(
      {
        ok: false,
        configured: true,
        mode: payload.mode,
        outputLanguage,
        writingStyle,
        text: '',
        sourcesUsed,
        warning: message
      },
      { status: 502 }
    );
  }
}
