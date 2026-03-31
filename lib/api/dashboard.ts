import { apiRequest } from './client';
import type { DashboardData } from './types';

export async function getDashboard(): Promise<DashboardData> {
  const res = await apiRequest<DashboardData>('/dashboard');
  return res.data;
}
