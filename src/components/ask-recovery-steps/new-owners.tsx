import { NewAddress } from "../guardian-list";
import NewAddressList from "../new-guardians-list";

interface NewOwnersProps {
  newOwners: NewAddress[];
  onAdd: (guardian: NewAddress) => void;
  onRemove: (index: number) => void;
  onExternalLink: (address: string) => void;
}

export default function Recovery({
  newOwners,
  onAdd,
  onRemove,
  onExternalLink,
}: NewOwnersProps) {
  return (
    <NewAddressList
      addresses={newOwners}
      onAdd={onAdd}
      onRemove={onRemove}
      validationFn={(address: string) => ({ isValid: true, reason: address })}
      onExternalLink={onExternalLink}
    />
  );
}
