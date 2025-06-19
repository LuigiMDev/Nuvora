import type { User } from "@/types/user";
import { create } from "zustand";

type UserState = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const useUser = create<UserState>((set) => ({
  user: null,
  setUser: (user: User | null) => set({ user }),
}));
