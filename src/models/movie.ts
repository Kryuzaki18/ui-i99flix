export interface Movie {
  /** Numeric id for static/TMDB movies; MongoDB ObjectId string for API movies */
  id:          number | string;
  title:       string;
  description: string;
  genre:       string[];
  rating:      number;
  year:        number;
  duration:    string;
  thumbnail:   string;
  backdrop:    string;
  featured?:   boolean;
  trending?:   boolean;
  newRelease?:  boolean;
}

export interface Genre {
  label: string;
  value: string;
}