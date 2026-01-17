import z from "zod";

export const createContestSchema = z.object({
  title: z.string(),
  description: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

export type CreateContestInput = z.infer<typeof createContestSchema>;
