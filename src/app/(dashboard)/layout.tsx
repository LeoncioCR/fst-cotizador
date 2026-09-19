import type { ReactNode } from "react";

import { redirect } from "next/navigation";

import { makeGetCurrentUserUseCase } from "@/modules/auth";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const result = await makeGetCurrentUserUseCase().execute();

  if (!result.success) {
    if (result.error.code === "ACCOUNT_INACTIVE") {
      redirect("/account-disabled");
    }

    redirect("/login");
  }

  return <div className="min-h-screen bg-slate-50">{children}</div>;
}
