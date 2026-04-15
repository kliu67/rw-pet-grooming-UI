import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPets,
  getPet,
  getPetByOwner,
  createPet,
  updatePet,
  deletePet,
} from "@/api/pets";
import { PETS_QUERY_KEY } from "@/constants";

type UsePetsByOwnerOptions = {
  enabled?: boolean;
};

export function usePets() {
  return useQuery({
    queryKey: [PETS_QUERY_KEY],
    queryFn: getPets,
  });
}

export function usePet(id: number | string | undefined) {
  return useQuery({
    queryKey: [PETS_QUERY_KEY, id],
    queryFn: () => getPet(id),
    enabled: id !== undefined && id !== null,
  });
}

export function usePetsByOwner(
  clientId: number | string | undefined,
  options: UsePetsByOwnerOptions = {},
) {
  const hasClientId = clientId !== undefined && clientId !== null;
  const enabled = options.enabled ?? false; // manual by default

  return useQuery({
    queryKey: [PETS_QUERY_KEY, "owner", clientId],
    queryFn: () => getPetByOwner(clientId),
    enabled: enabled && hasClientId,
  });
}

export function useCreatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPet,
    onSuccess: () => {
      // refresh services table
      queryClient.invalidateQueries({ queryKey: [PETS_QUERY_KEY] });
    },
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updatePet(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: [PETS_QUERY_KEY] });

      const previousPets = queryClient.getQueryData([PETS_QUERY_KEY]);

      queryClient.setQueryData([PETS_QUERY_KEY], (old) =>
        old?.map((pet) => (pet.id === id ? { ...pet, ...data } : pet)),
      );

      return { previousPets };
    },

    // 🔥 Rollback on error
    onError: (err, variables, context) => {
      if (context?.previousPets) {
        queryClient.setQueryData([PETS_QUERY_KEY], context.previousPets);
      }
    },

    // 🔥 Ensure server truth
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [PETS_QUERY_KEY] });
    },
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deletePet(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: [PETS_QUERY_KEY] });

      const previousPets = queryClient.getQueryData([PETS_QUERY_KEY]);

      queryClient.setQueryData([PETS_QUERY_KEY], (old: any[]) =>
        old?.filter((pet) => pet.id !== id),
      );

      return { previousPets };
    },

    // 🔹 Rollback on error
    onError: (_err, _id, context) => {
      if (context?.previousPets) {
        queryClient.setQueryData([PETS_QUERY_KEY], context.previousPets);
      }
    },

    // 🔹 Ensure server truth
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [PETS_QUERY_KEY] });
    },
  });
}
