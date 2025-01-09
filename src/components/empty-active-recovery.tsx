import { Button } from "@bleu.builders/ui";

export default function EmptyActiveRecovery() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 text-center my-12 max-w-72 mx-auto">
      <p className="text-sm font-roboto-mono text-center opacity-60">
        There are no active recovery requests for this account.
      </p>
      <Button className="text-xs font-roboto-mono font-bold hover:bg-terciary hover:text-primary py-1 px-2">
        Ask for Recovery
      </Button>
    </div>
  );
}
