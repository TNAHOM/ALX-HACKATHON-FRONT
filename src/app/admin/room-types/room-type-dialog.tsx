"use client"

import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

// Type definitions
interface RoomType {
  id: number
  name: string
  description: string
  price_per_night: number
}

const roomTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price_per_night: z.coerce.number().min(0, "Price must be 0 or higher"),
})

type RoomTypeFormValues = z.infer<typeof roomTypeSchema>

interface RoomTypeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roomType: RoomType | null
  onSave: (data: RoomTypeFormValues) => void
  isSubmitting: boolean
}

export function RoomTypeDialog({ open, onOpenChange, roomType, onSave, isSubmitting }: RoomTypeDialogProps) {
  const form = useForm<RoomTypeFormValues>({
    resolver: zodResolver(roomTypeSchema),
    defaultValues: {
      name: "",
      description: "",
      price_per_night: 0,
    },
  })

  // Reset form when roomType changes
  useEffect(() => {
    if (open) {
      if (roomType) {
        form.reset({
          name: roomType.name,
          description: roomType.description,
          price_per_night: roomType.price_per_night,
        })
      } else {
        form.reset({
          name: "",
          description: "",
          price_per_night: 0,
        })
      }
    }
  }, [roomType, form, open])

  const onSubmit = (data: RoomTypeFormValues) => {
    onSave(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{roomType ? "Edit Room Type" : "Add New Room Type"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Standard" {...field} />
                  </FormControl>
                  <FormDescription>The name of the room type</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Basic room with essential amenities" {...field} />
                  </FormControl>
                  <FormDescription>A brief description of the room type</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price_per_night"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Per Night</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>Base price per night in USD</FormDescription>
                  <FormMessage />
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
