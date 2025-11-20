export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string; // Acts as password
  role: UserRole;
}

export interface DesignResource {
  id: string;
  title: string;
  description: string;
  thumbnailData: string; // Base64 image data
  psdFileName: string;
  uploadDate: string;
  authorId: string;
  tags: string[];
  downloads: number;
  isPremium: boolean;
}

export enum PageView {
  HOME = 'HOME',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  RESOURCE_DETAIL = 'RESOURCE_DETAIL',
}

// Gemini API Types
export interface AiAnalysisResult {
  title: string;
  description: string;
  tags: string[];
}
