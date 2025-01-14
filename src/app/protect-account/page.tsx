"use client";
import { Guardian } from "@/components/guardian-list";
import { ProgressModal } from "@/components/progress-modal";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { STYLES } from "@/constants/styles";
import { cn } from "@/lib/utils";
import { ExternalLink, Info, X } from "lucide-react";

import { useState } from "react";

interface NewGuardian {
  nickname: string;
  address: string;
}

const isWalletConnected = true;
const totalSteps = 4;
const inputClassName = "bg-background text-sm border-none focus:ring-primary";

export default function ProtectAccount() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isOpen, setIsOpen] = useState(true);

  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [newGuardian, setNewGuardian] = useState<NewGuardian>({
    nickname: "",
    address: "",
  });

  const handleAddGuardian = (): void => {
    if (newGuardian.nickname && newGuardian.address) {
      setGuardians([...guardians, { ...newGuardian, status: "added" }]);
      // Clear the input fields and create a new empty line
      setNewGuardian({ nickname: "", address: "" });
    }
  };

  const handleRemoveGuardian = (index: number): void => {
    setGuardians(guardians.filter((_, i) => i !== index));
  };

  const handleExternalLink = (address: string): void => {
    window.open(`https://etherscan.io/address/${address}`);
  };

  const handleUpdateNewGuardian = (
    field: keyof NewGuardian,
    value: string
  ): void => {
    setNewGuardian((prev) => ({ ...prev, [field]: value }));
  };

  const isAddButtonEnabled: boolean = Boolean(
    newGuardian.nickname && newGuardian.address
  );

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Handle form submission
      setIsOpen(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value < 1) {
      e.target.value = "1";
    } else if (value > guardians.length) {
      e.target.value = guardians.length.toString();
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <GuardiansStep
              guardians={guardians}
              isAddButtonEnabled={isAddButtonEnabled}
              newGuardian={newGuardian}
              onAddGuardian={handleAddGuardian}
              onExternalLink={handleExternalLink}
              onRemoveGuardian={handleRemoveGuardian}
              onUpdateNewGuardian={handleUpdateNewGuardian}
            />
          </div>
        );
      case 2:
        return (
          <>
            <Input
              type="number"
              min={1}
              max={guardians.length}
              defaultValue={1}
              className="w-40 border-none text-base focus:ring-primary"
              onChange={handleThresholdChange}
            />
            <p className="text-xs font-roboto-mono font-medium opacity-60 mt-2">
              {guardians.length} guardians added. Choose a threshold between 1
              and {guardians.length}.
            </p>
          </>
        );
      case 3:
        return <ThresholdStep />;
      case 4:
        return (
          <div className="space-y-5">
            <ReviewStep />
          </div>
        );
      default:
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Add Guardians";
      case 2:
        return "Set the Approval Threshold";
      case 3:
        return "Set the Recovery Delay Period";
      case 4:
        return "Review Account Recovery Setup";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Guardians are trusted contacts that will help recover your account. You can add multiple guardians.";
      case 2:
        return "Threshold determines the minimum number of guardian approvals required to recover your account.";
      case 3:
        return "Set the time period during which you can cancel a initiated recovery request. We recommend a period of at least 3 days.";
      default:
        return "";
    }
  };

  function ReviewStep() {
    return (
      <>
        <div>
          <span className="text-lg font-bold font-roboto-mono opacity-60">
            Guardians
          </span>
          <div className="mt-3">
            <GuardiansStep
              guardians={guardians}
              onAddGuardian={handleAddGuardian}
              onRemoveGuardian={handleRemoveGuardian}
              onExternalLink={handleExternalLink}
              newGuardian={newGuardian}
              onUpdateNewGuardian={handleUpdateNewGuardian}
              isAddButtonEnabled={isAddButtonEnabled}
              isReview={true}
            />
          </div>
        </div>
        <div className="border-t pt-5" style={STYLES.textWithBorderOpacity}>
          <span className="text-lg font-bold font-roboto-mono opacity-60 ">
            Threshold
          </span>
          <p className="text-base font-roboto-mono text-content-foreground mt-3">
            Minimum 2 Guardians approval to recovery.
          </p>
        </div>
        <div className="border-t pt-5" style={STYLES.textWithBorderOpacity}>
          <span className="text-lg font-bold font-roboto-mono opacity-60 ">
            Delay Period
          </span>
          <p className="text-base font-roboto-mono text-content-foreground mt-3">
            3-day period to cancel a recovery request.
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center mx-8">
      {isWalletConnected ? (
        <ProgressModal
          isOpen={true}
          onClose={() => setIsOpen(false)}
          title={getStepTitle()}
          description={getStepDescription()}
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={handleNext}
          onBack={handleBack}
        >
          {getStepContent()}
        </ProgressModal>
      ) : (
        <WalletNotConnected />
      )}
    </div>
  );
}

function WalletNotConnected() {
  return (
    <div className="max-w-2xl text-center">
      <h2 className="text-2xl text-primary font-bold font-roboto-mono text-center ">
        Connect the Account you want to protect.{" "}
      </h2>
      <p className="text-lg font-roboto-mono text-center text-foreground mb-6 mt-4">
        The recovery module helps you regain control of your account if your key
        is lost or compromised by relying on trusted guardians you add to your
        account.
      </p>
      <Button className="text-lg font-bold  px-4 py-2 rounded-xl">
        Connect wallet
      </Button>
    </div>
  );
}

function GuardiansStep({
  guardians,
  onAddGuardian,
  onRemoveGuardian,
  onExternalLink,
  newGuardian,
  onUpdateNewGuardian,
  isAddButtonEnabled,
  isReview = false,
}: {
  guardians: Guardian[];
  onAddGuardian: () => void;
  onRemoveGuardian: (index: number) => void;
  onExternalLink: (address: string) => void;
  newGuardian: NewGuardian;
  onUpdateNewGuardian: (field: keyof NewGuardian, value: string) => void;
  isAddButtonEnabled: boolean;
  isReview?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[1fr,2fr]">
        <div className="flex items-center">
          <label className="text-sm font-bold font-roboto-mono opacity-50">
            NICKNAME
          </label>
          {!isReview && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger tabIndex={-1} className="p-2">
                  <Info size={14} className="opacity-50" />
                </TooltipTrigger>
                <TooltipContent className="px-4 py-2 max-w-56 bg-background text-xs">
                  Nicknames are saved locally in your browser. This information
                  is private and not shared with any server.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <label className="text-sm font-bold opacity-50 font-roboto-mono ml-2">
          ADDRESS
        </label>
      </div>
      {guardians.map((guardian, index) => (
        <div key={index} className="grid grid-cols-[1fr,2fr] gap-2">
          <Input
            readOnly
            value={guardian.nickname}
            className={inputClassName}
          />
          <div className="flex gap-2">
            <Input
              readOnly
              value={guardian.address}
              className={cn(inputClassName, "flex-1")}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onExternalLink(guardian.address)}
              type="button"
            >
              <ExternalLink size={16} className="opacity-50" />
            </Button>
            {!isReview && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onRemoveGuardian(index)}
                type="button"
              >
                <X size={16} className="opacity-50" />
              </Button>
            )}
          </div>
        </div>
      ))}
      {!isReview && (
        <div className="grid grid-cols-[1fr,2fr] gap-2">
          <Input
            placeholder="Nickname..."
            value={newGuardian.nickname}
            onChange={(e) => onUpdateNewGuardian("nickname", e.target.value)}
            className={inputClassName}
          />
          <div className="flex gap-2">
            <Input
              placeholder="Address..."
              value={newGuardian.address}
              onChange={(e) => onUpdateNewGuardian("address", e.target.value)}
              className={cn(inputClassName, "flex-1")}
            />
            <Button
              variant="ghost"
              className="hover:bg-background text-sm"
              disabled={!isAddButtonEnabled}
              onClick={onAddGuardian}
              type="button"
            >
              Add +
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ThresholdStep() {
  return (
    <Select>
      <SelectTrigger className="w-40 border-none focus:ring-primary text-foreground">
        <SelectValue
          className="bg-red-500"
          placeholder="3 days"
          defaultValue="3"
        />
      </SelectTrigger>
      <SelectContent className="bg-background border-none">
        <SelectGroup>
          <SelectItem className="hover:bg-content-background" value="3">
            3 days
          </SelectItem>
          <SelectItem className="hover:bg-content-background" value="7">
            7 days
          </SelectItem>
          <SelectItem className="hover:bg-content-background" value="14">
            14 days
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
