export type AccountStatus = "active" | "inactive";

export interface AccountAccessPort {
  getStatus(userId: string): Promise<AccountStatus | null>;
}
