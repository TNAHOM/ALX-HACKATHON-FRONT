import type { Issue, IssueStatus } from "./types"

// Mock data for issues
const mockIssues: Issue[] = [
  {
    id: "issue-1",
    itemId: 1001,
    title: "Front desk counter has visible scratches",
    description: "Multiple scratches on the front desk counter need to be repaired or the counter needs replacement.",
    severity: "medium",
    status: "open",
    reportedBy: "John Smith",
    createdAt: "2025-04-10T09:30:00Z",
    updatedAt: "2025-04-10T09:30:00Z",
  },
  {
    id: "issue-2",
    itemId: 1001,
    title: "Clutter behind reception desk",
    description: "Papers and office supplies visible to guests. Need better organization system.",
    severity: "low",
    status: "resolved",
    reportedBy: "Maria Johnson",
    assignedTo: "Front Desk Manager",
    createdAt: "2025-04-08T14:15:00Z",
    updatedAt: "2025-04-09T11:20:00Z",
    resolvedAt: "2025-04-09T11:20:00Z",
  },
  {
    id: "issue-3",
    itemId: 1002,
    title: "Lobby floor needs polishing",
    description: "Marble floor in the main lobby has lost its shine and has several scuff marks.",
    severity: "medium",
    status: "in-progress",
    reportedBy: "Alex Williams",
    assignedTo: "Maintenance Team",
    createdAt: "2025-04-11T10:45:00Z",
    updatedAt: "2025-04-11T16:30:00Z",
  },
  {
    id: "issue-4",
    itemId: 1019,
    title: "Bathroom sink leaking",
    description: "Slow leak under the sink in room 302. Needs immediate attention to prevent water damage.",
    severity: "high",
    status: "in-progress",
    reportedBy: "Housekeeping Staff",
    assignedTo: "Plumbing Team",
    createdAt: "2025-04-12T08:20:00Z",
    updatedAt: "2025-04-12T09:15:00Z",
  },
  {
    id: "issue-5",
    itemId: 1043,
    title: "Fire extinguisher missing inspection tag",
    description: "Fire extinguisher on 4th floor is missing its latest inspection tag. Needs immediate verification.",
    severity: "critical",
    status: "open",
    reportedBy: "Safety Officer",
    createdAt: "2025-04-12T11:05:00Z",
    updatedAt: "2025-04-12T11:05:00Z",
  },
]

// In-memory store for issues (in a real app, this would be a database)
let issues = [...mockIssues]

// Get all issues
export function getAllIssues(): Issue[] {
  return [...issues].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Get issues for a specific item
export function getIssuesByItemId(itemId: number): Issue[] {
  return [...issues]
    .filter((issue) => issue.itemId === itemId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Add a new issue
export function addIssue(issue: Omit<Issue, "id" | "createdAt" | "updatedAt">): Issue {
  const now = new Date().toISOString()
  const newIssue: Issue = {
    id: `issue-${issues.length + 1}`,
    ...issue,
    createdAt: now,
    updatedAt: now,
  }

  issues = [newIssue, ...issues]
  return newIssue
}

// Update an issue
export function updateIssueStatus(issueId: string, status: IssueStatus): Issue | null {
  const issueIndex = issues.findIndex((issue) => issue.id === issueId)
  if (issueIndex === -1) return null

  const now = new Date().toISOString()
  const updatedIssue = {
    ...issues[issueIndex],
    status,
    updatedAt: now,
    ...(status === "resolved" ? { resolvedAt: now } : {}),
  }

  issues[issueIndex] = updatedIssue
  return updatedIssue
}
