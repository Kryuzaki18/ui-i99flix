import type { Genre } from '../models/movie';

export const GENRES: Genre[] = [
  { label: 'All',       value: 'all'       },
  { label: 'Action',    value: 'Action'    },
  { label: 'Drama',     value: 'Drama'     },
  { label: 'Comedy',    value: 'Comedy'    },
  { label: 'Thriller',  value: 'Thriller'  },
  { label: 'Sci-Fi',    value: 'Sci-Fi'    },
  { label: 'Horror',    value: 'Horror'    },
  { label: 'Romance',   value: 'Romance'   },
  { label: 'Animation', value: 'Animation' },
];

/**
 * Maps genre names → Ant Design tag colors.
 * Covers both app-specific names (Sci-Fi) and full TMDB names (Science Fiction)
 * so tags render correctly regardless of the data source.
 */
export const GENRE_COLORS: Record<string, string> = {
  // App genre names
  Action:    'red',
  Drama:     'blue',
  Comedy:    'gold',
  Thriller:  'purple',
  'Sci-Fi':  'cyan',
  Horror:    'volcano',
  Romance:   'pink',
  Animation: 'green',

  // TMDB full genre names
  'Science Fiction': 'cyan',
  'TV Movie':        'geekblue',
  Documentary:       'green',
  History:           'orange',
  Music:             'purple',
  Mystery:           'volcano',
  War:               'red',
  Western:           'gold',
  Family:            'lime',
  Fantasy:           'magenta',
  Adventure:         'blue',
  Crime:             'volcano',
};
