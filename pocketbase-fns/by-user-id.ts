import { pb } from "@/lib/pocketbase";

export async function upsertByUserId(
  collection: string,
  userId: string,
  data: Record<string, any>
) {
  const record = await pb
    .collection(collection)
    .getFirstListItem(`user_id="${userId}"`)
    .catch(() => null);

  if (record) {
    return pb.collection(collection).update(record.id, data);
  }

  return pb.collection(collection).create({ ...data, user_id: userId });
}

export async function getByUserId(collection: string, userId: string) {
  return pb.collection(collection).getFirstListItem(`user_id="${userId}"`);
}

// export async function getByUserIdWithOptions(collection: string, userId: string, options: any) {
//   return pb.collection(collection).getFirstListItem(`user_id="${userId}"`, options);
// }

export async function toggleRecord(
  collectionName: string,
  fieldName: string,
  fieldValue: string
) {
  const filter = `${fieldName}="${fieldValue}"`;
  try {
    const record = await pb.collection(collectionName).getFirstListItem(filter);
    await pb.collection(collectionName).delete(record.id);
  } catch {
    await pb.collection(collectionName).create({ [fieldName]: fieldValue });
  }
}

export async function getByUserAndResourceId(customId: string) {
  return pb
    .collection("resource_links")
    .getFirstListItem(`user_resource_id="${customId}"`);
}

export async function getIssueList() {
  return pb.collection("issue_list").getFullList();
}

export async function getFilteredIssues(
  sectionId: string,
  categoryId: string,
  itemId: string
) {
  const filter = pb.filter(
    "sectionId = {:sectionId} && categoryId = {:categoryId} && itemId = {:itemId}",
    { sectionId, categoryId, itemId }
  );

  return await pb.collection("issue_list").getFullList({ filter });
}

export async function getIssueListByStatus(status: string) {
  return pb.collection("issue_list").getFullList(200, {
    filter: `status = "${status}"`,
  });
}

export async function getIssueListDynamic(status = "") {
  if (status) {
    return await getIssueList();
  }
  return getIssueListByStatus(status);
}

export async function createIssue(issueData: any) {
  const newIssue = await pb.collection("issue_list").create(issueData);
  console.log("Issue created successfully:", newIssue);
  return newIssue;
}

export async function updateIssueById(issueId: string, updateData: any) {
  const updatedIssue = await pb
    .collection("issue_list")
    .update(issueId, updateData);
  console.log("Issue updated successfully:", updatedIssue);
  return updatedIssue;
}

export async function changeIssueStatus(issueId: string, newStatus: string) {
  const updatedIssue = await pb
    .collection("issue_list")
    .update(issueId, { status: newStatus });
  console.log("Issue status updated:", updatedIssue);
  return updatedIssue;
}
