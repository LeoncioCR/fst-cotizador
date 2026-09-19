import { revalidatePath } from "next/cache";

import { NextResponse, type NextRequest } from "next/server";

import { makeAuthProvider } from "@/modules/auth";

export async function POST(request: NextRequest) {
  const auth = makeAuthProvider();

  await auth.signOut();

  revalidatePath("/", "layout");

  return NextResponse.redirect(
    new URL("/login", request.url),

    {
      status: 303,
    },
  );
}
