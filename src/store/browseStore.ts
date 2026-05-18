/**
 * Browse store — filter + pagination state for the Browse page.
 *
 * Persisted to sessionStorage so filters survive in-tab navigation
 * but reset on a new tab / browser close.
 *
 * Security notes:
 * - Only UI preferences are persisted (genre, year, layout, page size, mediaType).
 * - searchQuery is intentionally NOT persisted.
 */

import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { DEFAULT_PAGE_SIZE } from '../constants/pagination';

export type MediaType = 'movie' | 'tv';

interface BrowseState {
  // Media type tab
  mediaType:     MediaType;

  // Filter state
  selectedGenre: string;
  selectedYear:  string;
  searchQuery:   string; // NOT persisted

  // Pagination
  page:     number;
  pageSize: number;

  // Layout toggle
  layout: 'grid' | 'list';

  // Actions
  setMediaType:  (type: MediaType) => void;
  setGenre:      (genre: string)   => void;
  setYear:       (year: string)    => void;
  setSearch:     (query: string)   => void;
  setPage:       (page: number)    => void;
  setPageSize:   (size: number)    => void;
  setLayout:     (layout: 'grid' | 'list') => void;
  resetFilters:  () => void;
}

const INITIAL_STATE = {
  mediaType:     'movie' as MediaType,
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

        setMediaType: (type)  => set({ mediaType: type, selectedGenre: 'all', selectedYear: 'all', searchQuery: '', page: 1 }, false, 'browse/setMediaType'),
        setGenre:     (genre) => set({ selectedGenre: genre, page: 1 }, false, 'browse/setGenre'),
        setYear:      (year)  => set({ selectedYear: year,   page: 1 }, false, 'browse/setYear'),
        setSearch:    (query) => set({ searchQuery: query,   page: 1 }, false, 'browse/setSearch'),
        setPage:      (page)  => set({ page },                          false, 'browse/setPage'),
        setPageSize:  (size)  => set({ pageSize: size, page: 1 },       false, 'browse/setPageSize'),
        setLayout:    (layout)=> set({ layout },                        false, 'browse/setLayout'),
        resetFilters: ()      => set(INITIAL_STATE,                     false, 'browse/reset'),
      }),
      {
        name: 'i99flix-browse',
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          mediaType:     state.mediaType,
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
