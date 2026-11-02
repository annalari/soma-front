import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";
import { authed } from "../middleware/auth";
import { db } from "../database";
import * as schema from "../database/schema";
import { CATEGORIES } from "../database/schema";

const categorySchema = z.enum(CATEGORIES);

export const transactions = {
  list: authed.handler(({ context }) =>
    db
      .select()
      .from(schema.transactions)
      .where(eq(schema.transactions.userId, context.user.id))
      .orderBy(desc(schema.transactions.occurredOn), desc(schema.transactions.id)),
  ),
  create: authed
    .input(
      z.object({
        description: z.string().min(1).max(120),
        amountCents: z.number().int().positive(),
        type: z.enum(["income", "expense"]),
        category: categorySchema,
        occurredOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      }),
    )
    .handler(async ({ input, context }) => {
      const [row] = await db
        .insert(schema.transactions)
        .values({ ...input, userId: context.user.id })
        .returning();
      return row;
    }),
  remove: authed.input(z.object({ id: z.number().int() })).handler(async ({ input, context }) => {
    await db
      .delete(schema.transactions)
      .where(and(eq(schema.transactions.id, input.id), eq(schema.transactions.userId, context.user.id)));
    return { ok: true };
  }),
};
