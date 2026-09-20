import { z } from "zod";

export const assignRolePermissionsSchema = z.object({
  roleId: z.string().uuid(),

  permissionIds: z.array(z.string().uuid()),
});
