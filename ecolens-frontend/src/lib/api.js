import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

// Mock API for Eco Report
export const fetchEcoReport = async (input) => {
  return {
    score: 75,
    assessment: 'Moderate',
    remark: 'Non-eco packaging harms the environment.',
    summary: 'A BPA-free plastic bottle.',
    rating: 'Moderate',
    factors: [{ name: 'Plastic', value: '80% recyclable' }],
    tips: [
      'Switch to reusable bottles.',
      'Recycle properly.',
      'Avoid single-use plastics.',
    ],
  };
};