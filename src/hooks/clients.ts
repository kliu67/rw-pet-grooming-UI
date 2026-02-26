import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient, updateClient, deleteClient } from "@/api/clients";

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      // refresh clients table
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateClient(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previousClients = queryClient.getQueryData(["users"]);

      queryClient.setQueryData(["users"], (old) =>
        old?.map((service) =>
          service.id === id ? { ...service, ...data } : service
        )
      );

      return { previousClients };
    },

    // 🔥 Rollback on error
    onError: (err, variables, context) => {
      if (context?.previousClients) {
        queryClient.setQueryData(["users"], context.previousClients);
      }
    },

    // 🔥 Ensure server truth
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteClient(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previousClients = queryClient.getQueryData(["users"]);

      queryClient.setQueryData(["users"], (old: any[]) =>
        old?.filter((service) => service.id !== id)
      );

      return { previousClients: previousClients };
    },

    // 🔹 Rollback on error
    onError: (_err, _id, context) => {
      if (context?.previousClients) {
        queryClient.setQueryData(["users"], context.previousClients);
      }
    },

    // 🔹 Ensure server truth
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });
}