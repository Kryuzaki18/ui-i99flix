/**
 * React Query hook for the Browse page filtered movie list.
 * Reads filter state directly from the Zustand browse store so the query
 * automatically re-runs whenever a filter changes.
 *
 * Search is debounced by 300 ms so we don't fire a new query on every keystroke.
 */

import { useQuery } from '@tanstack/react-query';
import { movieKeys } from './queryKeys';
import { fetchMovies } from './movieApi';
import { useBrowseStore } from '../store/browseStore';
import { useDebounce } from '../hooks/useDebounce';

export function useBrowseQuery() {
  const { selectedGenre, selectedYear, searchQuery } = useBrowseStore();

  // Debounce the free-text search — genre/year changes apply immediately
  const debouncedSearch = useDebounce(searchQuery, 300);

  return useQuery({
    queryKey: movieKeys.list({ genre: selectedGenre, year: selectedYear, search: debouncedSearch }),
    queryFn:  () => fetchMovies({ genre: selectedGenre, year: selectedYear, search: debouncedSearch }),
    staleTime: Infinity,
    // Keep previous data visible while new filter results load
    placeholderData: (prev) => prev,
  });
}
