export interface ReviewRequest {
  score: number;
  comment?: string;
}

export interface ReviewResponse {
  id: number;
  username: string;
  videogameId: number;
  videogameName: string;
  score: number;
  comment?: string;
  createdAt: string;
}
