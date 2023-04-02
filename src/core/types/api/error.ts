export type ApiError = {
  response?: {
    status: number;
    data: string;
  };
  message?: string;
};
