import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

interface UIState {
  sidebarOpen: boolean;
  homeLayout:  'grid' | 'list';

  openSidebar:    () => void;
  closeSidebar:   () => void;
  toggleSidebar:  () => void;
  setHomeLayout:  (layout: 'grid' | 'list') => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: false,
        homeLayout:  'grid',

        openSidebar:   () => set({ sidebarOpen: true  }, false, 'ui/openSidebar'),
        closeSidebar:  () => set({ sidebarOpen: false }, false, 'ui/closeSidebar'),
        toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen }), false, 'ui/toggleSidebar'),
        setHomeLayout: (layout) => set({ homeLayout: layout }, false, 'ui/setHomeLayout'),
      }),
      {
        name:    'i99flix-ui',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ homeLayout: state.homeLayout }),
      }
    ),
    { name: 'UIStore' }
  )
);
