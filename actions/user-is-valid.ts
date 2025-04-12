"use server";

import { cookies } from "next/headers";

import PocketBase from "pocketbase";

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL as string);

export async function getByUserId(collection: string, userId: string) {
  return await pb
    .collection(collection)
    .getFirstListItem(`user_id="${userId}"`);
}

export async function setPocketCookie(token: string) {
  (await cookies()).set("pb_auth", token);
}

export async function setUserType(userType: string) {
  (await cookies()).set("role", userType);
}
