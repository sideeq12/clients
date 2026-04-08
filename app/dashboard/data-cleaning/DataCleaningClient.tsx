"use client";

import React, { useCallback, useState, useRef } from "react";
import {
    Upload,
    FileSpreadsheet,
    Table2,
    X,
    ChevronLeft,
    ChevronRight,
    Search,
    RotateCcw,
    FileUp,
    ArrowUpDown,
    Columns3,
    Rows3,
    AlertTriangle,
    CheckCircle2,
    Loader2,
    Sparkles,
    Download,
    ScrollText,
    Undo2,
    Trash2,
    Eye,
    EyeOff,
    ArrowRight,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import {
    cleanData,
    extractColumnSamples,
    type CleaningResult,
    type ChangeLogEntry,
    type DuplicateGroup,
    type AIRules,
} from "@/lib/cleaning-engine";

type SortDirection = "asc" | "desc" | null;
type SortConfig = { column: string; direction: SortDirection };

const ROWS_PER_PAGE = 25;

// ── Main Component ─────────────────────────────────────────

export function DataCleaningClient() {
    // ── File / raw data state ──────────────────────────────
    const [fileName, setFileName] = useState<string | null>(null);
    const [fileSize, setFileSize] = useState<string>("");
    const [headers, setHeaders] = useState<string[]>([]);
    const [originalRows, setOriginalRows] = useState<string[][]>([]);
    const [rows, setRows] = useState<string[][]>([]);
    const [filteredRows, setFilteredRows] = useState<string[][]>([]);
    const [page, setPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<SortConfig>({ column: "", direction: null });
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [parseError, setParseError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── Cleaning state ─────────────────────────────────────
    const [isCleaning, setIsCleaning] = useState(false);
    const [cleaningPhase, setCleaningPhase] = useState<string>("");
    const [cleaningResult, setCleaningResult] = useState<CleaningResult | null>(null);
    const [showOriginal, setShowOriginal] = useState(false);
    const [logExpanded, setLogExpanded] = useState(true);
    const [duplicatesExpanded, setDuplicatesExpanded] = useState(true);

    // ── Helpers ────────────────────────────────────────────
    const formatBytes = (bytes: number) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
    };

    const applySearchAndSort = useCallback(
        (data: string[][], search: string, sort: SortConfig, hdrs: string[]) => {
            let processed = [...data];
            if (search.trim()) {
                const term = search.toLowerCase();
                processed = processed.filter((row) =>
                    row.some((cell) => cell.toLowerCase().includes(term))
                );
            }
            if (sort.column && sort.direction) {
                const colIdx = hdrs.indexOf(sort.column);
                if (colIdx !== -1) {
                    processed.sort((a, b) => {
                        const aVal = a[colIdx] ?? "";
                        const bVal = b[colIdx] ?? "";
                        const aNum = parseFloat(aVal);
                        const bNum = parseFloat(bVal);
                        if (!isNaN(aNum) && !isNaN(bNum)) {
                            return sort.direction === "asc" ? aNum - bNum : bNum - aNum;
                        }
                        return sort.direction === "asc"
                            ? aVal.localeCompare(bVal)
                            : bVal.localeCompare(aVal);
                    });
                }
            }
            setFilteredRows(processed);
            setPage(0);
        },
        []
    );

    // ── Parse file ─────────────────────────────────────────
    const loadData = (hdrs: string[], dataRows: string[][]) => {
        setHeaders(hdrs);
        setOriginalRows(dataRows);
        setRows(dataRows);
        setFilteredRows(dataRows);
        setPage(0);
        setCleaningResult(null);
        setShowOriginal(false);
    };

    const processFile = useCallback((file: File) => {
        setIsLoading(true);
        setParseError(null);
        setFileName(file.name);
        setFileSize(formatBytes(file.size));
        setSearchTerm("");
        setSortConfig({ column: "", direction: null });

        const ext = file.name.split(".").pop()?.toLowerCase();

        if (ext === "csv" || ext === "tsv" || ext === "txt") {
            Papa.parse(file, {
                complete(results) {
                    const raw = results.data as string[][];
                    if (raw.length < 2) {
                        setParseError("File appears empty or has no data rows.");
                        setIsLoading(false);
                        return;
                    }
                    const hdrs = raw[0].map((h, i) => (h?.trim() ? h.trim() : `Column ${i + 1}`));
                    const dataRows = raw.slice(1).filter((r) => r.some((c) => c?.trim()));
                    loadData(hdrs, dataRows);
                    setIsLoading(false);
                },
                error(err) {
                    setParseError(`CSV parse error: ${err.message}`);
                    setIsLoading(false);
                },
            });
        } else if (["xlsx", "xls", "xlsb", "ods"].includes(ext || "")) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target?.result as ArrayBuffer);
                    const workbook = XLSX.read(data, { type: "array" });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const json: string[][] = XLSX.utils.sheet_to_json(sheet, {
                        header: 1,
                        defval: "",
                    });
                    if (json.length < 2) {
                        setParseError("Spreadsheet appears empty or has no data rows.");
                        setIsLoading(false);
                        return;
                    }
                    const hdrs = (json[0] as string[]).map((h, i) =>
                        String(h)?.trim() ? String(h).trim() : `Column ${i + 1}`
                    );
                    const dataRows = json
                        .slice(1)
                        .filter((r) => r.some((c) => String(c)?.trim()))
                        .map((r) => r.map((c) => String(c)));
                    loadData(hdrs, dataRows);
                    setIsLoading(false);
                } catch {
                    setParseError("Failed to parse spreadsheet. The file may be corrupted.");
                    setIsLoading(false);
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            setParseError(`Unsupported file type: .${ext}. Please upload a CSV or Excel file.`);
            setIsLoading(false);
        }
    }, []);

    // ── Clean data pipeline ────────────────────────────────
    const handleCleanData = async () => {
        if (headers.length === 0 || originalRows.length === 0) return;

        setIsCleaning(true);
        setCleaningPhase("Sampling column values...");

        try {
            // Step 1: Extract column samples
            const samples = extractColumnSamples(headers, originalRows, 80);

            // Step 2: Send to AI for analysis
            setCleaningPhase("AI is analyzing patterns...");
            const response = await fetch("/api/data-cleaning/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ columns: samples }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "AI analysis failed.");
            }

            const rules: AIRules = await response.json();

            // Step 3: Apply cleaning rules (bulk, client-side)
            setCleaningPhase("Applying corrections to all rows...");

            // Use setTimeout to allow the UI to update the phase text
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    const result = cleanData(headers, originalRows, rules);

                    setCleaningResult(result);
                    setRows(result.cleanedRows);
                    setFilteredRows(result.cleanedRows);
                    setSearchTerm("");
                    setSortConfig({ column: "", direction: null });
                    setPage(0);
                    setShowOriginal(false);
                    resolve();
                }, 50);
            });

            setCleaningPhase("Done!");
        } catch (err: any) {
            setParseError(`Cleaning failed: ${err.message}`);
        } finally {
            setIsCleaning(false);
            setCleaningPhase("");
        }
    };

    // ── Restore duplicate rows ─────────────────────────────
    const handleRestoreDuplicate = (groupIdx: number) => {
        if (!cleaningResult) return;

        const updatedDuplicates = [...cleaningResult.duplicates];
        const group = updatedDuplicates[groupIdx];
        group.restored = true;

        // Add restored rows back to cleaned data
        const updatedRows = [...rows, ...group.removedData];
        setRows(updatedRows);
        setFilteredRows(updatedRows);

        // Update the change log to mark these as restored
        const updatedLog = cleaningResult.changeLog.map((entry) => {
            if (
                entry.reason === "duplicate" &&
                group.removedRows.includes(entry.row)
            ) {
                return { ...entry, newValue: "[RESTORED]" };
            }
            return entry;
        });

        setCleaningResult({
            ...cleaningResult,
            cleanedRows: updatedRows,
            duplicates: updatedDuplicates,
            changeLog: updatedLog,
        });
    };

    // ── Download cleaned CSV ───────────────────────────────
    const handleDownload = () => {
        const activeRows = showOriginal ? originalRows : rows;
        const csvContent = [
            headers.join(","),
            ...activeRows.map((row) =>
                row.map((cell) => {
                    const escaped = cell.replace(/"/g, '""');
                    return cell.includes(",") || cell.includes('"') || cell.includes("\n")
                        ? `"${escaped}"`
                        : cell;
                }).join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const baseName = fileName?.replace(/\.[^.]+$/, "") || "data";
        a.download = showOriginal ? `${baseName}_original.csv` : `${baseName}_cleaned.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // ── Event handlers ─────────────────────────────────────
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) processFile(file);
        },
        [processFile]
    );

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        const activeRows = showOriginal ? originalRows : rows;
        applySearchAndSort(activeRows, value, sortConfig, headers);
    };

    const handleSort = (column: string) => {
        let newDirection: SortDirection = "asc";
        if (sortConfig.column === column) {
            if (sortConfig.direction === "asc") newDirection = "desc";
            else if (sortConfig.direction === "desc") newDirection = null;
        }
        const newSort = { column: newDirection ? column : "", direction: newDirection };
        setSortConfig(newSort);
        const activeRows = showOriginal ? originalRows : rows;
        applySearchAndSort(activeRows, searchTerm, newSort, headers);
    };

    const toggleView = () => {
        const next = !showOriginal;
        setShowOriginal(next);
        const activeRows = next ? originalRows : rows;
        applySearchAndSort(activeRows, searchTerm, sortConfig, headers);
    };

    const resetAll = () => {
        setFileName(null);
        setFileSize("");
        setHeaders([]);
        setOriginalRows([]);
        setRows([]);
        setFilteredRows([]);
        setPage(0);
        setSearchTerm("");
        setSortConfig({ column: "", direction: null });
        setParseError(null);
        setCleaningResult(null);
        setShowOriginal(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // ── Derived ────────────────────────────────────────────
    const totalPages = Math.max(1, Math.ceil(filteredRows.length / ROWS_PER_PAGE));
    const pageRows = filteredRows.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);
    const hasData = headers.length > 0 && originalRows.length > 0;
    const activeRows = showOriginal ? originalRows : rows;

    // ── Render ─────────────────────────────────────────────
    return (
        <div className="space-y-6 animate-in fade-in duration-700 max-w-[1800px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground/90">
                        Data Cleaning
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Upload a file, preview your data, then clean it with AI-powered corrections.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {hasData && !isCleaning && (
                        <>
                            <button
                                onClick={handleCleanData}
                                disabled={isCleaning}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-50"
                            >
                                <Sparkles className="h-4 w-4" />
                                Clean Data
                            </button>
                            {cleaningResult && (
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors"
                                >
                                    <Download className="h-4 w-4" />
                                    Download CSV
                                </button>
                            )}
                            <button
                                onClick={resetAll}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors"
                            >
                                <RotateCcw className="h-4 w-4" />
                                Reset
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Upload Area */}
            {!hasData && !isLoading && (
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        relative cursor-pointer group
                        flex flex-col items-center justify-center gap-6
                        rounded-2xl border-2 border-dashed
                        p-16 md:p-24
                        transition-all duration-300 ease-out
                        ${isDragging
                            ? "border-primary bg-primary/5 scale-[1.01] shadow-lg shadow-primary/10"
                            : "border-border/60 bg-card hover:border-primary/50 hover:bg-primary/[0.02]"
                        }
                    `}
                >
                    <div className={`absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none ${isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`}
                        style={{ background: "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.06) 0%, transparent 70%)" }}
                    />
                    <div className={`p-5 rounded-2xl transition-all duration-300 ${isDragging ? "bg-primary/15 text-primary scale-110" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-105"}`}>
                        <Upload className="h-10 w-10" />
                    </div>
                    <div className="text-center space-y-2 relative z-10">
                        <p className="text-lg font-semibold text-foreground/90">
                            {isDragging ? "Drop your file here" : "Drag & drop your file here"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            or <span className="text-primary font-semibold underline underline-offset-4 decoration-primary/40">browse files</span> to upload
                        </p>
                        <div className="flex items-center justify-center gap-3 pt-3">
                            {[{ label: "CSV", icon: "📄" }, { label: "XLSX", icon: "📊" }, { label: "XLS", icon: "📋" }, { label: "ODS", icon: "📑" }].map((type) => (
                                <span key={type.label} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted/80 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                    {type.icon} {type.label}
                                </span>
                            ))}
                        </div>
                    </div>
                    <input ref={fileInputRef} type="file" accept=".csv,.tsv,.txt,.xlsx,.xls,.xlsb,.ods" onChange={handleFileChange} className="hidden" />
                </div>
            )}

            {/* Loading spinner */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center gap-4 py-24 rounded-2xl bg-card border border-border/50">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-sm font-semibold text-muted-foreground">Parsing your file…</p>
                </div>
            )}

            {/* Cleaning progress overlay */}
            {isCleaning && (
                <div className="flex flex-col items-center justify-center gap-4 py-16 rounded-2xl bg-card border border-primary/20 shadow-lg shadow-primary/5 animate-in fade-in duration-300">
                    <div className="relative">
                        <Loader2 className="h-12 w-12 text-primary animate-spin" />
                        <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-primary animate-pulse" />
                    </div>
                    <div className="text-center space-y-1">
                        <p className="text-base font-bold text-foreground/90">{cleaningPhase}</p>
                        <p className="text-xs text-muted-foreground">
                            Processing {originalRows.length.toLocaleString()} rows across {headers.length} columns
                        </p>
                    </div>
                </div>
            )}

            {/* Error */}
            {parseError && (
                <div className="flex items-start gap-3 p-5 rounded-xl bg-destructive/5 border border-destructive/20 animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-destructive">Error</p>
                        <p className="text-xs text-destructive/80">{parseError}</p>
                    </div>
                    <button onClick={() => setParseError(null)} className="ml-auto text-destructive/60 hover:text-destructive transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Main content: Data Table + Log Panel */}
            {hasData && !isLoading && !isCleaning && (
                <div className={`flex gap-6 ${cleaningResult ? "flex-col xl:flex-row" : ""}`}>
                    {/* ── LEFT: Data Table ──────────────────────── */}
                    <div className={`${cleaningResult ? "xl:flex-[3] min-w-0" : "w-full"} space-y-4`}>
                        {/* File info bar */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-card border border-border/50 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                    <FileSpreadsheet className="h-6 w-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-foreground/90 truncate max-w-[300px]">{fileName}</p>
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        {cleaningResult && (
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 uppercase tracking-wider">
                                                Cleaned
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 mt-0.5">
                                        <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
                                            <Rows3 className="h-3 w-3" />{activeRows.length.toLocaleString()} rows
                                        </span>
                                        <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
                                            <Columns3 className="h-3 w-3" />{headers.length} columns
                                        </span>
                                        <span className="text-[11px] text-muted-foreground font-medium">{fileSize}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Toggle original/cleaned */}
                                {cleaningResult && (
                                    <button
                                        onClick={toggleView}
                                        className={`flex items-center gap-2 h-9 px-3 rounded-lg text-xs font-semibold transition-colors ${showOriginal
                                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                                : "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                                            }`}
                                    >
                                        {showOriginal ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                        {showOriginal ? "Original" : "Cleaned"}
                                    </button>
                                )}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                    <input
                                        type="text"
                                        placeholder="Search all columns…"
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="h-9 w-[200px] rounded-lg border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all"
                                    />
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 h-9 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
                                >
                                    <FileUp className="h-3.5 w-3.5" />
                                    New
                                </button>
                                <input ref={fileInputRef} type="file" accept=".csv,.tsv,.txt,.xlsx,.xls,.xlsb,.ods" onChange={handleFileChange} className="hidden" />
                            </div>
                        </div>

                        {/* Cleaning stats bar */}
                        {cleaningResult && (
                            <div className="flex items-center gap-4 px-5 py-3 rounded-xl bg-muted/30 border border-border/30 animate-in fade-in slide-in-from-top-2 duration-300">
                                <Sparkles className="h-4 w-4 text-primary shrink-0" />
                                <div className="flex items-center gap-4 text-[11px] font-bold text-muted-foreground">
                                    <span className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                                        {cleaningResult.stats.standardized} standardized
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                                        {cleaningResult.stats.missingFilled} empty filled
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-red-500" />
                                        {cleaningResult.stats.duplicatesFound} duplicates
                                    </span>
                                    <span className="text-primary font-extrabold">
                                        {cleaningResult.stats.totalChanges} total changes
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Search results info */}
                        {searchTerm && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                <Search className="h-3 w-3" />
                                {filteredRows.length === 0
                                    ? "No rows match your search."
                                    : `Showing ${filteredRows.length.toLocaleString()} of ${activeRows.length.toLocaleString()} rows`}
                            </div>
                        )}

                        {/* Data Table */}
                        <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
                            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-muted/40 sticky top-0 z-10">
                                        <tr>
                                            <th className="px-3 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider w-[50px] text-center">#</th>
                                            {headers.map((header) => (
                                                <th
                                                    key={header}
                                                    className="px-3 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground group/th transition-colors select-none"
                                                    onClick={() => handleSort(header)}
                                                >
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="truncate max-w-[150px]">{header}</span>
                                                        <ArrowUpDown className={`h-3 w-3 shrink-0 transition-all ${sortConfig.column === header ? "text-primary opacity-100" : "opacity-0 group-hover/th:opacity-40"} ${sortConfig.column === header && sortConfig.direction === "desc" ? "rotate-180" : ""}`} />
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/30">
                                        {pageRows.length > 0 ? (
                                            pageRows.map((row, rowIdx) => {
                                                const globalIdx = page * ROWS_PER_PAGE + rowIdx + 1;
                                                return (
                                                    <tr key={rowIdx} className="hover:bg-muted/10 transition-colors">
                                                        <td className="px-3 py-2.5 text-center">
                                                            <span className="text-[10px] font-bold text-muted-foreground/40">{globalIdx}</span>
                                                        </td>
                                                        {headers.map((_, colIdx) => {
                                                            const cellVal = row[colIdx] ?? "";
                                                            const isEmpty = cellVal === "Empty";
                                                            return (
                                                                <td key={colIdx} className="px-3 py-2.5 whitespace-nowrap">
                                                                    <span className={`truncate block max-w-[220px] text-sm font-medium ${isEmpty ? "text-amber-500/70 italic" : "text-foreground/85"}`}>
                                                                        {cellVal}
                                                                    </span>
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={headers.length + 1} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Table2 className="h-8 w-8 text-muted-foreground/30" />
                                                        <p className="text-sm text-muted-foreground/60 font-medium">No rows match your search</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between px-5 py-3 border-t border-border/30 bg-muted/10">
                                <p className="text-[11px] font-medium text-muted-foreground">
                                    Page <span className="font-bold text-foreground/80">{page + 1}</span> of <span className="font-bold text-foreground/80">{totalPages}</span>
                                    <span className="hidden sm:inline ml-2 opacity-60">({filteredRows.length.toLocaleString()} rows)</span>
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <button disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}
                                        className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border/50 bg-background text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-all">
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    {(() => {
                                        const buttons: React.ReactNode[] = [];
                                        let start = Math.max(0, page - 2);
                                        let end = Math.min(totalPages - 1, start + 4);
                                        start = Math.max(0, end - 4);
                                        for (let i = start; i <= end; i++) {
                                            buttons.push(
                                                <button key={i} onClick={() => setPage(i)}
                                                    className={`inline-flex items-center justify-center h-8 w-8 rounded-lg text-xs font-bold transition-all ${i === page ? "bg-primary text-primary-foreground shadow-sm" : "border border-border/50 bg-background text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                                                    {i + 1}
                                                </button>
                                            );
                                        }
                                        return buttons;
                                    })()}
                                    <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                                        className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border/50 bg-background text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-all">
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: Change Log Panel ──────────────── */}
                    {cleaningResult && (
                        <div className="xl:flex-[2] min-w-0 xl:max-w-[500px] space-y-4">
                            {/* Log Header */}
                            <div className="p-4 rounded-xl bg-card border border-border/50 shadow-sm">
                                <button
                                    onClick={() => setLogExpanded(!logExpanded)}
                                    className="flex items-center justify-between w-full"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                            <ScrollText className="h-5 w-5" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-foreground/90 text-sm">Change Log</p>
                                            <p className="text-[11px] text-muted-foreground">
                                                {cleaningResult.changeLog.filter(e => e.reason !== "duplicate").length} corrections
                                            </p>
                                        </div>
                                    </div>
                                    {logExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                                </button>
                            </div>

                            {/* Log Entries */}
                            {logExpanded && (
                                <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden animate-in slide-in-from-top-2 fade-in duration-300">
                                    <div className="max-h-[500px] overflow-y-auto divide-y divide-border/20">
                                        {cleaningResult.changeLog
                                            .filter((e) => e.reason !== "duplicate")
                                            .length === 0 ? (
                                            <div className="p-8 text-center">
                                                <CheckCircle2 className="h-8 w-8 text-green-500/40 mx-auto mb-2" />
                                                <p className="text-xs text-muted-foreground font-medium">No corrections needed — data was already clean!</p>
                                            </div>
                                        ) : (
                                            cleaningResult.changeLog
                                                .filter((e) => e.reason !== "duplicate")
                                                .map((entry, idx) => (
                                                    <LogEntry key={idx} entry={entry} />
                                                ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Duplicate Rows Section */}
                            {cleaningResult.duplicates.length > 0 && (
                                <>
                                    <div className="p-4 rounded-xl bg-card border border-border/50 shadow-sm">
                                        <button
                                            onClick={() => setDuplicatesExpanded(!duplicatesExpanded)}
                                            className="flex items-center justify-between w-full"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                                                    <Trash2 className="h-5 w-5" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-bold text-foreground/90 text-sm">Removed Duplicates</p>
                                                    <p className="text-[11px] text-muted-foreground">
                                                        {cleaningResult.stats.duplicatesFound} duplicate rows found
                                                    </p>
                                                </div>
                                            </div>
                                            {duplicatesExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                                        </button>
                                    </div>

                                    {duplicatesExpanded && (
                                        <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden animate-in slide-in-from-top-2 fade-in duration-300">
                                            <div className="max-h-[400px] overflow-y-auto divide-y divide-border/20">
                                                {cleaningResult.duplicates.map((group, gIdx) => (
                                                    <div key={gIdx} className="p-4 space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                                                Duplicate of Row {group.keptRow}
                                                            </span>
                                                            {group.restored ? (
                                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                                                                    Restored
                                                                </span>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleRestoreDuplicate(gIdx)}
                                                                    className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                                                >
                                                                    <Undo2 className="h-3 w-3" />
                                                                    Restore
                                                                </button>
                                                            )}
                                                        </div>
                                                        {group.removedRows.map((rowNum, rIdx) => (
                                                            <div key={rIdx} className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                                                                <p className="text-[10px] font-bold text-red-500/70 mb-1.5">Row {rowNum}</p>
                                                                <p className="text-[11px] text-foreground/70 font-medium truncate">
                                                                    {group.removedData[rIdx]?.slice(0, 4).join(" • ")}
                                                                    {(group.removedData[rIdx]?.length ?? 0) > 4 && " …"}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Log Entry Component ────────────────────────────────────

function LogEntry({ entry }: { entry: ChangeLogEntry }) {
    const reasonLabels: Record<string, { label: string; color: string }> = {
        standardized: { label: "Standardized", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
        missing: { label: "Empty Filled", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
        duplicate: { label: "Duplicate", color: "bg-red-500/10 text-red-600 dark:text-red-400" },
    };

    const reason = reasonLabels[entry.reason] || reasonLabels.standardized;

    return (
        <div className="px-4 py-3 hover:bg-muted/5 transition-colors group/log">
            {/* Location + reason badge */}
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Row {entry.row}, {entry.columnName}
                </span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${reason.color} uppercase tracking-wider`}>
                    {reason.label}
                </span>
            </div>

            {/* Old → New */}
            <div className="flex items-start gap-2">
                {/* Old value */}
                <div className="flex-1 min-w-0">
                    <div className="px-2.5 py-1.5 rounded-lg bg-red-500/8 border border-red-500/15">
                        <p className="text-[11px] font-mono font-semibold text-red-600 dark:text-red-400 break-all leading-relaxed">
                            {entry.oldValue || '""'}
                        </p>
                    </div>
                </div>

                {/* Arrow */}
                <div className="shrink-0 mt-1.5">
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40" />
                </div>

                {/* New value */}
                <div className="flex-1 min-w-0">
                    <div className="px-2.5 py-1.5 rounded-lg bg-green-500/8 border border-green-500/15">
                        <p className="text-[11px] font-mono font-semibold text-green-600 dark:text-green-400 break-all leading-relaxed">
                            {entry.newValue}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
