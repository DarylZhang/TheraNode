import { apiRequest } from './client';
import type { CommunityPost, PostTag, PostComment } from './types';
import type { PageResponse } from './client';

export async function getPosts(params?: {
  tag?: PostTag;
  sort?: 'latest' | 'popular';
  page?: number;
  size?: number;
}): Promise<PageResponse<CommunityPost>> {
  const query = new URLSearchParams({
    page: String(params?.page ?? 0),
    size: String(params?.size ?? 20),
    sort: params?.sort ?? 'latest',
  });
  if (params?.tag) query.set('tag', params.tag);
  const res = await apiRequest<PageResponse<CommunityPost>>(`/community/posts?${query}`);
  return res.data;
}

export async function createPost(payload: {
  tag: PostTag;
  title: string;
  content: string;
}): Promise<CommunityPost> {
  const res = await apiRequest<CommunityPost>('/community/posts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function likePost(id: number): Promise<void> {
  await apiRequest(`/community/posts/${id}/like`, { method: 'POST' });
}

export async function unlikePost(id: number): Promise<void> {
  await apiRequest(`/community/posts/${id}/like`, { method: 'DELETE' });
}

export async function bookmarkPost(id: number): Promise<void> {
  await apiRequest(`/community/posts/${id}/bookmark`, { method: 'POST' });
}

export async function unbookmarkPost(id: number): Promise<void> {
  await apiRequest(`/community/posts/${id}/bookmark`, { method: 'DELETE' });
}

export async function getComments(
  postId: number,
  page = 0,
  size = 20
): Promise<PageResponse<PostComment>> {
  const res = await apiRequest<PageResponse<PostComment>>(
    `/community/posts/${postId}/comments?page=${page}&size=${size}`
  );
  return res.data;
}

export async function createComment(postId: number, content: string): Promise<PostComment> {
  const res = await apiRequest<PostComment>(`/community/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
  return res.data;
}
