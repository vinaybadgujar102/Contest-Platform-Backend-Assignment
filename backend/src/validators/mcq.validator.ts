import z from "zod";

export const createMcqSchema = z.object({
  questionText: z.string(),
  options: z.array(z.string()),
  correctOptionIndex: z.number(),
  points: z.number(),
});

export type CreateMcqInput = z.infer<typeof createMcqSchema>;
