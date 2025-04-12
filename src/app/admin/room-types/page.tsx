import { RoomTypeTable } from "./room-type-table"
import { Suspense } from "react"
import { RoomTypeTableSkeleton } from "./room-type-table-skeleton"

export default function RoomTypesAdminPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Room Types Management</h1>
        <p className="text-muted-foreground">Manage your hotel room types and categories</p>
      </div>

      <Suspense fallback={<RoomTypeTableSkeleton />}>
        <RoomTypeTable />
      </Suspense>
    </div>
  )
}
