import { Fragment } from 'react';
import { Select, Button, Flex, Tooltip } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import ScrollableRow from '../scrollable-row/ScrollableRow';

const MAX_EPISODES_PER_SEASON = 30;

interface TvSeasonInfo {
  season_number: number;
  episode_count: number;
  name: string;
}

interface TvEpisodeSelectorProps {
  season: number;
  episode: number;
  onSeasonChange: (s: number) => void;
  onEpisodeChange: (e: number) => void;
  seasons?: TvSeasonInfo[];
  totalEpisodes?: number;
  watchedEpisodes?: Set<string>;
}

export default function TvEpisodeSelector({
  season,
  episode,
  onSeasonChange,
  onEpisodeChange,
  seasons,
  totalEpisodes = MAX_EPISODES_PER_SEASON,
  watchedEpisodes,
}: TvEpisodeSelectorProps) {
  const episodeCount = Math.min(totalEpisodes, MAX_EPISODES_PER_SEASON);

  const seasonOptions = (seasons ?? []).map((s) => {
    const watchedCount = watchedEpisodes
      ? [...watchedEpisodes].filter((k) => k.startsWith(`${s.season_number}-`)).length
      : 0;
    return {
      label: watchedCount > 0 ? `${s.name}  ·  ${watchedCount} watched` : s.name,
      value: s.season_number,
    };
  });

  return (
    <div style={{ width: '100%'}}>
      <Select
        value={season}
        onChange={(v) => { onSeasonChange(v); onEpisodeChange(1); }}
        options={seasonOptions}
        size="small"
        style={{ minWidth: 110, maxWidth: 180 }}
        popupMatchSelectWidth={false}
      />

      <ScrollableRow>
        <Flex gap={6} style={{ flexWrap: 'nowrap', width: 'max-content', padding: '0.5rem 0' }}>
          {Array.from({ length: episodeCount }, (_, i) => {
            const ep             = i + 1;
            const isActive       = ep === episode;
            const isWatched      = watchedEpisodes?.has(`${season}-${ep}`) ?? false;
            const showWatchedStyle = isWatched && !isActive;

            const item = (
              <Flex vertical align="center" gap={4} style={{ flexShrink: 0 }}>
                <Button
                  size="small"
                  type={isActive ? 'primary' : 'default'}
                  onClick={() => onEpisodeChange(ep)}
                  icon={showWatchedStyle
                    ? <CheckCircleFilled style={{ fontSize: 10, color: '#52c41a' }} />
                    : undefined
                  }
                  style={{
                    minWidth: 36,
                    fontWeight: isActive ? 700 : 400,
                    flexShrink: 0,
                    ...(showWatchedStyle && { borderColor: '#52c41a', color: '#52c41a' }),
                  }}
                  aria-label={`Episode ${ep}${isWatched ? ' (watched)' : ''}`}
                  aria-pressed={isActive}
                >
                  E{ep}
                </Button>

                <div
                  style={{
                    width:        isActive ? 24 : 20,
                    height:       3,
                    borderRadius: 2,
                    background:   isWatched ? '#52c41a' : isActive ? '#1677ff' : 'rgba(128,128,128,0.18)',
                    transition:   'all 0.2s ease',
                  }}
                />
              </Flex>
            );

            return showWatchedStyle ? (
              <Tooltip key={ep} title="Watched" placement="top">{item}</Tooltip>
            ) : (
              <Fragment key={ep}>{item}</Fragment>
            );
          })}
        </Flex>
      </ScrollableRow>
    </div>
  );
}
