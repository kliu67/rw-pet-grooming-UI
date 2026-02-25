import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createService, updateService, deleteService } from "@/api/services";

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

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteService(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["services"] });

      const previousServices = queryClient.getQueryData(["services"]);

      queryClient.setQueryData(["services"], (old: any[]) =>
        old?.filter((service) => service.id !== id)
      );

      return { previousServices };
    },

    // 🔹 Rollback on error
    onError: (_err, _id, context) => {
      if (context?.previousServices) {
        queryClient.setQueryData(["services"], context.previousServices);
      }
    },

    // 🔹 Ensure server truth
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

