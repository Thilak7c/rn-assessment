import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface UseUsersState {
  users: User[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

export function useUsers() {
  const [state, setState] = useState<UseUsersState>({
    users: [],
    isLoading: true,
    isRefreshing: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
  });

  const fetchUsers = useCallback(async (page = 1, isRefresh = false) => {
    setState((prev) => ({
      ...prev,
      isLoading: !isRefresh,
      isRefreshing: isRefresh,
      error: null,
    }));

    try {
      const res = await api.getUsers(page);
      setState((prev) => ({
        ...prev,
        users: page === 1 ? res.data : [...prev.users, ...res.data],
        totalPages: res.total_pages ?? 1,
        currentPage: page,
        isLoading: false,
        isRefreshing: false,
      }));
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isRefreshing: false,
        error: err.message || 'Failed to fetch users.',
      }));
    }
  }, []);

  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  const refresh = () => fetchUsers(1, true);

  const loadNextPage = () => {
    if (state.currentPage < state.totalPages) {
      fetchUsers(state.currentPage + 1);
    }
  };

  return { ...state, refresh, loadNextPage };
}
