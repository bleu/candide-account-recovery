import { TextSearch } from "lucide-react";

export default function SearchNotFound() {
  return (
    <>
      <TextSearch size={100} className="text-foreground opacity-30" />
      <h2 className="text-sm text-primary font-bold font-roboto-mono text-center my-3">
        Sorry, we couldn't find this address.
      </h2>
      <p className="text-xs font-roboto-mono text-center text-foreground max-w-md opacity-60">
        Please double-check the address or try searching for a different one.
      </p>
    </>
  );
}
