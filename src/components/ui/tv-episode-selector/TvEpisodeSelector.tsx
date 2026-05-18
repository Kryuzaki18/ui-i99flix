/**
 * TvEpisodeSelector
 *
 * Season dropdown + episode button grid for TV series playback.
 * Generates up to MAX_SEASONS seasons and MAX_EPISODES_PER_SEASON episode
 * buttons. The user picks a season from the Select, then clicks an episode.
 *
 * Used by both VideoPlayer (modal) and Player (full-page).
 */

import { Select, Button, Flex, Typography } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';

const { Text } = Typography;

const MAX_SEASONS           = 20;
const MAX_EPISODES_PER_SEASON = 30;

interface TvEpisodeSelectorProps {
  season:          number;
  episode:         number;
  onSeasonChange:  (s: number) => void;
  onEpisodeChange: (e: number) => void;
  /** Optional: constrain to known season/episode counts */
  totalSeasons?:   number;
  totalEpisodes?:  number;
}

export default function TvEpisodeSelector({
  season,
  episode,
  onSeasonChange,
  onEpisodeChange,
  totalSeasons  = MAX_SEASONS,
  totalEpisodes = MAX_EPISODES_PER_SEASON,
}: TvEpisodeSelectorProps) {
  const seasonOptions = Array.from({ length: totalSeasons }, (_, i) => ({
    label: `Season ${i + 1}`,
    value: i + 1,
  }));

  const episodeCount = Math.min(totalEpisodes, MAX_EPISODES_PER_SEASON);

  return (
    <Flex vertical gap={12} style={{ width: '100%' }}>
      {/* Season selector */}
      <Flex align="center" gap={10} wrap>
        <UnorderedListOutlined style={{ color: '#e50914', fontSize: 16, flexShrink: 0 }} />
        <Text strong style={{ flexShrink: 0 }}>Season</Text>
        <Select
          value={season}
          onChange={(v) => { onSeasonChange(v); onEpisodeChange(1); }}
          options={seasonOptions}
          size="small"
          style={{ minWidth: 120 }}
          popupMatchSelectWidth={false}
        />
      </Flex>

      {/* Episode buttons */}
      <Flex wrap gap={6}>
        {Array.from({ length: episodeCount }, (_, i) => {
          const ep = i + 1;
          const isActive = ep === episode;
          return (
            <Button
              key={ep}
              size="small"
              type={isActive ? 'primary' : 'default'}
              onClick={() => onEpisodeChange(ep)}
              style={{
                minWidth: 40,
                fontWeight: isActive ? 700 : 400,
              }}
              aria-label={`Episode ${ep}`}
              aria-pressed={isActive}
            >
              {ep}
            </Button>
          );
        })}
      </Flex>
    </Flex>
  );
}
