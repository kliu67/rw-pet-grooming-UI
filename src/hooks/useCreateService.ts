import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createService } from "@/api/services";

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createService,

    onSuccess: () => {
      // refresh services table
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}