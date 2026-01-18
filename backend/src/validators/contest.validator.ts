import z from "zod";

export const createContestSchema = z.object({
  title: z.string(),
  description: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

export type CreateContestInput = z.infer<typeof createContestSchema>;

export const createDsaProblemSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: ["array", "hash-table"],
  points: z.number(),
  timeLimit: z.number(),
  memoryLimit: z.number(),
  testCases: z.array(
    z.object({
      input: z.string(),
      expectedOutput: z.string(),
      isHidden: z.boolean().default(false),
    }),
  ),
});

export type CreateDsaProblemInput = z.infer<typeof createDsaProblemSchema>;
