import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getServices, createService, updateService, deleteService } from "@/api/services";
import { SERVICES_QUERY_KEY } from "@/constants";

export function useServices() {
  return useQuery({
    queryKey: [SERVICES_QUERY_KEY],
    queryFn: getServices
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      // refresh services table
      queryClient.invalidateQueries({ queryKey: [SERVICES_QUERY_KEY] });
    }
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateService(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: [SERVICES_QUERY_KEY] });

      const previousServices = queryClient.getQueryData([SERVICES_QUERY_KEY]);

      queryClient.setQueryData([SERVICES_QUERY_KEY], (old) =>
        old?.map((service) =>
          service.id === id ? { ...service, ...data } : service
        )
      );

      return { previousServices };
    },

    // 🔥 Rollback on error
    onError: (err, variables, context) => {
      if (context?.previousServices) {
        queryClient.setQueryData([SERVICES_QUERY_KEY], context.previousServices);
      }
    },

    // 🔥 Ensure server truth
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [SERVICES_QUERY_KEY] });
    }
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteService(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: [SERVICES_QUERY_KEY] });

      const previousServices = queryClient.getQueryData([SERVICES_QUERY_KEY]);

      queryClient.setQueryData([SERVICES_QUERY_KEY], (old: any[]) =>
        old?.filter((service) => service.id !== id)
      );

      return { previousServices };
    },

    // 🔹 Rollback on error
    onError: (_err, _id, context) => {
      if (context?.previousServices) {
        queryClient.setQueryData([SERVICES_QUERY_KEY], context.previousServices);
      }
    },

    // 🔹 Ensure server truth
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [SERVICES_QUERY_KEY] });
    }
  });
}
