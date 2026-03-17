import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBreeds, createBreed, updateBreed, deleteBreed } from "@/api/breeds";
import { BREEDS_QUERY_KEY } from "@/constants";

export function useBreeds() {
  return useQuery({
    queryKey: [BREEDS_QUERY_KEY],
    queryFn: getBreeds
  });
}

export function useCreateBreed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBreed,
    onSuccess: () => {
      // refresh Breeds table
      queryClient.invalidateQueries({ queryKey: [BREEDS_QUERY_KEY] });
    },
  });
}

export function useUpdateBreed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateBreed(id, data),
     // 🔥 Optimistic update
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: [BREEDS_QUERY_KEY] });

      const previousBreeds = queryClient.getQueryData([BREEDS_QUERY_KEY]);

      queryClient.setQueryData([BREEDS_QUERY_KEY], (old) =>
        old?.map((breed) =>
          breed.id === id ? { ...breed, ...data } : breed
        )
      );

      return { previousBreeds };
    },

    // 🔥 Rollback on error
    onError: (err, variables, context) => {
      if (context?.previousBreeds) {
        queryClient.setQueryData([BREEDS_QUERY_KEY], context.previousBreeds);
      }
    },

    // 🔥 Ensure server truth
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [BREEDS_QUERY_KEY] });
    }
  });
}

export function useDeleteBreed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteBreed(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: [BREEDS_QUERY_KEY] });

      const previousBreeds = queryClient.getQueryData([BREEDS_QUERY_KEY]);

      queryClient.setQueryData([BREEDS_QUERY_KEY], (old: any[]) =>
        old?.filter((Breed) => Breed.id !== id)
      );

      return { previousBreeds };
    },

    // 🔹 Rollback on error
    onError: (_err, _id, context) => {
      if (context?.previousBreeds) {
        queryClient.setQueryData([BREEDS_QUERY_KEY], context.previousBreeds);
      }
    },

    // 🔹 Ensure server truth
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [BREEDS_QUERY_KEY] });
    },
  });
}

