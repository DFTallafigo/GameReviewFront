export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  reviews: UserReview[];
}

export interface UserReview {
  videogameId: number;
  steamAppId?: number;
  videogameName: string;
  slug: string;
  coverUrl: string;
  score: number;
  comment: string;
  completed: boolean;
  completedAt: string;
  reviewCreatedAt: string;
}
