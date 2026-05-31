export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface ApiResponse<T> {
  data: T;
  page?: number;
  total?: number;
  total_pages?: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: { email: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface FormData {
  name: string;
  email: string;
  remarks: string;
}

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  UserList: undefined;
  SubmitForm: undefined;
};
