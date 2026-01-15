import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export type TimeEntry = {
  id: number;
  date: string;
  project: string;
  hours: number;
  description: string;
};

const API_URL = 'http://localhost:4000/time-entries';

export const useTimeEntries = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['time-entries'],
    queryFn: async () => {
      const { data } = await axios.get<TimeEntry[]>(API_URL);
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: (newEntry: any) => axios.post(API_URL, newEntry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] });
    },
  });

  return { 

    entries: Array.isArray(query.data) ? query.data : [], 
    isLoading: query.isLoading,
    addEntry: mutation 
  };
};