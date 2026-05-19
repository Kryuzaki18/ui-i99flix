import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  sidebarOpen: boolean;
  openSidebar:  () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      sidebarOpen: false,
      openSidebar:   () => set({ sidebarOpen: true  }, false, 'ui/openSidebar'),
      closeSidebar:  () => set({ sidebarOpen: false }, false, 'ui/closeSidebar'),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen }), false, 'ui/toggleSidebar'),
    }),
    { name: 'UIStore' }
  )
);
