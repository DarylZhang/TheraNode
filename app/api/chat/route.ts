import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        console.log('[/api/chat] Received messages:', JSON.stringify(messages));

        const result = await streamText({
            model: google('gemini-3.1-flash-lite-preview'),
            messages,
            system: "你是一个专业的心理咨询助手 AI Copilot。你的任务是帮助用户进行情绪处理、正念引导和艺术治疗建议。语气要温和、专业、富有同理心。请使用中文与其交流。",
        });

        console.log('[/api/chat] Stream created, returning response...');
        return result.toTextStreamResponse();
    } catch (error) {
        console.error('[/api/chat] Error:', error);
        return new Response(JSON.stringify({ error: String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
