import { apiRequest } from './client';
import type { StudioEntry, StudioEntryType } from './types';
import type { PageResponse } from './client';

export async function getEntries(
  type?: StudioEntryType,
  page = 0,
  size = 20
): Promise<PageResponse<StudioEntry>> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (type) params.set('type', type);
  const res = await apiRequest<PageResponse<StudioEntry>>(`/studio/entries?${params}`);
  return res.data;
}

export async function getEntry(id: number): Promise<StudioEntry> {
  const res = await apiRequest<StudioEntry>(`/studio/entries/${id}`);
  return res.data;
}

export async function createEntry(payload: {
  type: StudioEntryType;
  title: string;
  content: string;
}): Promise<StudioEntry> {
  const res = await apiRequest<StudioEntry>('/studio/entries', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function updateEntry(
  id: number,
  payload: { type: StudioEntryType; title: string; content: string }
): Promise<StudioEntry> {
  const res = await apiRequest<StudioEntry>(`/studio/entries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function deleteEntry(id: number): Promise<void> {
  await apiRequest(`/studio/entries/${id}`, { method: 'DELETE' });
}
