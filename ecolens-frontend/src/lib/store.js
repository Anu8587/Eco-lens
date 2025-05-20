import { create } from 'zustand';

export const useEcoStore = create((set) => ({
  inputType: 'url',
  setInputType: (type) => set({ inputType: type }),
  reportData: null,
  setReportData: (data) => set({ reportData: data }),
  isReportVisible: false,
  setReportVisible: (visible) => set({ isReportVisible: visible }),
}));