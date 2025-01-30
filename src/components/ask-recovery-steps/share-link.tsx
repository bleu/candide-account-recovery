import { STYLES } from "@/constants/styles";
import { NewAddress } from "../guardian-list";
import AddressSection from "@/components/address-section";

interface NewOwnersProps {
  newOwners: NewAddress[];
  threshold: number;
  safeAddress: string;
  onAdd: (guardian: NewAddress) => void;
  onRemove: (index: number) => void;
  onExternalLink: (address: string) => void;
}

export default function ShareLink({
  newOwners,
  threshold,
  safeAddress,
}: NewOwnersProps) {
  return (
    <div className="space-y-5">
      {/* Citation section (lateral bar) */}
      <div className="flex flex-row justify-start">
        <div className="w-2 min-h-max border-l-2 border-solid border-white opacity-20"></div>
        <div>
          {/* Safe Address */}
          <AddressSection
            title="Target Safe Account"
            description="The address of the account that need to be recovered."
            addresses={[safeAddress]}
          />
          {/* New Owners */}
          <AddressSection
            title="Safe Account New Signers"
            description="The public address of the new Safe signers."
            addresses={newOwners.map((owner) => owner.address)}
          />

          {/* New threshold */}
          <div className="space-y-3">
            <p className={STYLES.modalSectionTitle}>
              Safe Account New Threshold
            </p>
            <p className={STYLES.modalSectionDescription}>
              Minimum {threshold} signers to approve transactions
            </p>
          </div>
        </div>
      </div>

      {/* Link */}
      <div className="pt-3">
        <p className="mb-3 text-lg font-bold font-roboto-mono text-alert">
          Save Recovery Access Link
        </p>
        <p className="text-sm font-bold font-roboto-mono">
          This unique link is the only way to access and manage this specific
          recovery process. Copy and store it securely.
        </p>
        <p className="text-sm font-roboto-mono opacity-60">
          - Each recovery process has its own unique link{" "}
        </p>
        <p className="text-sm font-roboto-mono opacity-60">
          - Share with guardians to track recovery progress{" "}
        </p>
        <p className="text-sm mb-3 font-roboto-mono opacity-60">
          - Save a backup –{" "}
          <span className="italic">
            you{"'"}ll need to start over if this link is lost
          </span>
        </p>
      </div>
    </div>
  );
}
