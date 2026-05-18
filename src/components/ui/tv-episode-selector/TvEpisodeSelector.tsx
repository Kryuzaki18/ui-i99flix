import { Select, Button, Flex } from 'antd';

const MAX_SEASONS           = 20;
const MAX_EPISODES_PER_SEASON = 30;

interface TvEpisodeSelectorProps {
  season:          number;
  episode:         number;
  onSeasonChange:  (s: number) => void;
  onEpisodeChange: (e: number) => void;
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
    <Flex gap={12} style={{ width: '100%', padding: "1rem 0" }}>
      <Select
        value={season}
        onChange={(v) => { onSeasonChange(v); onEpisodeChange(1); }}
        options={seasonOptions}
        size="small"
        style={{ minWidth: 120, height: "27px" }}
        popupMatchSelectWidth={false}
      />

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
                height: "27px",
              }}
              aria-label={`Episode ${ep}`}
              aria-pressed={isActive}
            >
              E{ep}
            </Button>
          );
        })}
      </Flex>
    </Flex>
  );
}
