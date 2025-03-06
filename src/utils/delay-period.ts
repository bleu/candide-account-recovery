import { SrmAddress } from "@/hooks/use-social-recovery-module";
import { SocialRecoveryModuleGracePeriodSelector } from "abstractionkit";

export const delayPeriodMap: Record<string, SrmAddress> = {
  [1]: SocialRecoveryModuleGracePeriodSelector.After3Minutes,
  [3]: SocialRecoveryModuleGracePeriodSelector.After3Days,
  [7]: SocialRecoveryModuleGracePeriodSelector.After7Days,
  [14]: SocialRecoveryModuleGracePeriodSelector.After14Days,
};
