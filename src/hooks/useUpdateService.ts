import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateService } from "@/api/services";

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
   mutationFn: ({ id, data }) => updateService(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}