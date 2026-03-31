import { apiRequest } from './client';
import type { Whiteboard } from './types';
import type { PageResponse } from './client';

export async function getWhiteboards(page = 0, size = 20): Promise<PageResponse<Whiteboard>> {
  const res = await apiRequest<PageResponse<Whiteboard>>(
    `/whiteboards?page=${page}&size=${size}`
  );
  return res.data;
}

export async function createWhiteboard(name: string): Promise<Whiteboard> {
  const res = await apiRequest<Whiteboard>('/whiteboards', {
    method: 'POST',
    body: JSON.stringify({ name, content: null }),
  });
  return res.data;
}

export async function getWhiteboard(id: number): Promise<Whiteboard> {
  const res = await apiRequest<Whiteboard>(`/whiteboards/${id}`);
  return res.data;
}

export async function saveWhiteboard(
  id: number,
  content: string,
  name?: string
): Promise<Whiteboard> {
  const res = await apiRequest<Whiteboard>(`/whiteboards/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ content, ...(name ? { name } : {}) }),
  });
  return res.data;
}

export async function deleteWhiteboard(id: number): Promise<void> {
  await apiRequest(`/whiteboards/${id}`, { method: 'DELETE' });
}
