export interface CompanyAssetsPort {
  uploadLogo(file: File): Promise<string>;

  getLogoUrl(   path: string): Promise<string>;
}
