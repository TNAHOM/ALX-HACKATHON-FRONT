"use client"

import { useState } from "react"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { AlertCircle, CheckCircle2, ClipboardList, Hotel } from "lucide-react"

interface ChecklistItem {
  itemId: number
  description: string
}

interface ChecklistSection {
  sectionId: number
  sectionName: string
  items: ChecklistItem[]
}

interface ChecklistCategory {
  categoryId: number
  categoryName: string
  sections: ChecklistSection[]
  createdAt: string
  updatedAt: string
}

interface ChecklistDashboardProps {
  checklistCategories: ChecklistCategory[]
}

export function ChecklistDashboard({ checklistCategories }: ChecklistDashboardProps) {
  const [activeCategory, setActiveCategory] = useState<string>(checklistCategories[0]?.categoryId.toString() || "1")

  // Count total items across all categories
  const totalItems = checklistCategories.reduce(
    (total, category) =>
      total + category.sections.reduce((sectionTotal, section) => sectionTotal + section.items.length, 0),
    0,
  )

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b">
          <div className="flex items-center gap-2 p-4">
            <Hotel className="h-6 w-6" />
            <h1 className="text-xl font-bold">Hotel Inspection</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {checklistCategories.map((category) => (
              <SidebarMenuItem key={category.categoryId}>
                <SidebarMenuButton
                  isActive={activeCategory === category.categoryId.toString()}
                  onClick={() => setActiveCategory(category.categoryId.toString())}
                >
                  <ClipboardList className="mr-2 h-4 w-4" />
                  <span>{category.categoryName}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total Categories</span>
              <Badge variant="outline">{checklistCategories.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total Items</span>
              <Badge variant="outline">{totalItems}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Last Updated</span>
              <Badge variant="outline">{new Date(checklistCategories[0]?.updatedAt).toLocaleDateString()}</Badge>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-xl font-bold">Hotel Inspection Checklist</h1>
        </header>

        <div className="p-6">
          {checklistCategories.map(
            (category) =>
              category.categoryId.toString() === activeCategory && (
                <div key={category.categoryId}>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{category.categoryName}</h2>
                    <p className="text-gray-500">Last updated: {new Date(category.updatedAt).toLocaleDateString()}</p>
                  </div>

                  <Card>
                    <CardContent className="pt-6">
                      <Accordion type="multiple" className="w-full">
                        {category.sections.map((section) => (
                          <AccordionItem key={section.sectionId} value={section.sectionId.toString()}>
                            <AccordionTrigger className="text-lg font-medium">
                              {section.sectionName}
                              <Badge className="ml-2" variant="outline">
                                {section.items.length}
                              </Badge>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-3 pt-2">
                                {section.items.map((item) => (
                                  <div
                                    key={item.itemId}
                                    className="p-3 border rounded-md flex items-start justify-between hover:bg-gray-50"
                                  >
                                    <div className="flex items-start gap-3">
                                      <CheckCircle2 className="h-5 w-5 text-gray-400 mt-0.5" />
                                      <span>{item.description}</span>
                                    </div>
                                    <Link href={`/inspection/issue/${item.itemId}`}>
                                      <Button size="sm" variant="outline">
                                        <AlertCircle className="h-4 w-4 mr-2" />
                                        Issue
                                      </Button>
                                    </Link>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </div>
              ),
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
