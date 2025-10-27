
import api from './api';


export type StyleType = 'friendly' | 'professional' | 'humorous';

export interface Post {
  index: number;
  img: string;
  content: string;
  hashtags: string;
  callToAction: string;
}

export interface Story {
  index: number;
  description: string;
}

export interface Highlight {
  title: string;
  stories: Story[];
}

export interface Profile {
  bio: string;
  username: string;
  name: string;
  followers: number;
  following: number;
  postsCount: number;
}

export interface GenerateRequest {
  prompt: string;
  style: StyleType;
}

export interface GenerateResponse {
  profile: Profile;
  highlights: Highlight[];
  posts: Post[];
}

export interface SaveHistoryRequest {
  prompt: string;
  style: StyleType;
  profile: Profile;
  highlights: Highlight[];
  posts: Post[];
}


export const generate = async (data: GenerateRequest): Promise<GenerateResponse> => {
  const res = await api.post<GenerateResponse>('/ai/generate', data);
  return res.data;
};

export const saveHistory = async (data: SaveHistoryRequest): Promise<any> => {
  const res = await api.post('/ai/save', data);
  return res.data;
};

export async function getHistory() {
  const response = await api.get('/ai/history');
  return response.data;
}

export async function getHistoryItem(id: string) {
  const response = await api.get(`/ai/history/${id}`);
  return response.data;
}
