import { Guardian } from "../guardian-list";
import NewGuardianList from "../new-guardians-list";

interface NewOwnersProps {
  guardians: Guardian[];
  onAdd: (guardian: Guardian) => void;
  onRemove: (index: number) => void;
  onExternalLink: (address: string) => void;
}

export default function Recovery({
  guardians,
  onAdd,
  onRemove,
  onExternalLink,
}: NewOwnersProps) {
  return (
    <NewGuardianList
      guardians={guardians}
      onAdd={onAdd}
      onRemove={onRemove}
      validationFn={(address: string) => ({ isValid: true, reason: address })}
      onExternalLink={onExternalLink}
    />
  );
}
