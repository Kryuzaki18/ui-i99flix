export interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string[];
  rating: number;
  year: number;
  duration: string;
  thumbnail: string;
  backdrop: string;
  featured?: boolean;
  trending?: boolean;
  newRelease?: boolean;
}

export interface Genre {
  label: string;
  value: string;
}
