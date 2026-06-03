import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { DEFAULT_PAGE_SIZE } from '../constants/pagination';

export type MediaType = 'movie' | 'tv';

export interface MediaFilters {
  type: MediaType;
  selectedGenre: string;
  selectedYear: string;
  searchQuery: string;
  page: number;
  pageSize: number;
  layout: 'grid' | 'list';
}

interface BrowseState {
  mediaType: MediaType;
  filters: MediaFilters[];

  setMediaType: (type: MediaType) => void;
  setGenre: (genre: string) => void;
  setYear: (year: string) => void;
  setSearch: (query: string) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setLayout: (layout: 'grid' | 'list') => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS = (type: MediaType): MediaFilters => ({
  type,
  selectedGenre: 'all',
  selectedYear: 'all',
  searchQuery: '',
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  layout: 'grid',
});

const INITIAL_FILTERS: MediaFilters[] = [
  DEFAULT_FILTERS('movie'),
  DEFAULT_FILTERS('tv'),
];

const INITIAL_STATE = {
  mediaType: 'movie' as MediaType,
  filters: INITIAL_FILTERS,
};

const updateActive = (filters: MediaFilters[], mediaType: MediaType, patch: Partial<MediaFilters>): MediaFilters[] =>
  filters.map((f) => (f.type === mediaType ? { ...f, ...patch } : f));

export const selectActiveFilters = (state: BrowseState): MediaFilters =>
  state.filters.find((f) => f.type === state.mediaType) ?? DEFAULT_FILTERS(state.mediaType);

export const useBrowseStore = create<BrowseState>()(
  devtools(
    persist(
      (set) => ({
        ...INITIAL_STATE,

        setMediaType: (type) => set({ mediaType: type }, false, 'browse/setMediaType'),
        setGenre: (genre) => set(
          (s) => ({ filters: updateActive(s.filters, s.mediaType, { selectedGenre: genre, page: 1 }) }),
          false, 'browse/setGenre'
        ),
        setYear: (year) => set(
          (s) => ({ filters: updateActive(s.filters, s.mediaType, { selectedYear: year, page: 1 }) }),
          false, 'browse/setYear'
        ),
        setSearch: (query) => set(
          (s) => ({ filters: updateActive(s.filters, s.mediaType, { searchQuery: query, page: 1 }) }),
          false, 'browse/setSearch'
        ),
        setPage: (page) => set(
          (s) => ({ filters: updateActive(s.filters, s.mediaType, { page: Math.max(1, Math.min(page, 500)) }) }),
          false, 'browse/setPage'
        ),
        setPageSize: (size) => set(
          (s) => ({ filters: updateActive(s.filters, s.mediaType, { pageSize: size, page: 1 }) }),
          false, 'browse/setPageSize'
        ),
        setLayout: (layout) => set(
          (s) => ({ filters: updateActive(s.filters, s.mediaType, { layout }) }),
          false, 'browse/setLayout'
        ),
        resetFilters: () => set(INITIAL_STATE, false, 'browse/reset'),
      }),
      {
        name: 'i99flix-browse',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          mediaType: state.mediaType,
          filters: state.filters,
        }),
      }
    ),
    { name: 'BrowseStore' }
  )
);
