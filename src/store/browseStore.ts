/**
 * Browse store — filter + pagination state for the Browse page.
 *
 * Persisted to sessionStorage (not localStorage) so filters survive in-tab
 * navigation but reset on a new tab / browser close.
 *
 * Security notes:
 * - Only UI preferences are persisted (genre, year, layout, page size).
 * - searchQuery is intentionally NOT persisted — free-text input should not
 *   be stored beyond the session to avoid leaking potentially sensitive
 *   search terms across sessions.
 * - All values are validated by the API layer before use in queries.
 */

import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { DEFAULT_PAGE_SIZE } from '../constants/pagination';

interface BrowseState {
  // Filter state
  selectedGenre: string;
  selectedYear:  string;
  searchQuery:   string;   // NOT persisted (see security note above)

  // Pagination
  page:     number;
  pageSize: number;

  // Layout toggle
  layout: 'grid' | 'list';

  // Actions
  setGenre:      (genre: string)  => void;
  setYear:       (year: string)   => void;
  setSearch:     (query: string)  => void;
  setPage:       (page: number)   => void;
  setPageSize:   (size: number)   => void;
  setLayout:     (layout: 'grid' | 'list') => void;
  resetFilters:  () => void;
}

const INITIAL_STATE = {
  selectedGenre: 'all',
  selectedYear:  'all',
  searchQuery:   '',
  page:          1,
  pageSize:      DEFAULT_PAGE_SIZE,
  layout:        'grid' as const,
};

export const useBrowseStore = create<BrowseState>()(
  devtools(
    persist(
      (set) => ({
        ...INITIAL_STATE,

        setGenre:  (genre)  => set({ selectedGenre: genre, page: 1 }, false, 'browse/setGenre'),
        setYear:   (year)   => set({ selectedYear: year,   page: 1 }, false, 'browse/setYear'),
        setSearch: (query)  => set({ searchQuery: query,   page: 1 }, false, 'browse/setSearch'),
        setPage:   (page)   => set({ page },                          false, 'browse/setPage'),
        setPageSize: (size) => set({ pageSize: size, page: 1 },       false, 'browse/setPageSize'),
        setLayout: (layout) => set({ layout },                        false, 'browse/setLayout'),
        resetFilters: ()    => set(INITIAL_STATE,                     false, 'browse/reset'),
      }),
      {
        name: 'i99flix-browse',
        storage: createJSONStorage(() => sessionStorage),
        // Only persist UI preferences — exclude searchQuery for privacy
        partialize: (state) => ({
          selectedGenre: state.selectedGenre,
          selectedYear:  state.selectedYear,
          pageSize:      state.pageSize,
          layout:        state.layout,
        }),
      }
    ),
    { name: 'BrowseStore' }
  )
);
