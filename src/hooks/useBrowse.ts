import { useState, useMemo } from 'react';
import { getMoviesByGenre, searchMovies } from '../core/services/movieService';
import type { Movie } from '../models/movie';

export const useBrowse = () => {
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const movies = useMemo<Movie[]>(() => {
    const byGenre = getMoviesByGenre(selectedGenre);
    if (!searchQuery.trim()) return byGenre;
    return searchMovies(searchQuery).filter(
      (m) => selectedGenre === 'all' || m.genre.includes(selectedGenre)
    );
  }, [selectedGenre, searchQuery]);

  return { movies, selectedGenre, setSelectedGenre, searchQuery, setSearchQuery };
};
