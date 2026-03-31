export interface User {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
  provider: 'LOCAL' | 'GOOGLE';
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface ChatSession {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: number;
  role: 'USER' | 'ASSISTANT';
  content: string;
  createdAt: string;
}

export type StudioEntryType = 'DIARY' | 'POEM';

export interface StudioEntry {
  id: number;
  type: StudioEntryType;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type PostTag = 'REFLECTION' | 'POEM' | 'GRATITUDE' | 'MILESTONE' | 'QUESTION';

export interface CommunityPost {
  id: number;
  userId: number;
  authorName: string;
  authorAvatar: string | null;
  tag: PostTag;
  title: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  likedByMe: boolean;
  bookmarkedByMe: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostComment {
  id: number;
  userId: number;
  authorName: string;
  authorAvatar: string | null;
  content: string;
  createdAt: string;
}

export type EmotionType = 'HAPPY' | 'CALM' | 'SAD' | 'ANXIOUS' | 'ANGRY' | 'NEUTRAL';

export interface EmotionRecord {
  id: number;
  score: number;
  emotionType: EmotionType;
  note: string | null;
  recordedAt: string;
  createdAt: string;
}

export interface DashboardData {
  emotionScore: number;
  emotionTrend: Array<{ date: string; score: number }>;
  recentWorks: Array<{ id: number; type: StudioEntryType; title: string; updatedAt: string }>;
  communityActivity: { postsCount: number; likesReceived: number };
  membershipStatus: 'FREE' | 'ACTIVE';
}

export interface Whiteboard {
  id: number;
  name: string;
  content: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MembershipPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  period: 'MONTHLY' | 'YEARLY';
  features: string;
  isActive: boolean;
}
