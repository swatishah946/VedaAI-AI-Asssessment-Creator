import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  name: string;
  school: string;
  avatarUrl: string;
  updateProfile: (data: Partial<UserState>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: 'John Doe',
      school: 'Delhi Public School, Bokaro',
      avatarUrl: '', // empty means it will show a default initials avatar or icon
      updateProfile: (data) => set((state) => ({ ...state, ...data })),
    }),
    {
      name: 'veda-user-storage', // key in localStorage
    }
  )
);
