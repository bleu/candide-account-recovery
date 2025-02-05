import { NewAddress } from "../guardian-list";
import NewAddressList from "../new-address-list";

interface NewOwnersProps {
  newOwners: NewAddress[];
  onAdd: (guardian: NewAddress) => void;
  onRemove: (index: number) => void;
  onExternalLink: (address: string) => void;
  validationFn: (address: string) => { isValid: boolean; reason: string };
}

export default function Recovery({
  newOwners,
  onAdd,
  onRemove,
  onExternalLink,
  validationFn,
}: NewOwnersProps) {
  return (
    <NewAddressList
      addresses={newOwners}
      onAdd={onAdd}
      onRemove={onRemove}
      onExternalLink={onExternalLink}
      validationFn={validationFn}
    />
  );
}
