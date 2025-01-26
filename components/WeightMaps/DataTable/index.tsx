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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useMemo } from "react";
import { LoaderCircle } from "lucide-react";

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
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function DataTable({
  dataSource,
  columns,
  loading,
  style,
  children,
}: DataTableProps) {
  const columnsForRender = useMemo(() => {
    return Array.isArray(columns) ? columns.map(column => {
      if (column.renderType === 'actions') {
        return {
          accessorKey: column.dataIndex,
          header: column.title,
          cell: (info: any) => {
            return <div className="flex space-x-2">
              {children}
            </div>
          }
        }
      }
      return {
        accessorKey: column.dataIndex,
        header: column.title,
      }
    }) : []
  }, [columns])

  const dataSourceForRender = useMemo(() => {
    return Array.isArray(dataSource) ? dataSource : []
  }, [dataSource]);

  const table = useReactTable({
    data: dataSourceForRender,
    columns: columnsForRender,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="w-full flex flex-col" style={style}>
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
            {
              loading ? (
                null
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-b-0">
                  <TableCell colSpan={columnsForRender.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 p-2 shrink-0 border-t m-[-1px]">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => table.previousPage()}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>9</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => table.nextPage()}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      {loading && (
        (
          <div
            className="absolute inset-0 flex items-center justify-center bg-white/50"
          >
            <div
              className="flex items-center gap-2"
            >
              <LoaderCircle
                className='text-gray-500 animate-spin w-4 h-4'
              />
              loading
            </div>
          </div>
        )
      )}
    </div>
  )
}
