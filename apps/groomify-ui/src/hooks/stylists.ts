import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getStylists } from "@/api/stylists";
import { STYLISTS_QUERY_KEY } from "@/constants";

export function useStylists() {
  return useQuery({
    queryKey: [STYLISTS_QUERY_KEY],
    queryFn: getStylists
  });
}