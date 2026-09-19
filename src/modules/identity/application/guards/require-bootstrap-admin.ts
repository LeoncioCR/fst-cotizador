import { makeGetCurrentUserUseCase } from "@/modules/auth";

export async function requireBootstrapAdmin() {
  const result = await makeGetCurrentUserUseCase().execute();

  if (!result.success) {
    throw new Error("AUTH_REQUIRED");
  }

  const adminId = process.env.BOOTSTRAP_ADMIN_USER_ID;

  if (!adminId || result.data.id !== adminId) {
    throw new Error("FORBIDDEN");
  }

  return result.data;
}
