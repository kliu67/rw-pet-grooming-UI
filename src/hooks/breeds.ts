import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBreed, updateBreed, deleteBreed } from "@/api/breeds";

export function useCreateBreed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBreed,
    onSuccess: () => {
      // refresh Breeds table
      queryClient.invalidateQueries({ queryKey: ["species"] });
    },
  });
}

export function useUpdateBreed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateBreed(id, data),
     // 🔥 Optimistic update
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["species"] });

      const previousBreeds = queryClient.getQueryData(["species"]);

      queryClient.setQueryData(["species"], (old) =>
        old?.map((breed) =>
          breed.id === id ? { ...breed, ...data } : breed
        )
      );

      return { previousBreeds };
    },

    // 🔥 Rollback on error
    onError: (err, variables, context) => {
      if (context?.previousBreeds) {
        queryClient.setQueryData(["species"], context.previousBreeds);
      }
    },

    // 🔥 Ensure server truth
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["species"] });
    }
  });
}

export function useDeleteBreed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteBreed(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["species"] });

      const previousBreeds = queryClient.getQueryData(["species"]);

      queryClient.setQueryData(["species"], (old: any[]) =>
        old?.filter((Breed) => Breed.id !== id)
      );

      return { previousBreeds };
    },

    // 🔹 Rollback on error
    onError: (_err, _id, context) => {
      if (context?.previousBreeds) {
        queryClient.setQueryData(["species"], context.previousBreeds);
      }
    },

    // 🔹 Ensure server truth
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["species"] });
    },
  });
}

