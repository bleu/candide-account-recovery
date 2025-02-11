"use client";
import { STYLES } from "@/constants/styles";
import { ExternalLinkIcon } from "lucide-react";
import React from "react";

interface AddressSectionProps {
  title: string;
  description: string;
  addresses: string[];
}

export default function AddressSection({
  title,
  description,
  addresses,
}: AddressSectionProps) {
  return (
    <div className="space-y-3">
      <p className={STYLES.modalSectionTitle}>{title}</p>
      <p className={STYLES.modalSectionDescription}>{description}</p>
      <div className="inline-flex flex-col space-y-2">
        {addresses.map((address) => (
          <div
            key={address}
            className="items-center gap-2 bg-terciary inline-flex justify-between py-0.5 px-2 rounded-md"
          >
            <p className="text-primary font-roboto-mono font-medium text-xs">
              {address}
            </p>
            {/* TODO: CANDIDE-36 - Handle all external links to manage multiple chains */}
            <ExternalLinkIcon
              size={12}
              className="text-primary"
              onClick={() =>
                window.open(`https://etherscan.io/address/${address}`)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
