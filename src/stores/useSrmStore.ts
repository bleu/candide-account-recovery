import { create } from "zustand";
import { SocialRecoveryModule } from "abstractionkit";

interface SrmStore {
  srm: SocialRecoveryModule;
}

export const useSrmStore = create<SrmStore>(() => ({
  srm: new SocialRecoveryModule(),
}));
