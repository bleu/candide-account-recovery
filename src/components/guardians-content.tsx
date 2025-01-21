import { Guardian, GuardianList } from "./guardian-list";
import { Button } from "./ui/button";

interface GuardiansContentProps {
  guardians: Guardian[];
  onAddGuardian: () => void;
}

const buttonStyles = "rounded-xl font-roboto-mono h-7 font-bold text-xs";

export default function GuardiansContent({
  guardians,
  onAddGuardian,
}: GuardiansContentProps) {
  return (
    <div className="col-span-2">
      <div className="p-6 bg-content-background shadow-lg rounded-xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold font-roboto-mono text-primary ">
            Account Guardians
          </h3>
          {guardians.length > 0 && (
            <Button className={buttonStyles} onClick={onAddGuardian}>
              Add Guardian
            </Button>
          )}
        </div>
        {guardians.length > 0 ? (
          <GuardianList
            guardians={guardians}
            isNewGuardinList
            onRemoveGuardian={() => {
              console.log("remove guardian");
            }}
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-sm font-roboto-mono text-center text-content-foreground">
            <span className="opacity-60 font-bold">No Guardians added.</span>
            <p className="mt-1 mb-5 max-w-xs opacity-60">
              Start protecting your account by adding trusted guardians.
            </p>
            <Button className={buttonStyles} onClick={onAddGuardian}>
              Add Guardian
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
