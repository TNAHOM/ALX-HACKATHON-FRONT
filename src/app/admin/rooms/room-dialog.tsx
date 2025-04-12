"use client"

import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

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
}

const roomSchema = z.object({
  room_number: z.string().min(1, "Room number is required"),
  floor: z.coerce.number().min(0, "Floor must be 0 or higher"),
  is_available: z.boolean().default(true),
  room_type_id: z.coerce.number({
    required_error: "Room type is required",
    invalid_type_error: "Room type is required",
  }),
})

type RoomFormValues = z.infer<typeof roomSchema>

interface RoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  room: Room | null
  roomTypes: RoomType[]
  onSave: (data: RoomFormValues) => void
  isSubmitting: boolean
}

export function RoomDialog({ open, onOpenChange, room, roomTypes, onSave, isSubmitting }: RoomDialogProps) {
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      room_number: "",
      floor: 1,
      is_available: true,
      room_type_id: undefined,
    },
  })

  // Reset form when room changes
  useEffect(() => {
    if (open) {
      if (room) {
        form.reset({
          room_number: room.room_number,
          floor: room.floor,
          is_available: room.is_available,
          room_type_id: room.room_type_id,
        })
      } else {
        form.reset({
          room_number: "",
          floor: 1,
          is_available: true,
          room_type_id: roomTypes[0]?.id,
        })
      }
    }
  }, [room, form, open, roomTypes])

  const onSubmit = (data: RoomFormValues) => {
    onSave(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{room ? "Edit Room" : "Add New Room"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="room_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Number</FormLabel>
                  <FormControl>
                    <Input placeholder="101" {...field} />
                  </FormControl>
                  <FormDescription>Unique identifier for the room</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="floor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Floor</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="room_type_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Type</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number.parseInt(value))}
                    defaultValue={field.value?.toString()}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a room type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roomTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_available"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Available</FormLabel>
                    <FormDescription>Is this room currently available for booking?</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
