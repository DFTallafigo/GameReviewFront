export interface VideogameRequest {
  name: string;
  synopsis?: string;
  releaseDate?: string;
  coverUrl?: string;
  genres?: string[];
  platforms?: string[];
  developers?: string[];
  publishers?: string[];
  website?: string;
}

export interface VideogameResponse {
  id: number;
  steamAppId?: number;
  name: string;
  slug: string;
  synopsis?: string;
  releaseDate?: string;
  coverUrl?: string;
  backgroundUrl?: string;
  metacritic?: number;
  esrbRating?: string;
  playtime?: number;
  website?: string;
  genres: string[];
  platforms: string[];
  developers: string[];
  publishers: string[];
  averageRating?: number;
  totalReviews?: number;
}
