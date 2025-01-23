import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

interface IColumn {
  dataIndex: string;
  title: string;
  key: string;
  renderType?: string;
}

interface DataTableProps {
  columns: IColumn[];
  dataSource: any[];
  loading?: boolean;
}

export function DataTable({
  dataSource,
  columns,
  loading
}: DataTableProps) {

  const columnsForRender = useMemo(() => {
    return columns.map(column => {
      return {
        accessorKey: column.dataIndex,
        header: column.title,
      }
    })
  }, [columns])

  const dataSourceForRender = useMemo(() => {
    return Array.isArray(dataSource) ? dataSource : []
  }, [dataSource]);


  console.log(dataSourceForRender, columnsForRender, loading);

  const table = useReactTable({
    data: dataSourceForRender,
    columns: columnsForRender,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="w-full flex flex-col rounded-md border">
      <div className="h-0 flex-1">
        <Table className="h-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="[&_tr:last-child]:border-1">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="border-b-0">
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 p-2 shrink-0 border-t m-[-1px]">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
