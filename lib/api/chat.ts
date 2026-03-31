import { apiRequest, getAccessToken, BASE_URL } from './client';
import type { ChatSession, ChatMessage } from './types';
import type { PageResponse } from './client';

export async function getSessions(page = 0, size = 20): Promise<PageResponse<ChatSession>> {
  const res = await apiRequest<PageResponse<ChatSession>>(
    `/chat/sessions?page=${page}&size=${size}`
  );
  return res.data;
}

export async function createSession(title?: string): Promise<ChatSession> {
  const res = await apiRequest<ChatSession>('/chat/sessions', {
    method: 'POST',
    body: JSON.stringify({ title: title ?? 'New Conversation' }),
  });
  return res.data;
}

export async function getSession(id: number): Promise<ChatSession> {
  const res = await apiRequest<ChatSession>(`/chat/sessions/${id}`);
  return res.data;
}

export async function deleteSession(id: number): Promise<void> {
  await apiRequest(`/chat/sessions/${id}`, { method: 'DELETE' });
}

export async function getMessages(sessionId: number): Promise<ChatMessage[]> {
  const res = await apiRequest<ChatMessage[]>(`/chat/sessions/${sessionId}/messages`);
  return res.data;
}

/**
 * Send a message and stream the AI response.
 * The backend returns newline-delimited JSON: {"delta":"...","done":false}
 */
export async function sendMessageStream(
  sessionId: number,
  content: string,
  onDelta: (delta: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const token = getAccessToken();
  const res = await fetch(`${BASE_URL}/chat/sessions/${sessionId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ content }),
    signal,
  });

  if (!res.ok || !res.body) {
    throw new Error(`HTTP ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter(Boolean);

    for (const line of lines) {
      try {
        // SSE format: "data: {...}" — strip the "data: " prefix if present
        const jsonStr = line.startsWith('data:') ? line.slice(5).trim() : line.trim();
        if (!jsonStr) continue;
        const obj = JSON.parse(jsonStr);
        if (obj.done) return;
        if (obj.delta) onDelta(obj.delta);
      } catch {
        // skip non-JSON lines
      }
    }
  }
}
