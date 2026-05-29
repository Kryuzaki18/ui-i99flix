export interface Movie {
  id: number | string;
  title: string;
  description: string;
  genre: string[];
  rating: number;
  year: number;
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
