import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error: unknown) => {
        const axiosError = error as AxiosError;
        const message =
          axiosError?.response?.data?.message ||
          axiosError.message ||
          "Что-то пошло не так";
        toast.error(message);
      },
    }),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <main className="flex min-h-screen flex-col items-center justify-between p-8">
        {children}
      </main>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
