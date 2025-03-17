"use client";
import { STYLES } from "@/constants/styles";
import { getEtherscanAddressLink } from "@/utils/get-etherscan-link";
import { ExternalLinkIcon } from "lucide-react";
import React from "react";
import { useAccount } from "wagmi";
import Link from "next/link";

interface AddressSectionProps {
  title: string;
  description?: string;
  addresses: string[];
}

export default function AddressSection({
  title,
  description,
  addresses,
}: AddressSectionProps) {
  const { chainId } = useAccount();

  return (
    <div className="space-y-3">
      <p className={STYLES.modalSectionTitle}>{title}</p>
      {description && (
        <p className={STYLES.modalSectionDescription}>{description}</p>
      )}
      <div className="inline-flex flex-col space-y-2">
        {addresses.map((address) => (
          <Link
            key={address}
            href={getEtherscanAddressLink(chainId ?? 1, address)}
            target="_blank"
          >
            <div
              key={address}
              className="items-center gap-2 bg-terciary inline-flex justify-between py-0.5 px-2 rounded-md hover:cursor-pointer"
            >
              <p className="text-primary font-roboto-mono font-medium text-xs">
                {address}
              </p>
              <ExternalLinkIcon
                size={12}
                className="text-primary hover:font-bold"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
