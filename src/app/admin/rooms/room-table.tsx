"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Edit, PlusCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { RoomDialog } from "./room-dialog"
import { DeleteRoomDialog } from "./delete-room-dialog"

// Type definitions
interface Room {
  id: number
  room_number: string
  floor: number
  is_available: boolean
  room_type_id: number
  room_type: {
    id: number
    name: string
  }
}

interface RoomType {
  id: number
  name: string
  description: string
  price_per_night: number
}

const dummyRoomTypes: RoomType[] = [
  {
    id: 1,
    name: "Standard Single",
    description: "Cozy room with a single bed and basic amenities.",
    price_per_night: 50,
  },
  {
    id: 2,
    name: "Deluxe Double",
    description: "Spacious room with a double bed and city view.",
    price_per_night: 80,
  },
  {
    id: 3,
    name: "Executive Suite",
    description: "Luxurious suite with a king bed and private balcony.",
    price_per_night: 150,
  },
  {
    id: 4,
    name: "Family Room",
    description: "Room with two queen beds, ideal for families.",
    price_per_night: 120,
  },
  {
    id: 5,
    name: "Budget Twin",
    description: "Affordable room with two twin beds.",
    price_per_night: 45,
  },
  {
    id: 6,
    name: "Penthouse",
    description: "Top-floor suite with premium amenities and panoramic views.",
    price_per_night: 250,
  },
  {
    id: 7,
    name: "Oceanfront Villa",
    description: "Private villa with direct beach access.",
    price_per_night: 300,
  },
  {
    id: 8,
    name: "Standard Queen",
    description: "Comfortable room with a queen bed and modern decor.",
    price_per_night: 65,
  },
  {
    id: 9,
    name: "Junior Suite",
    description: "Mid-tier suite with a sitting area and king bed.",
    price_per_night: 110,
  },
  {
    id: 10,
    name: "Accessible Room",
    description: "Room designed for accessibility with a double bed.",
    price_per_night: 60,
  },
];

const dummyRooms: Room[] = [
  {
    id: 1,
    room_number: "101",
    floor: 1,
    is_available: true,
    room_type_id: 1,
    room_type: {
      id: 1,
      name: "Standard Single",
    },
  },
  {
    id: 2,
    room_number: "205",
    floor: 2,
    is_available: false,
    room_type_id: 2,
    room_type: {
      id: 2,
      name: "Deluxe Double",
    },
  },
  {
    id: 3,
    room_number: "310",
    floor: 3,
    is_available: true,
    room_type_id: 3,
    room_type: {
      id: 3,
      name: "Executive Suite",
    },
  },
  {
    id: 4,
    room_number: "112",
    floor: 1,
    is_available: true,
    room_type_id: 4,
    room_type: {
      id: 4,
      name: "Family Room",
    },
  },
  {
    id: 5,
    room_number: "408",
    floor: 4,
    is_available: false,
    room_type_id: 5,
    room_type: {
      id: 5,
      name: "Budget Twin",
    },
  },
  {
    id: 6,
    room_number: "520",
    floor: 5,
    is_available: true,
    room_type_id: 6,
    room_type: {
      id: 6,
      name: "Penthouse",
    },
  },
  {
    id: 7,
    room_number: "V01",
    floor: 1,
    is_available: false,
    room_type_id: 7,
    room_type: {
      id: 7,
      name: "Oceanfront Villa",
    },
  },
  {
    id: 8,
    room_number: "306",
    floor: 3,
    is_available: true,
    room_type_id: 8,
    room_type: {
      id: 8,
      name: "Standard Queen",
    },
  },
  {
    id: 9,
    room_number: "415",
    floor: 4,
    is_available: true,
    room_type_id: 9,
    room_type: {
      id: 9,
      name: "Junior Suite",
    },
  },
  {
    id: 10,
    room_number: "107",
    floor: 1,
    is_available: true,
    room_type_id: 10,
    room_type: {
      id: 10,
      name: "Accessible Room",
    },
  },
];

// API functions
async function fetchRooms() {
  const response = await fetch("/api/rooms")
  if (!response.ok) {
    console.log("Failed to fetch rooms")
  }
  return response.json()
}

async function createRoom(room: Omit<Room, "id" | "room_type">) {
  const response = await fetch("/api/rooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(room),
  })
  if (!response.ok) {
    console.log("Failed to create room")
  }
  return response.json()
}

async function updateRoom(room: Omit<Room, "room_type">) {
  const response = await fetch(`/api/rooms/${room.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(room),
  })
  if (!response.ok) {
    console.log("Failed to update room")
  }
  return response.json()
}

async function deleteRoom(id: number) {
  const response = await fetch(`/api/rooms/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    console.log("Failed to delete room")
  }
  return response.json()
}

export function RoomTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

  const queryClient = useQueryClient()

  // Fetch rooms and room types
  // const { data, isLoading, error } = useQuery({
  //   queryKey: ["rooms"],
  //   queryFn: fetchRooms,
  // })

  // Mutations
  const createMutation = useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] })
      // toast({
      //   title: "Room created",
      //   description: "The room has been created successfully.",
      // })
    },
    onError: (error) => {
      // toast({
      //   title: "Error",
      //   description: `Failed to create room: ${error.message}`,
      //   variant: "destructive",
      // })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] })
      // toast({
      //   title: "Room updated",
      //   description: "The room has been updated successfully.",
      // })
    },
    onError: (error) => {
      // toast({
      //   title: "Error",
      //   description: `Failed to update room: ${error.message}`,
      //   variant: "destructive",
      // })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] })
      // toast({
      //   title: "Room deleted",
      //   description: "The room has been deleted successfully.",
      // })
    },
    onError: (error) => {
      // toast({
      //   title: "Error",
      //   description: `Failed to delete room: ${error.message}`,
      //   variant: "destructive",
      // })
    },
  })

  // Table columns definition
  const columns: ColumnDef<Room>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "room_number",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Room Number
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("room_number")}</div>,
    },
    {
      accessorKey: "floor",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Floor
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "room_type.name",
      header: "Room Type",
      cell: ({ row }) => <div>{row.original.room_type.name}</div>,
    },
    {
      accessorKey: "is_available",
      header: "Availability",
      cell: ({ row }) => (
        <Badge variant={row.original.is_available ? "default" : "destructive"}>
          {row.original.is_available ? "Available" : "Occupied"}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const room = row.original

        return (
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(room)}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(room)}>
              <Trash2 className="h-4 w-4 text-destructive" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        )
      },
    },
  ]

  
  const rooms = dummyRooms
  const roomTypes = dummyRoomTypes
  // const rooms = data?.rooms || dummyRooms
  // const roomTypes = data?.roomTypes || []

  const table = useReactTable({
    data: rooms,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const handleEdit = (room: Room) => {
    setSelectedRoom(room)
    setIsDialogOpen(true)
  }

  const handleDelete = (room: Room) => {
    setSelectedRoom(room)
    setIsDeleteDialogOpen(true)
  }

  const handleAddNew = () => {
    setSelectedRoom(null)
    setIsDialogOpen(true)
  }

  const handleSave = (roomData: Partial<Room>) => {
    if (selectedRoom) {
      // Update existing room
      updateMutation.mutate({
        id: selectedRoom.id,
        ...roomData,
      } as Omit<Room, "room_type">)
    } else {
      // Create new room
      createMutation.mutate(roomData as Omit<Room, "id" | "room_type">)
    }
    setIsDialogOpen(false)
  }

  const confirmDelete = () => {
    if (selectedRoom) {
      deleteMutation.mutate(selectedRoom.id)
    }
    setIsDeleteDialogOpen(false)
  }

  // if (error) {
  //   return <div className="text-destructive">Error loading rooms: {(error as Error).message}</div>
  // }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter by room number..."
          value={(table.getColumn("room_number")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("room_number")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Add Room</span>
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No rooms found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>

      <RoomDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        room={selectedRoom}
        roomTypes={roomTypes}
        onSave={handleSave}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteRoomDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        roomNumber={selectedRoom?.room_number}
        onConfirm={confirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  )
}
