import { z } from "zod";

const contributionSchema = z.object({
  warId: z.string().uuid(),
  clubId: z.string().uuid(),
  amount: z.number().int().min(1).max(100),
});

export async function addWarContribution(params: {
  warId: string;
  clubId: string;
  amount: number;
}): Promise<{ success: boolean; message?: string }> {
  const parsed = contributionSchema.safeParse(params);

  if (!parsed.success) {
    return { success: false, message: "Invalid input" };
  }

  const response = await fetch("/api/wars/contribute", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      warId: parsed.data.warId,
      clubId: parsed.data.clubId,
      xp: parsed.data.amount,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: result?.error ?? "Contribution failed",
    };
  }

  return { success: true };
}
