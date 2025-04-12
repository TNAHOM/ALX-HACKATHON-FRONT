"use client"

import { useState } from "react"
import { format } from "date-fns"
import { AlertCircle, CheckCircle, Clock, MoreHorizontal, PlayCircle, XCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Issue, IssueStatus } from "@/lib/types"
import { getIssuesByItemId, updateIssueStatus } from "@/lib/issues"


interface IssueHistoryProps {
  itemId: number
}

export function IssueHistory({ itemId }: IssueHistoryProps) {
  const [issues, setIssues] = useState<Issue[]>(getIssuesByItemId(itemId))
  const [activeTab, setActiveTab] = useState<string>("all")
  const [statusAlert, setStatusAlert] = useState<{
    message: string
  } | null>(null)

  const filteredIssues =
    activeTab === "all"
      ? issues
      : issues.filter((issue) => {
          if (activeTab === "open") return issue.status === "open"
          if (activeTab === "in-progress") return issue.status === "in-progress"
          if (activeTab === "resolved") return issue.status === "resolved" || issue.status === "closed"
          return true
        })

  const handleStatusChange = (issueId: string, newStatus: IssueStatus) => {
    const updatedIssue = updateIssueStatus(issueId, newStatus)
    if (updatedIssue) {
      setIssues(getIssuesByItemId(itemId))
      setStatusAlert({
        message: `Issue status changed to ${newStatus}`,
      })

      // Clear alert after 3 seconds
      setTimeout(() => {
        setStatusAlert(null)
      }, 3000)
    }
  }

  const getSeverityBadge = (severity: Issue["severity"]) => {
    switch (severity) {
      case "low":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Low
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Medium
          </Badge>
        )
      case "high":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            High
          </Badge>
        )
      case "critical":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Critical
          </Badge>
        )
    }
  }

  const getStatusBadge = (status: Issue["status"]) => {
    switch (status) {
      case "open":
        return (
          <div className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3 text-red-500" />
            <span>Open</span>
          </div>
        )
      case "in-progress":
        return (
          <div className="flex items-center gap-1">
            <PlayCircle className="h-3 w-3 text-blue-500" />
            <span>In Progress</span>
          </div>
        )
      case "resolved":
        return (
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>Resolved</span>
          </div>
        )
      case "closed":
        return (
          <div className="flex items-center gap-1">
            <XCircle className="h-3 w-3 text-gray-500" />
            <span>Closed</span>
          </div>
        )
    }
  }

  const getStatusActions = (issue: Issue) => {
    const actions: { label: string; status: IssueStatus; disabled: boolean }[] = [
      { label: "Mark as Open", status: "open", disabled: issue.status === "open" },
      { label: "Mark as In Progress", status: "in-progress", disabled: issue.status === "in-progress" },
      { label: "Mark as Resolved", status: "resolved", disabled: issue.status === "resolved" },
      { label: "Close Issue", status: "closed", disabled: issue.status === "closed" },
    ]

    return actions
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Issue History</span>
          <Badge variant="outline">{issues.length}</Badge>
        </CardTitle>
        <CardDescription>Track and manage issues for this checklist item</CardDescription>
      </CardHeader>
      <CardContent>
        {statusAlert && (
          <Alert className="mb-4 bg-blue-50 text-blue-800 border-blue-200">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{statusAlert.message}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            {filteredIssues.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-gray-100 p-3 mb-3">
                  <Clock className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium">No issues found</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {activeTab === "all"
                    ? "No issues have been reported for this item yet."
                    : `No ${activeTab} issues found for this item.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredIssues.map((issue) => (
                  <div key={issue.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{issue.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <span>Reported by {issue.reportedBy}</span>
                          <span>•</span>
                          <span>{format(new Date(issue.createdAt), "MMM d, yyyy")}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(issue.severity)}
                        <Badge variant="outline" className="font-normal">
                          {getStatusBadge(issue.status)}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {getStatusActions(issue).map((action) => (
                              <DropdownMenuItem
                                key={action.status}
                                disabled={action.disabled}
                                onClick={() => handleStatusChange(issue.id, action.status)}
                              >
                                {action.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    {issue.description && <p className="text-sm mt-2">{issue.description}</p>}
                    {issue.assignedTo && (
                      <div className="mt-3 text-sm">
                        <span className="text-gray-500">Assigned to:</span> {issue.assignedTo}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
