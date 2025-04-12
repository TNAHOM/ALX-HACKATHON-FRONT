import Auth from "@/components/auth";
import { ChecklistDashboard } from "@/components/checklist-dashboard";
import { checklistData } from "@/lib/data";

export default function InspectionPage() {
  return (
    <Auth>
      <ChecklistDashboard
        checklistCategories={checklistData.checklistCategories}
      />
    </Auth>
  );
}
