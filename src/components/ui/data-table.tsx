import { useState, useMemo } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  RowSelectionState,
} from '@tanstack/react-table';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Trash2,
  Loader2
} from 'lucide-react';

interface DataTableProps<TData extends object, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title: string;
  searchPlaceholder?: string;
  exportFileName?: string;
  isLoading?: boolean;
}

export function DataTable<TData extends object, TValue>({
  columns,
  data,
  title,
  searchPlaceholder = 'جستجو...',
  exportFileName = 'data',
  isLoading = false
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
  });

  const exportToExcel = (onlySelected = false) => {
    const visibleColumns = table.getVisibleFlatColumns();
    const exportRows = onlySelected
      ? table.getFilteredSelectedRowModel().rows
      : table.getFilteredRowModel().rows;
    const exportData = exportRows.map(row => {
      const rowData: any = {};
      visibleColumns.forEach(column => {
        const cellValue = row.getValue(column.id);
        rowData[column.id] = cellValue;
      });
      return rowData;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${exportFileName}.xlsx`);
  };

  // Calculate summary (for PaymentsPage)
  const summary = useMemo(() => {
    const rows = table.getFilteredRowModel().rows;
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const hasAmount = rows.length > 0 && 'amount' in rows[0].original;
    const totalAmount = hasAmount ? rows.reduce((sum, row) => sum + (Number((row.original as any).amount) || 0), 0) : undefined;
    const selectedAmount = hasAmount ? selectedRows.reduce((sum, row) => sum + (Number((row.original as any).amount) || 0), 0) : undefined;
    return {
      totalCount: rows.length,
      totalAmount,
      selectedCount: selectedRows.length,
      selectedAmount,
      hasAmount,
    };
  }, [table]);

  // Mobile card view for small screens
  const MobileCardView = () => (
    <div className="md:hidden space-y-4">
      <AnimatePresence>
        {table.getRowModel().rows.map((row, index) => (
          <motion.div
            key={row.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Card className="p-4">
              <div className="space-y-3">
                {row.getVisibleCells().map((cell) => (
                  <div key={cell.id} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">
                      {typeof cell.column.columnDef.header === 'string'
                        ? cell.column.columnDef.header
                        : cell.column.id}
                    </span>
                    <span className="text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  // Bulk actions bar
  const BulkActionsBar = () => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-wrap gap-2 items-center bg-muted/60 border rounded-lg p-3 mb-4 shadow-sm"
    >
      <span className="text-sm font-medium">{summary.selectedCount} مورد انتخاب شده</span>
      <Button
        size="sm"
        variant="outline"
        onClick={() => exportToExcel(true)}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        خروجی اکسل (انتخاب‌شده‌ها)
      </Button>
      <Button
        size="sm"
        variant="destructive"
        className="gap-2"
        disabled
      >
        <Trash2 className="h-4 w-4" />
        حذف گروهی
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => table.resetRowSelection()}
      >
        لغو انتخاب
      </Button>
      {summary.hasAmount && (summary.selectedAmount ?? 0) > 0 && (
        <span className="text-xs text-muted-foreground">
          مجموع مبلغ انتخاب‌شده: {Number(summary.selectedAmount ?? 0).toLocaleString('fa-IR')} تومان
        </span>
      )}
    </motion.div>
  );

  // Add selection column to columns
  const allColumns = useMemo(() => {
    const selectionColumn: ColumnDef<TData, any> = {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          className="accent-primary w-4 h-4 rounded border"
          aria-label="انتخاب همه"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="accent-primary w-4 h-4 rounded border"
          aria-label="انتخاب ردیف"
        />
      ),
      size: 32,
      minSize: 32,
      maxSize: 32,
      enableResizing: false,
      enableSorting: false,
      enableHiding: false,
    };
    return [selectionColumn, ...columns];
  }, [columns]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">
            مجموع {summary.totalCount} مورد
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* Global Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pr-10 md:w-[250px]"
            />
          </div>
          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Eye className="h-4 w-4" />
                ستون‌ها
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {table
                .getAllLeafColumns()
                .filter((column) => column.getCanHide() && column.id !== 'select')
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {typeof column.columnDef.header === 'string'
                        ? column.columnDef.header
                        : column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Export */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToExcel(false)}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            خروجی اکسل
          </Button>
        </div>
      </motion.div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {summary.selectedCount > 0 && <BulkActionsBar />}
      </AnimatePresence>

      {/* Desktop Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="hidden md:block">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-right">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    data-state={row.getIsSelected() && 'selected'}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-right">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={allColumns.length}
                    className="h-24 text-center"
                  >
                    هیچ داده‌ای یافت نشد.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            {/* Summary Row */}
            {summary.hasAmount && typeof summary.totalAmount === 'number' && summary.totalCount > 0 && (
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2} className="font-bold text-right">جمع کل</TableCell>
                  <TableCell className="font-bold text-left" dir="ltr">
                    {Number(summary.totalAmount ?? 0).toLocaleString('fa-IR')} تومان
                  </TableCell>
                  {allColumns.slice(3).map((col, idx) => (
                    <TableCell key={col.id || idx} />
                  ))}
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </Card>
      </motion.div>

      {/* Mobile Card View */}
      <MobileCardView />

      {/* Pagination */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="text-sm text-muted-foreground">
          نمایش {table.getState().pagination.pageIndex + 1} از{' '}
          {table.getPageCount()} صفحه
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}