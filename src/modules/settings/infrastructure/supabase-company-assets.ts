import { createSupabaseAdminClient } from "@/infrastructure/supabase/admin-client";

import type { CompanyAssetsPort } from "../application/ports/company-assets.port";

const BUCKET = "company-assets";

export class SupabaseCompanyAssets implements CompanyAssetsPort {
  async uploadLogo(file: File): Promise<string> {
    const supabase = createSupabaseAdminClient();

    const bytes = Buffer.from(await file.arrayBuffer());

    const path = "company/logo";

    const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, {
      contentType: file.type,

      upsert: true,
    });

    if (error) {
      throw new Error("No fue posible subir el logo.");
    }

    return path;
  }

  async getLogoUrl(path: string): Promise<string> {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, 3600);

    if (error || !data.signedUrl) {
      throw new Error("No fue posible obtener el logo.");
    }

    return data.signedUrl;
  }
}
