import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginUser, registerUser } from "@/api/auth";
import { USERS_QUERY_KEY } from "@/constants";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      // refresh services table
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: loginUser,
  });
}
