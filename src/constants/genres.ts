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

export const TV_GENRES: Genre[] = [
  { label: 'All',         value: 'all'         },
  { label: 'Action',      value: 'Action'       },
  { label: 'Drama',       value: 'Drama'        },
  { label: 'Comedy',      value: 'Comedy'       },
  { label: 'Sci-Fi',      value: 'Sci-Fi'       },
  { label: 'Animation',   value: 'Animation'    },
  { label: 'Crime',       value: 'Crime'        },
  { label: 'Mystery',     value: 'Mystery'      },
  { label: 'Documentary', value: 'Documentary'  },
  { label: 'Family',      value: 'Family'       },
];

export const MOVIE_GENRE_IDS: Record<string, number> = {
  Action:    28,
  Drama:     18,
  Comedy:    35,
  Thriller:  53,
  'Sci-Fi':  878,
  Horror:    27,
  Romance:   10749,
  Animation: 16,
};

export const TV_GENRE_IDS: Record<string, number> = {
  Action:      10759,
  Drama:       18,
  Comedy:      35,
  'Sci-Fi':    10765,
  Animation:   16,
  Crime:       80,
  Mystery:     9648,
  Documentary: 99,
  Family:      10751,
};

export const GENRE_COLORS: Record<string, string> = {
  Action:    'red',
  Drama:     'blue',
  Comedy:    'gold',
  Thriller:  'purple',
  'Sci-Fi':  'cyan',
  Horror:    'volcano',
  Romance:   'pink',
  Animation: 'green',
  Crime:       'volcano',
  Mystery:     'purple',
  Documentary: 'green',
  Family:      'lime',
  'Science Fiction':    'cyan',
  'Sci-Fi & Fantasy':   'cyan',
  'Action & Adventure': 'red',
  'TV Movie':           'geekblue',
  History:              'orange',
  Music:                'purple',
  War:                  'red',
  Western:              'gold',
  Fantasy:              'magenta',
  Adventure:            'blue',
};
