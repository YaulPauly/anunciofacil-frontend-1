import {create} from "zustand"

type UIState = {
  darkMode: boolean;
  toggleDark: () => void;
  setDark: (v: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  darkMode: false,
  toggleDark: () => set((s) => ({ darkMode: !s.darkMode })),
  setDark: (v) => set({ darkMode: v }),
}));
