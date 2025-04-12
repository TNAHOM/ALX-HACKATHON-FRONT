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
import { RoomTypeDialog } from "./room-type-dialog"
import { DeleteRoomTypeDialog } from "./delete-room-type-dialog"

// Type definitions
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

// API functions
async function fetchRoomTypes() {
  const response = await fetch("/api/room-types")
  if (!response.ok) {
    console.log("Failed to fetch room types")
  }
  return response.json()
}

async function createRoomType(roomType: Omit<RoomType, "id">) {
  const response = await fetch("/api/room-types", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(roomType),
  })
  if (!response.ok) {
    console.log("Failed to create room type")
  }
  return response.json()
}

async function updateRoomType(roomType: RoomType) {
  const response = await fetch(`/api/room-types/${roomType.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(roomType),
  })
  if (!response.ok) {
    console.log("Failed to update room type")
  }
  return response.json()
}

async function deleteRoomType(id: number) {
  const response = await fetch(`/api/room-types/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    console.log("Failed to delete room type")
  }
  return response.json()
}

export function RoomTypeTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null)

  const queryClient = useQueryClient()

  // Fetch room types
  // const { data, isLoading, error } = useQuery({
  //   queryKey: ["roomTypes"],
  //   queryFn: fetchRoomTypes,
  // })

  // Mutations
  const createMutation = useMutation({
    mutationFn: createRoomType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roomTypes"] })
      // toast({
      //   title: "Room type created",
      //   description: "The room type has been created successfully.",
      // })
    },
    onError: (error) => {
      // toast({
      //   title: "Error",
      //   description: `Failed to create room type: ${error.message}`,
      //   variant: "destructive",
      // })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateRoomType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roomTypes"] })
      // toast({
      //   title: "Room type updated",
      //   description: "The room type has been updated successfully.",
      // })
    },
    onError: (error) => {
      // toast({
      //   title: "Error",
      //   description: `Failed to update room type: ${error.message}`,
      //   variant: "destructive",
      // })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteRoomType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roomTypes"] })
      // toast({
      //   title: "Room type deleted",
      //   description: "The room type has been deleted successfully.",
      // })
    },
    onError: (error) => {
      // toast({
      //   title: "Error",
      //   description: `Failed to delete room type: ${error.message}`,
      //   variant: "destructive",
      // })
    },
  })

  // Table columns definition
  const columns: ColumnDef<RoomType>[] = [
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
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <div className="max-w-[300px] truncate">{row.getValue("description")}</div>,
    },
    {
      accessorKey: "price_per_night",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Price Per Night
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>${row.getValue("price_per_night")}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const roomType = row.original

        return (
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(roomType)}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(roomType)}>
              <Trash2 className="h-4 w-4 text-destructive" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        )
      },
    },
  ]

  // const roomTypes = data?.roomTypes || dummyRoomTypes
  const roomTypes = dummyRoomTypes

  const table = useReactTable({
    data: roomTypes,
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

  const handleEdit = (roomType: RoomType) => {
    setSelectedRoomType(roomType)
    setIsDialogOpen(true)
  }

  const handleDelete = (roomType: RoomType) => {
    setSelectedRoomType(roomType)
    setIsDeleteDialogOpen(true)
  }

  const handleAddNew = () => {
    setSelectedRoomType(null)
    setIsDialogOpen(true)
  }

  const handleSave = (roomTypeData: Partial<RoomType>) => {
    if (selectedRoomType) {
      // Update existing room type
      updateMutation.mutate({
        id: selectedRoomType.id,
        ...roomTypeData,
      } as RoomType)
    } else {
      // Create new room type
      createMutation.mutate(roomTypeData as Omit<RoomType, "id">)
    }
    setIsDialogOpen(false)
  }

  const confirmDelete = () => {
    if (selectedRoomType) {
      deleteMutation.mutate(selectedRoomType.id)
    }
    setIsDeleteDialogOpen(false)
  }

  // if (error) {
  //   return <div className="text-destructive">Error loading room types: {(error as Error).message}</div>
  // }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
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
            <span>Add Room Type</span>
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
                  No room types found.
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

      <RoomTypeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        roomType={selectedRoomType}
        onSave={handleSave}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteRoomTypeDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        roomTypeName={selectedRoomType?.name}
        onConfirm={confirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  )
}
