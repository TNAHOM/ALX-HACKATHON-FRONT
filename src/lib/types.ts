export interface ChecklistItem {
  itemId: number
  description: string
}

export interface ChecklistSection {
  sectionId: number
  sectionName: string
  items: ChecklistItem[]
}

export interface ChecklistCategory {
  categoryId: number
  categoryName: string
  sections: ChecklistSection[]
  createdAt: string
  updatedAt: string
}

// Issue types
export type IssueSeverity = "low" | "medium" | "high" | "critical"
export type IssueStatus = "open" | "in-progress" | "resolved" | "closed"

export interface Issue {
  id: string
  categoryId: string,
  sectionId: string,
  itemId: number
  title: string
  description: string
  severity: IssueSeverity
  status: IssueStatus
  reportedBy: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
}




