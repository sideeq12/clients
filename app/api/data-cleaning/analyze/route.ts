import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * POST /api/data-cleaning/analyze
 *
 * Receives column names + unique value samples (max ~80 per column).
 * Returns AI-generated cleaning rules: column type + value mappings.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { columns } = body as {
            columns: { name: string; samples: string[] }[];
        };

        if (!columns || columns.length === 0) {
            return NextResponse.json(
                { error: "No column data provided." },
                { status: 400 }
            );
        }

        // Build the prompt — compact representation of each column's samples
        const columnDescriptions = columns
            .map(
                (col) =>
                    `Column "${col.name}": [${col.samples
                        .slice(0, 80)
                        .map((v) => `"${v}"`)
                        .join(", ")}]`
            )
            .join("\n");

        const systemPrompt = `You are a data cleaning assistant. You analyze column samples from a spreadsheet and return JSON cleaning rules.

For each column, determine:
1. "type": One of "name", "date", "integer", "float", "email", "phone", "currency", "boolean", "string"
2. "corrections": An object mapping incorrect/inconsistent values to their corrected form. Only include values that NEED correction. Be conservative — only fix clear typos, inconsistencies, or format issues.

Rules for corrections:
- NAMES: Fix obvious typos (e.g. "Jon" → "John", "Jhon" → "John"). Use the most common correct spelling found in the samples. Do NOT change intentionally different names (e.g. "Jon" and "Jonathan" are different names — only fix if one is clearly a typo of a name that appears more frequently).
- DATES: Standardize ALL date values to DD/MM/YYYY format (e.g. "2nd June, 2025" → "02/06/2025", "June 2, 2025" → "02/06/2025", "2025-06-02" → "02/06/2025"). Include EVERY date value in corrections to ensure consistency even if it just needs reformatting.
- INTEGERS: Remove any accidental spaces, commas in wrong places, or non-numeric chars. Map each malformed value to its clean integer string.
- FLOATS: Standardize decimal notation. e.g. "1,234.56" stays "1234.56", "1.234,56" → "1234.56".
- EMAILS: Lowercase all emails. Fix obvious typos in domains (e.g. "gmial.com" → "gmail.com").
- PHONE: Standardize to a consistent format.
- CURRENCY: Strip currency symbols and standardize to plain number.
- BOOLEAN: Standardize to "true"/"false".
- STRINGS: Trim whitespace, fix capitalization if there's a clear pattern.

Return ONLY valid JSON in this exact format, no markdown, no explanation:
{
  "columns": {
    "<column_name>": {
      "type": "<detected_type>",
      "corrections": {
        "<original_value>": "<corrected_value>"
      }
    }
  }
}`;

        const userPrompt = `Analyze these columns and return cleaning rules:\n\n${columnDescriptions}`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.1,
            max_tokens: 4096,
            response_format: { type: "json_object" },
        });

        const content = response.choices[0]?.message?.content;

        if (!content) {
            return NextResponse.json(
                { error: "No response from AI." },
                { status: 500 }
            );
        }

        const rules = JSON.parse(content);

        return NextResponse.json(rules);
    } catch (error: any) {
        console.error("Data cleaning analyze error:", error);
        return NextResponse.json(
            { error: error?.message || "Analysis failed." },
            { status: 500 }
        );
    }
}
