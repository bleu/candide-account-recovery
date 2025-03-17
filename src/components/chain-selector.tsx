import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import useHashParams from "@/hooks/useHashParams";
import { ChainIcon } from "connectkit";
import { useEffect } from "react";
import { useAccount, useChains } from "wagmi";

export const ChainSelector = ({
  chainId,
  setChainId,
}: {
  chainId: string;
  setChainId: (value: string) => void;
}) => {
  const chains = useChains();

  const { chainId: connectedChainId } = useAccount();
  const { chainId: linkChainId } = useHashParams();

  useEffect(() => {
    if (linkChainId) {
      console.log("a", linkChainId);
      setChainId(String(linkChainId));
      return;
    }
    if (connectedChainId) {
      console.log("b", connectedChainId);
      setChainId(String(connectedChainId));
    }
  }, [linkChainId, connectedChainId, setChainId]);

  return (
    <Select
      value={chainId}
      onValueChange={(value: string) => {
        if (value) setChainId(value);
      }}
    >
      <SelectTrigger className="w-fit h-fit border-0 rounded-lg border-solid p-1 bg-background text-foreground focus:ring-0 focus:outline-none hover:bg-terciary">
        <ChainIcon id={Number(chainId)} size={24} />
      </SelectTrigger>
      <SelectContent className="bg-background flex flex-col justify-start items-start p-0 m-0 rounded-lg border-terciary border-[1px] border-solid top-2">
        <SelectGroup className="items-start justify-start w-full rounded-lg">
          {chains.map((chain) => (
            <SelectItem
              key={chain.id}
              className="px-0 w-full justify-start items-start hover:bg-content-background hover:cursor-pointer"
              value={chain.id.toString()}
            >
              <div className="pl-1 pr-3 flex gap-2 items-start justify-start">
                <ChainIcon id={chain.id} size={24} />
                {chain.name}
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
