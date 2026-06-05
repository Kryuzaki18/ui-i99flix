import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWatchHistory, recordWatch } from '../../services/watchService';
import type { RecordWatchPayload } from '../../services/watchService';
import { watchKeys } from '../queryKeys';
import { useAuthStore } from '../../store/authStore';

export function useWatchHistoryQuery() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey:  watchKeys.history(),
    queryFn:   () => getWatchHistory(),
    enabled:   !!isAuthenticated,
    staleTime: 2 * 60 * 1000,
    select:    (data) => data.history,
  });
}

export function useRecordWatchMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RecordWatchPayload) => recordWatch(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: watchKeys.history() });
    },
  });
}
