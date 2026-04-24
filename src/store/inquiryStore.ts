import { create } from 'zustand';
import type { Inquiry } from '../types';
import { MOCK_INQUIRIES } from '../data/mockData';

interface InquiryState {
  inquiries: Inquiry[];
  addInquiry: (inquiry: Inquiry) => void;
  updateStatus: (id: string, status: Inquiry['status']) => void;
}

export const useInquiryStore = create<InquiryState>((set) => ({
  inquiries: [...MOCK_INQUIRIES],
  addInquiry: (inquiry) => set(state => ({ inquiries: [...state.inquiries, inquiry] })),
  updateStatus: (id, status) => set(state => ({
    inquiries: state.inquiries.map(i => i.id === id ? { ...i, status } : i),
  })),
}));
