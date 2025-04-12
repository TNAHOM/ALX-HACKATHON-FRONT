import { RoomTable } from "./room-table"
import { Suspense } from "react"
import { RoomTableSkeleton } from "./room-table-skeleton"

export default function RoomsAdminPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Rooms Management</h1>
        <p className="text-muted-foreground">Manage your hotel rooms inventory</p>
      </div>

      <Suspense fallback={<RoomTableSkeleton />}>
        <RoomTable />
      </Suspense>
    </div>
  )
}
