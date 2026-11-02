import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { authed } from "../middleware/auth";
import { db } from "../database";
import * as schema from "../database/schema";
import { CATEGORIES } from "../database/schema";

export const goals = {
  list: authed.handler(({ context }) =>
    db.select().from(schema.goals).where(eq(schema.goals.userId, context.user.id)).orderBy(schema.goals.id),
  ),
  create: authed
    .input(
      z.object({
        name: z.string().min(1).max(80),
        category: z.enum(CATEGORIES),
        targetCents: z.number().int().positive(),
      }),
    )
    .handler(async ({ input, context }) => {
      const [row] = await db
        .insert(schema.goals)
        .values({ ...input, userId: context.user.id })
        .returning();
      return row;
    }),
  addSavings: authed
    .input(z.object({ id: z.number().int(), amountCents: z.number().int().positive() }))
    .handler(async ({ input, context }) => {
      const [row] = await db
        .update(schema.goals)
        .set({ savedCents: sql`${schema.goals.savedCents} + ${input.amountCents}` })
        .where(and(eq(schema.goals.id, input.id), eq(schema.goals.userId, context.user.id)))
        .returning();
      if (!row) throw new ORPCError("NOT_FOUND", { message: "Objetivo não encontrado" });
      return row;
    }),
  remove: authed.input(z.object({ id: z.number().int() })).handler(async ({ input, context }) => {
    await db
      .delete(schema.goals)
      .where(and(eq(schema.goals.id, input.id), eq(schema.goals.userId, context.user.id)));
    return { ok: true };
  }),
};
