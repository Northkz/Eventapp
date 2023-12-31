import { create } from "zustand";

const useAuthStore = create((set) => ({
  email: null,
  token: null,

  login: (email, token) => {
    localStorage.setItem("email", email);
    localStorage.setItem("token", token);
    set({ email, token });
  },

  logout: () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    set({ email: null, token: null });
  },

  initializeAuth: () => {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    if (email && token) {
      set({ email, token });
    }
  },
}));

export default useAuthStore;
