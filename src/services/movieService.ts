import type { Movie, Genre } from '../models/movie';

// Placeholder image generator using picsum with consistent seeds
const thumb = (seed: number) => `https://picsum.photos/seed/movie${seed}/400/220`;
const backdrop = (seed: number) => `https://picsum.photos/seed/back${seed}/1280/720`;

export const GENRES: Genre[] = [
  { label: 'All', value: 'all' },
  { label: 'Action', value: 'Action' },
  { label: 'Drama', value: 'Drama' },
  { label: 'Comedy', value: 'Comedy' },
  { label: 'Thriller', value: 'Thriller' },
  { label: 'Sci-Fi', value: 'Sci-Fi' },
  { label: 'Horror', value: 'Horror' },
  { label: 'Romance', value: 'Romance' },
  { label: 'Animation', value: 'Animation' },
];

export const MOVIES: Movie[] = [
  {
    id: 1,
    title: 'Lorem Ipsum: The Beginning',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    genre: ['Action', 'Sci-Fi'],
    rating: 8.4,
    year: 2024,
    duration: '2h 18m',
    thumbnail: thumb(1),
    backdrop: backdrop(1),
    featured: true,
    trending: true,
  },
  {
    id: 2,
    title: 'Dolor Sit Amet',
    description:
      'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    genre: ['Drama', 'Romance'],
    rating: 7.9,
    year: 2024,
    duration: '1h 52m',
    thumbnail: thumb(2),
    backdrop: backdrop(2),
    trending: true,
    newRelease: true,
  },
  {
    id: 3,
    title: 'Consectetur Rising',
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
    genre: ['Thriller', 'Action'],
    rating: 8.1,
    year: 2023,
    duration: '2h 05m',
    thumbnail: thumb(3),
    backdrop: backdrop(3),
    trending: true,
  },
  {
    id: 4,
    title: 'Adipiscing Chronicles',
    description:
      'Sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
    genre: ['Sci-Fi', 'Action'],
    rating: 7.5,
    year: 2023,
    duration: '2h 30m',
    thumbnail: thumb(4),
    backdrop: backdrop(4),
    newRelease: true,
  },
  {
    id: 5,
    title: 'Eiusmod Tempor',
    description:
      'Incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute.',
    genre: ['Comedy', 'Romance'],
    rating: 7.2,
    year: 2024,
    duration: '1h 45m',
    thumbnail: thumb(5),
    backdrop: backdrop(5),
    newRelease: true,
  },
  {
    id: 6,
    title: 'Labore et Dolore',
    description:
      'Magna aliqua ut enim ad minim veniam. Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.',
    genre: ['Horror', 'Thriller'],
    rating: 6.8,
    year: 2023,
    duration: '1h 58m',
    thumbnail: thumb(6),
    backdrop: backdrop(6),
  },
  {
    id: 7,
    title: 'Magna Aliqua',
    description:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip. Ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate.',
    genre: ['Animation', 'Comedy'],
    rating: 8.7,
    year: 2024,
    duration: '1h 35m',
    thumbnail: thumb(7),
    backdrop: backdrop(7),
    featured: true,
  },
  {
    id: 8,
    title: 'Veniam Quis Nostrud',
    description:
      'Exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.',
    genre: ['Drama'],
    rating: 7.6,
    year: 2022,
    duration: '2h 12m',
    thumbnail: thumb(8),
    backdrop: backdrop(8),
  },
  {
    id: 9,
    title: 'Ullamco Laboris',
    description:
      'Nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint.',
    genre: ['Action', 'Thriller'],
    rating: 7.3,
    year: 2023,
    duration: '2h 00m',
    thumbnail: thumb(9),
    backdrop: backdrop(9),
    trending: true,
  },
  {
    id: 10,
    title: 'Aliquip Ex Ea',
    description:
      'Commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
    genre: ['Romance', 'Drama'],
    rating: 6.5,
    year: 2022,
    duration: '1h 48m',
    thumbnail: thumb(10),
    backdrop: backdrop(10),
  },
  {
    id: 11,
    title: 'Commodo Consequat',
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident sunt in culpa.',
    genre: ['Sci-Fi', 'Thriller'],
    rating: 8.0,
    year: 2024,
    duration: '2h 22m',
    thumbnail: thumb(11),
    backdrop: backdrop(11),
    newRelease: true,
  },
  {
    id: 12,
    title: 'Irure Dolor',
    description:
      'In reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.',
    genre: ['Horror'],
    rating: 6.9,
    year: 2023,
    duration: '1h 40m',
    thumbnail: thumb(12),
    backdrop: backdrop(12),
  },
  {
    id: 13,
    title: 'Reprehenderit Voluptate',
    description:
      'Velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    genre: ['Comedy'],
    rating: 7.1,
    year: 2024,
    duration: '1h 30m',
    thumbnail: thumb(13),
    backdrop: backdrop(13),
    trending: true,
  },
  {
    id: 14,
    title: 'Cillum Dolore',
    description:
      'Eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident. Sunt in culpa qui officia deserunt mollit anim id est laborum lorem ipsum dolor sit amet.',
    genre: ['Animation'],
    rating: 8.3,
    year: 2023,
    duration: '1h 55m',
    thumbnail: thumb(14),
    backdrop: backdrop(14),
    featured: true,
  },
  {
    id: 15,
    title: 'Fugiat Nulla Pariatur',
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet consectetur adipiscing.',
    genre: ['Action', 'Drama'],
    rating: 7.8,
    year: 2024,
    duration: '2h 08m',
    thumbnail: thumb(15),
    backdrop: backdrop(15),
    newRelease: true,
    trending: true,
  },
  {
    id: 16,
    title: 'Occaecat Cupidatat',
    description:
      'Non proident sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    genre: ['Sci-Fi'],
    rating: 7.4,
    year: 2022,
    duration: '2h 15m',
    thumbnail: thumb(16),
    backdrop: backdrop(16),
  },
];

export const getFeaturedMovies = (): Movie[] =>
  MOVIES.filter((m) => m.featured);

export const getTrendingMovies = (): Movie[] =>
  MOVIES.filter((m) => m.trending);

export const getNewReleases = (): Movie[] =>
  MOVIES.filter((m) => m.newRelease);

export const getMoviesByGenre = (genre: string): Movie[] =>
  genre === 'all' ? MOVIES : MOVIES.filter((m) => m.genre.includes(genre));

export const getMovieById = (id: number): Movie | undefined =>
  MOVIES.find((m) => m.id === id);

export const searchMovies = (query: string): Movie[] =>
  MOVIES.filter(
    (m) =>
      m.title.toLowerCase().includes(query.toLowerCase()) ||
      m.description.toLowerCase().includes(query.toLowerCase()) ||
      m.genre.some((g) => g.toLowerCase().includes(query.toLowerCase()))
  );
