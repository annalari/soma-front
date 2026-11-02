import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "../lib/api";

// Mirrors packages/web/src/web/queries/goals.ts
export function useGoals() {
  return useQuery(orpc.goals.list.queryOptions());
}

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation(
    orpc.goals.create.mutationOptions({
      onSuccess: () => qc.invalidateQueries({ queryKey: orpc.goals.list.queryKey() }),
    }),
  );
}

export function useAddSavings() {
  const qc = useQueryClient();
  return useMutation(
    orpc.goals.addSavings.mutationOptions({
      onSuccess: () => qc.invalidateQueries({ queryKey: orpc.goals.list.queryKey() }),
    }),
  );
}
