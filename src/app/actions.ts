"use server";

import { summarizeLegalDocument } from "@/ai/flows/summarize-legal-document";

export async function generateSummaryAction(documentText: string) {
  try {
    const result = await summarizeLegalDocument({ documentText });
    return { summary: result.summary, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { summary: null, error: `Failed to generate summary: ${errorMessage}` };
  }
}
