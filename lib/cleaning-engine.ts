/**
 * Data Cleaning Engine
 *
 * Pure functions that apply AI-generated rules to tabular data in bulk.
 * Designed for performance: processes 50k+ rows in milliseconds using
 * hash-map lookups rather than row-by-row API calls.
 */

// ── Types ──────────────────────────────────────────────────

export interface ChangeLogEntry {
    row: number;       // 1-indexed row number in original data
    col: number;       // 1-indexed column number
    columnName: string;
    oldValue: string;
    newValue: string;
    reason: "standardized" | "missing" | "duplicate";
}

export interface DuplicateGroup {
    /** The kept row (first occurrence), 1-indexed */
    keptRow: number;
    /** The removed row indices, 1-indexed */
    removedRows: number[];
    /** The actual row data for each removed row */
    removedData: string[][];
    /** Whether this group's removals have been restored */
    restored: boolean;
}

export interface CleaningResult {
    cleanedHeaders: string[];
    cleanedRows: string[][];
    changeLog: ChangeLogEntry[];
    duplicates: DuplicateGroup[];
    stats: {
        standardized: number;
        missingFilled: number;
        duplicatesFound: number;
        totalChanges: number;
    };
}

export interface ColumnRule {
    type: string;
    corrections: Record<string, string>;
}

export type AIRules = {
    columns: Record<string, ColumnRule>;
};

// ── Step 1: Standardize data using AI rules ─────────────────

function applyStandardization(
    headers: string[],
    rows: string[][],
    rules: AIRules
): { rows: string[][]; log: ChangeLogEntry[] } {
    const log: ChangeLogEntry[] = [];
    const newRows = rows.map((row, rowIdx) => {
        return row.map((cell, colIdx) => {
            const colName = headers[colIdx];
            const colRule = rules.columns?.[colName];
            if (!colRule || !colRule.corrections) return cell;

            const trimmed = cell.trim();
            const corrected = colRule.corrections[trimmed];

            if (corrected !== undefined && corrected !== trimmed) {
                log.push({
                    row: rowIdx + 1,
                    col: colIdx + 1,
                    columnName: colName,
                    oldValue: trimmed,
                    newValue: corrected,
                    reason: "standardized",
                });
                return corrected;
            }
            return cell;
        });
    });

    return { rows: newRows, log };
}

// ── Step 2: Fill missing/empty values ───────────────────────

function fillMissingValues(
    headers: string[],
    rows: string[][]
): { rows: string[][]; log: ChangeLogEntry[] } {
    const log: ChangeLogEntry[] = [];
    const newRows = rows.map((row, rowIdx) => {
        return row.map((cell, colIdx) => {
            if (cell === null || cell === undefined || cell.trim() === "") {
                log.push({
                    row: rowIdx + 1,
                    col: colIdx + 1,
                    columnName: headers[colIdx],
                    oldValue: cell ?? "",
                    newValue: "Empty",
                    reason: "missing",
                });
                return "Empty";
            }
            return cell;
        });
    });

    return { rows: newRows, log };
}

// ── Step 3: Remove duplicates ───────────────────────────────

function removeDuplicates(
    headers: string[],
    rows: string[][]
): { rows: string[][]; log: ChangeLogEntry[]; duplicates: DuplicateGroup[] } {
    const log: ChangeLogEntry[] = [];
    const duplicates: DuplicateGroup[] = [];

    // Build hash for each row → track first occurrence + duplicates
    const seen = new Map<string, number>(); // hash → first row index (0-based)
    const dupMap = new Map<number, number[]>(); // first row idx → [duplicate row idxs]
    const removedSet = new Set<number>();

    for (let i = 0; i < rows.length; i++) {
        const hash = rows[i].join("|||");
        const firstIdx = seen.get(hash);

        if (firstIdx !== undefined) {
            // This is a duplicate
            removedSet.add(i);
            if (!dupMap.has(firstIdx)) {
                dupMap.set(firstIdx, []);
            }
            dupMap.get(firstIdx)!.push(i);
        } else {
            seen.set(hash, i);
        }
    }

    // Build duplicate groups
    for (const [keptIdx, removedIdxs] of dupMap.entries()) {
        const group: DuplicateGroup = {
            keptRow: keptIdx + 1,
            removedRows: removedIdxs.map((i) => i + 1),
            removedData: removedIdxs.map((i) => [...rows[i]]),
            restored: false,
        };
        duplicates.push(group);

        // Log each removal
        for (const rIdx of removedIdxs) {
            log.push({
                row: rIdx + 1,
                col: 0,
                columnName: "(entire row)",
                oldValue: rows[rIdx].join(" | "),
                newValue: "[REMOVED — duplicate of row " + (keptIdx + 1) + "]",
                reason: "duplicate",
            });
        }
    }

    // Filter out removed rows
    const cleanedRows = rows.filter((_, i) => !removedSet.has(i));

    return { rows: cleanedRows, log, duplicates };
}

// ── Orchestrator ────────────────────────────────────────────

/**
 * Run the full cleaning pipeline:
 * 1. Standardize (AI rules)
 * 2. Fill missing values
 * 3. Remove duplicates
 */
export function cleanData(
    headers: string[],
    rows: string[][],
    rules: AIRules
): CleaningResult {
    // Step 1: Standardize
    const step1 = applyStandardization(headers, rows, rules);

    // Step 2: Fill missing values (on already-standardized data)
    const step2 = fillMissingValues(headers, step1.rows);

    // Step 3: Remove duplicates (on standardized + filled data)
    const step3 = removeDuplicates(headers, step2.rows);

    // Merge all logs in order
    const changeLog = [...step1.log, ...step2.log, ...step3.log];

    return {
        cleanedHeaders: headers,
        cleanedRows: step3.rows,
        changeLog,
        duplicates: step3.duplicates,
        stats: {
            standardized: step1.log.length,
            missingFilled: step2.log.length,
            duplicatesFound: step3.duplicates.reduce(
                (sum, g) => sum + g.removedRows.length,
                0
            ),
            totalChanges: changeLog.length,
        },
    };
}

// ── Helpers ─────────────────────────────────────────────────

/**
 * Extract unique sample values for each column (max `limit` per column).
 * Used to build the payload for the AI analysis endpoint.
 */
export function extractColumnSamples(
    headers: string[],
    rows: string[][],
    limit: number = 80
): { name: string; samples: string[] }[] {
    return headers.map((header, colIdx) => {
        const uniqueSet = new Set<string>();
        for (const row of rows) {
            const val = row[colIdx]?.trim();
            if (val && val !== "") {
                uniqueSet.add(val);
                if (uniqueSet.size >= limit) break;
            }
        }
        return { name: header, samples: Array.from(uniqueSet) };
    });
}
