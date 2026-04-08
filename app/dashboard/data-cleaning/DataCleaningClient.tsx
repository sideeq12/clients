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
} from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

type SortDirection = "asc" | "desc" | null;
type SortConfig = { column: string; direction: SortDirection };

const ROWS_PER_PAGE = 25;

export function DataCleaningClient() {
    // ── State ──────────────────────────────────────────────
    const [fileName, setFileName] = useState<string | null>(null);
    const [fileSize, setFileSize] = useState<string>("");
    const [headers, setHeaders] = useState<string[]>([]);
    const [rows, setRows] = useState<string[][]>([]);
    const [filteredRows, setFilteredRows] = useState<string[][]>([]);
    const [page, setPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<SortConfig>({ column: "", direction: null });
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [parseError, setParseError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

            // Search filter
            if (search.trim()) {
                const term = search.toLowerCase();
                processed = processed.filter((row) =>
                    row.some((cell) => cell.toLowerCase().includes(term))
                );
            }

            // Sort
            if (sort.column && sort.direction) {
                const colIdx = hdrs.indexOf(sort.column);
                if (colIdx !== -1) {
                    processed.sort((a, b) => {
                        const aVal = a[colIdx] ?? "";
                        const bVal = b[colIdx] ?? "";
                        // Try numeric sort first
                        const aNum = parseFloat(aVal);
                        const bNum = parseFloat(bVal);
                        if (!isNaN(aNum) && !isNaN(bNum)) {
                            return sort.direction === "asc" ? aNum - bNum : bNum - aNum;
                        }
                        // String sort
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
    const processFile = useCallback(
        (file: File) => {
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
                        setHeaders(hdrs);
                        setRows(dataRows);
                        setFilteredRows(dataRows);
                        setPage(0);
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
                        const dataRows = json.slice(1).filter((r) => r.some((c) => String(c)?.trim()));
                        setHeaders(hdrs);
                        setRows(dataRows.map((r) => r.map((c) => String(c))));
                        setFilteredRows(dataRows.map((r) => r.map((c) => String(c))));
                        setPage(0);
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
        },
        []
    );

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
        applySearchAndSort(rows, value, sortConfig, headers);
    };

    const handleSort = (column: string) => {
        let newDirection: SortDirection = "asc";
        if (sortConfig.column === column) {
            if (sortConfig.direction === "asc") newDirection = "desc";
            else if (sortConfig.direction === "desc") newDirection = null;
        }
        const newSort = { column: newDirection ? column : "", direction: newDirection };
        setSortConfig(newSort);
        applySearchAndSort(rows, searchTerm, newSort, headers);
    };

    const resetAll = () => {
        setFileName(null);
        setFileSize("");
        setHeaders([]);
        setRows([]);
        setFilteredRows([]);
        setPage(0);
        setSearchTerm("");
        setSortConfig({ column: "", direction: null });
        setParseError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // ── Derived values ─────────────────────────────────────
    const totalPages = Math.max(1, Math.ceil(filteredRows.length / ROWS_PER_PAGE));
    const pageRows = filteredRows.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);
    const hasData = headers.length > 0 && rows.length > 0;

    // ── Render ─────────────────────────────────────────────
    return (
        <div className="space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground/90">
                        Data Cleaning
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Upload a CSV or Excel file to preview, search, and sort your data.
                    </p>
                </div>
                {hasData && (
                    <button
                        onClick={resetAll}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Reset
                    </button>
                )}
            </div>

            {/* Upload Area */}
            {!hasData && !isLoading && (
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        relative cursor-pointer group
                        flex flex-col items-center justify-center gap-6
                        rounded-2xl border-2 border-dashed
                        p-16 md:p-24
                        transition-all duration-300 ease-out
                        ${
                            isDragging
                                ? "border-primary bg-primary/5 scale-[1.01] shadow-lg shadow-primary/10"
                                : "border-border/60 bg-card hover:border-primary/50 hover:bg-primary/[0.02]"
                        }
                    `}
                >
                    {/* Decorative glow */}
                    <div
                        className={`absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none ${
                            isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                        }`}
                        style={{
                            background:
                                "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.06) 0%, transparent 70%)",
                        }}
                    />

                    <div
                        className={`p-5 rounded-2xl transition-all duration-300 ${
                            isDragging
                                ? "bg-primary/15 text-primary scale-110"
                                : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-105"
                        }`}
                    >
                        <Upload className="h-10 w-10" />
                    </div>

                    <div className="text-center space-y-2 relative z-10">
                        <p className="text-lg font-semibold text-foreground/90">
                            {isDragging ? "Drop your file here" : "Drag & drop your file here"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            or{" "}
                            <span className="text-primary font-semibold underline underline-offset-4 decoration-primary/40">
                                browse files
                            </span>{" "}
                            to upload
                        </p>
                        <div className="flex items-center justify-center gap-3 pt-3">
                            {[
                                { label: "CSV", icon: "📄" },
                                { label: "XLSX", icon: "📊" },
                                { label: "XLS", icon: "📋" },
                                { label: "ODS", icon: "📑" },
                            ].map((type) => (
                                <span
                                    key={type.label}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted/80 text-[11px] font-bold text-muted-foreground uppercase tracking-wider"
                                >
                                    {type.icon} {type.label}
                                </span>
                            ))}
                        </div>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.tsv,.txt,.xlsx,.xls,.xlsb,.ods"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
            )}

            {/* Loading spinner */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center gap-4 py-24 rounded-2xl bg-card border border-border/50">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-sm font-semibold text-muted-foreground">
                        Parsing your file…
                    </p>
                </div>
            )}

            {/* Error state */}
            {parseError && (
                <div className="flex items-start gap-3 p-5 rounded-xl bg-destructive/5 border border-destructive/20 animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-destructive">Unable to parse file</p>
                        <p className="text-xs text-destructive/80">{parseError}</p>
                    </div>
                    <button
                        onClick={resetAll}
                        className="ml-auto text-destructive/60 hover:text-destructive transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Data Preview */}
            {hasData && !isLoading && (
                <>
                    {/* File info + controls bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-card border border-border/50 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                <FileSpreadsheet className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-foreground/90 truncate max-w-[300px]">
                                        {fileName}
                                    </p>
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                </div>
                                <div className="flex items-center gap-3 mt-0.5">
                                    <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
                                        <Rows3 className="h-3 w-3" />
                                        {rows.length.toLocaleString()} rows
                                    </span>
                                    <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
                                        <Columns3 className="h-3 w-3" />
                                        {headers.length} columns
                                    </span>
                                    <span className="text-[11px] text-muted-foreground font-medium">
                                        {fileSize}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Search + upload new */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                <input
                                    type="text"
                                    placeholder="Search all columns…"
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="h-9 w-[220px] rounded-lg border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all"
                                />
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 h-9 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
                            >
                                <FileUp className="h-3.5 w-3.5" />
                                New File
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv,.tsv,.txt,.xlsx,.xls,.xlsb,.ods"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* Results info */}
                    {searchTerm && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium -mt-4">
                            <Search className="h-3 w-3" />
                            {filteredRows.length === 0
                                ? "No rows match your search."
                                : `Showing ${filteredRows.length.toLocaleString()} of ${rows.length.toLocaleString()} rows`}
                        </div>
                    )}

                    {/* Data Table */}
                    <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/40 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider w-[60px] text-center">
                                            #
                                        </th>
                                        {headers.map((header) => (
                                            <th
                                                key={header}
                                                className="px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground group/th transition-colors select-none"
                                                onClick={() => handleSort(header)}
                                            >
                                                <div className="flex items-center gap-1.5">
                                                    <span className="truncate max-w-[180px]">
                                                        {header}
                                                    </span>
                                                    <ArrowUpDown
                                                        className={`h-3 w-3 shrink-0 transition-all ${
                                                            sortConfig.column === header
                                                                ? "text-primary opacity-100"
                                                                : "opacity-0 group-hover/th:opacity-40"
                                                        } ${
                                                            sortConfig.column === header &&
                                                            sortConfig.direction === "desc"
                                                                ? "rotate-180"
                                                                : ""
                                                        }`}
                                                    />
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
                                                <tr
                                                    key={rowIdx}
                                                    className="hover:bg-muted/10 transition-colors group/row"
                                                >
                                                    <td className="px-4 py-3 text-center">
                                                        <span className="text-[10px] font-bold text-muted-foreground/40">
                                                            {globalIdx}
                                                        </span>
                                                    </td>
                                                    {headers.map((_, colIdx) => (
                                                        <td
                                                            key={colIdx}
                                                            className="px-4 py-3 text-foreground/85 font-medium whitespace-nowrap"
                                                        >
                                                            <span className="truncate block max-w-[280px]">
                                                                {row[colIdx] ?? ""}
                                                            </span>
                                                        </td>
                                                    ))}
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={headers.length + 1}
                                                className="px-6 py-16 text-center"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <Table2 className="h-8 w-8 text-muted-foreground/30" />
                                                    <p className="text-sm text-muted-foreground/60 font-medium">
                                                        No rows match your search
                                                    </p>
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
                                Page{" "}
                                <span className="font-bold text-foreground/80">
                                    {page + 1}
                                </span>{" "}
                                of{" "}
                                <span className="font-bold text-foreground/80">
                                    {totalPages}
                                </span>
                                <span className="hidden sm:inline ml-2 opacity-60">
                                    ({filteredRows.length.toLocaleString()} rows)
                                </span>
                            </p>
                            <div className="flex items-center gap-1.5">
                                <button
                                    disabled={page === 0}
                                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                                    className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border/50 bg-background text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-all"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>

                                {/* Page number buttons (show max 5) */}
                                {(() => {
                                    const buttons: React.ReactNode[] = [];
                                    let start = Math.max(0, page - 2);
                                    let end = Math.min(totalPages - 1, start + 4);
                                    start = Math.max(0, end - 4);
                                    for (let i = start; i <= end; i++) {
                                        buttons.push(
                                            <button
                                                key={i}
                                                onClick={() => setPage(i)}
                                                className={`inline-flex items-center justify-center h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                                                    i === page
                                                        ? "bg-primary text-primary-foreground shadow-sm"
                                                        : "border border-border/50 bg-background text-muted-foreground hover:text-foreground hover:bg-muted"
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        );
                                    }
                                    return buttons;
                                })()}

                                <button
                                    disabled={page >= totalPages - 1}
                                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                                    className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border/50 bg-background text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-all"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
