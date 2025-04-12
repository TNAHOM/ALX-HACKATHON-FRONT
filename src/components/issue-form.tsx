"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define types
type Severity = "low" | "medium" | "high" | "critical"
type Status = "open" | "in-progress" | "resolved" | "closed"

interface IssueFormData {
  title: string
  description: string
  reported_by: string
  assigned_to: string
  severity: Severity
  status: Status
}

interface IssueFormProps {
  itemId: number
  itemDescription: string
  onSuccess?: () => void
}

// Mock function to submit the issue
const submitIssue = async (data: IssueFormData & { itemId: number }): Promise<{ success: boolean }> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true })
    }, 1000)
  })
}

export function IssueForm({ itemId, itemDescription, onSuccess }: IssueFormProps) {
  const router = useRouter()
  const [formAlert, setFormAlert] = useState<{
    type: "success" | "error"
    title: string
    message: string
  } | null>(null)

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<IssueFormData>({
    defaultValues: {
      title: "",
      description: "",
      reported_by: "",
      assigned_to: "",
      severity: "medium",
      status: "open",
    },
  })

  // React Query mutation
  const mutation = useMutation({
    mutationFn: (formData: IssueFormData) => {
      return submitIssue({ ...formData, itemId })
    },
    onSuccess: () => {
      setFormAlert({
        type: "success",
        title: "Issue reported successfully",
        message: "Your issue has been submitted and is now being tracked.",
      })

      reset()
      router.refresh()

      // Call onSuccess callback if provided
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        }
      }, 1500)
    },
    onError: () => {
      setFormAlert({
        type: "error",
        title: "Error",
        message: "There was a problem submitting your issue. Please try again.",
      })
    },
  })

  // Form submission handler
  const onSubmit = (data: IssueFormData) => {
    setFormAlert(null)
    mutation.mutate(data)
  }

  // Watch the current severity value
  const currentSeverity = watch("severity")

  return (
    <Card>
      <CardContent className="pt-6">
        {formAlert && (
          <Alert
            variant={formAlert.type === "error" ? "destructive" : "default"}
            className={`mb-6 ${formAlert.type === "success" ? "bg-green-50 text-green-800 border-green-200" : ""}`}
          >
            {formAlert.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>{formAlert.title}</AlertTitle>
            <AlertDescription>{formAlert.message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Issue Title</Label>
              <Input
                id="title"
                placeholder="Brief description of the issue"
                {...register("title", { required: "Issue title is required" })}
                aria-invalid={errors.title ? "true" : "false"}
              />
              {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                placeholder="Provide details about the issue, including location and specific concerns"
                rows={4}
                {...register("description")}
              />
            </div>

            <div className="space-y-2">
              <Label>Severity</Label>
              <RadioGroup
                value={currentSeverity}
                onValueChange={(value: Severity) => setValue("severity", value)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="severity-low" />
                  <Label htmlFor="severity-low" className="font-normal cursor-pointer">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Low
                    </span>{" "}
                    - Minor issue, can be addressed during regular maintenance
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="severity-medium" />
                  <Label htmlFor="severity-medium" className="font-normal cursor-pointer">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Medium
                    </span>{" "}
                    - Needs attention soon but not an emergency
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="severity-high" />
                  <Label htmlFor="severity-high" className="font-normal cursor-pointer">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      High
                    </span>{" "}
                    - Significant issue requiring prompt attention
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="critical" id="severity-critical" />
                  <Label htmlFor="severity-critical" className="font-normal cursor-pointer">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Critical
                    </span>{" "}
                    - Urgent issue that poses safety or operational risks
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reported_by">Reported By</Label>
              <Input
                id="reported_by"
                placeholder="Your name"
                {...register("reported_by", { required: "Reporter name is required" })}
                aria-invalid={errors.reported_by ? "true" : "false"}
              />
              {errors.reported_by && <p className="text-sm text-red-500 mt-1">{errors.reported_by.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="assigned_to">Assigned To</Label>
              <Input id="assigned_to" placeholder="Person responsible for this issue" {...register("assigned_to")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={watch("status")} onValueChange={(value: Status) => setValue("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Submitting..." : "Submit Issue Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
