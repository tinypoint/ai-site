import { DataTable } from "./DataTable"

export default function Table() {

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={[
        {
          accessorKey: "status",
          header: "Status",
        },
        {
          accessorKey: "email",
          header: "Email",
        },
        {
          accessorKey: "amount",
          header: "Amount",
        },
      ]} data={[
        {
          id: "728ed52f",
          amount: 100,
          status: "pending",
          email: "m@example.com",
        },
        // ...
      ]} />
    </div>
  )
}
