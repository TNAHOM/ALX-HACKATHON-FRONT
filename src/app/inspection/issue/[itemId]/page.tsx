"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { ArrowLeft, ClipboardList, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { checklistData } from "@/lib/data";
import { IssueHistory } from "@/components/issue-history";
import { IssueForm } from "@/components/issue-form";
import { useQuery } from "@tanstack/react-query";
import { getFilteredIssues } from "../../../../../pocketbase-fns/by-user-id";

// Helper function to find an item by ID
function findItemById(itemId: number) {
  for (const category of checklistData.checklistCategories) {
    for (const section of category.sections) {
      const item = section.items.find((item) => item.itemId === itemId);
      if (item) {
        return { item, section, category };
      }
    }
  }
  return null;
}

export default function IssuePage() {
  const { itemId } = useParams(); // retrieve params from the hook
  const parsedItemId = Number.parseInt(
    Array.isArray(itemId) ? itemId[0] : itemId || ""
  );
  const [activeTab, setActiveTab] = useState<string>("history");

  const itemData = findItemById(parsedItemId);

  if (!itemData) {
    notFound();
  }

  const { item, section, category } = itemData;

  const categoryId = category.categoryId;
  const sectionId = section.sectionId;
  const myItemId= item.itemId;


  const { data: filteredIssues } = useQuery({
    queryKey: ["issues", categoryId, sectionId, myItemId],
    queryFn: () => getFilteredIssues(`${categoryId}`, `${sectionId}`, `${myItemId}`),
  });

  if(filteredIssues){
    console.log(filteredIssues, 'filtered issues');
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href="/inspection">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <span>{category.categoryName}</span>
                  <span>›</span>
                  <span>{section.sectionName}</span>
                </div>
                <CardTitle className="text-2xl">
                  Issue #{parsedItemId}
                </CardTitle>
                <CardDescription>
                  Report and track issues for this checklist item
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-md bg-gray-50 mb-6">
                  <div className="flex items-start gap-3">
                    <ClipboardList className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Checklist Item</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="history">Issue History</TabsTrigger>
                    <TabsTrigger value="report">Report New Issue</TabsTrigger>
                  </TabsList>
                  <TabsContent value="history" className="mt-6">
                    <IssueHistory itemId={parsedItemId} />
                  </TabsContent>
                  <TabsContent value="report" className="mt-6">
                    <IssueForm
                      itemId={parsedItemId}
                      itemDescription={item.description}
                      onSuccess={() => setActiveTab("history")}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Item Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Item ID
                    </h3>
                    <p>{item.itemId}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Category
                    </h3>
                    <p>{category.categoryName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Section
                    </h3>
                    <p>{section.sectionName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Last Updated
                    </h3>
                    <p>{new Date(category.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setActiveTab("report")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Report New Issue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
