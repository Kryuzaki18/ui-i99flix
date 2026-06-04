export interface Movie {
  id: number | string;
  title: string;
  description: string;
  genre: string[];
  rating: number;
  year: number;
  releaseDate?: string;
  duration: string;
  thumbnail: string;
  backdrop: string;
  mediaType?: "movie" | "tv";
  featured?: boolean;
  trending?: boolean;
  newRelease?: boolean;
}

export interface Genre {
  label: string;
  value: string;
}

export interface ResolvedGenre {
  key:   string;
  label: string;
  color: string;
}
