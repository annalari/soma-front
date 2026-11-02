import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "../lib/api";

// Mirrors packages/web/src/web/queries/transactions.ts
export function useTransactions() {
  return useQuery(orpc.transactions.list.queryOptions());
}

export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation(
    orpc.transactions.create.mutationOptions({
      onSuccess: () => qc.invalidateQueries({ queryKey: orpc.transactions.list.queryKey() }),
    }),
  );
}

export function useRemoveTransaction() {
  const qc = useQueryClient();
  return useMutation(
    orpc.transactions.remove.mutationOptions({
      onSuccess: () => qc.invalidateQueries({ queryKey: orpc.transactions.list.queryKey() }),
    }),
  );
}
