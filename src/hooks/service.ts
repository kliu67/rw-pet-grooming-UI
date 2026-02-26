import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createService, updateService, deleteService } from "@/api/services";

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createService,

    // 1️⃣ Optimistic update
    onMutate: async (newService) => {
      await queryClient.cancelQueries({ queryKey: ["services"] });

      const previousServices = queryClient.getQueryData(["services"]);

      const optimisticService = {
        id: `temp-${Date.now()}`, // temporary id
        ...newService,
        base_price: Number(newService.base_price),
        created_at: new Date().toISOString()
      };

      queryClient.setQueryData(["services"], (old = []) => [
        ...old,
        optimisticService
      ]);

      return { previousServices };
    },

    // 2️⃣ Rollback if error
    onError: (err, newService, context) => {
      queryClient.setQueryData(
        ["services"],
        context.previousServices
      );
    },

    // 3️⃣ Replace optimistic with real server response
    onSuccess: (createdService) => {
      queryClient.setQueryData(["services"], (old = []) =>
        old.map((service) =>
          String(service.id).startsWith("temp-")
            ? createdService
            : service
        )
      );
    },

    // 4️⃣ Optional safety refetch
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    }
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

