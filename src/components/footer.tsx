import React, { ReactNode } from "react";
import Link from "next/link";
import { SafeLogo } from "./ui/safe-logo";

const Footer = () => {
  return (
    <footer className="w-full flex flex-wrap justify-around px-4 md:px-8 lg:px-16 xl:px-52 py-4 gap-8">
      <CreditsCard
        title="Frontend by"
        imageUrl="/bleu-logo.png"
        altText="Bleu Logo"
        url="https://github.com/bleu/candide-account-recovery"
      />
      <CreditsCard
        title="Smart Contracts by"
        imageUrl="https://cdn.prod.website-files.com/6540e7cece6336bd77329344/65452258abad3510f9c0f72f_Camada_1.png"
        altText="Candide Labs Logo"
        url="https://github.com/candidelabs/candide-contracts"
      />
      <CreditsCard
        title="Audited by"
        imageUrl="https://cdn.prod.website-files.com/6621233fd44f04553ba73645/6657486ee09d18c7e9abea2d_logo.svg"
        altText="Ackee Logo"
        url="https://github.com/candidelabs/candide-contracts/blob/main/audit/ackee-blockchain-candide-social-recovery-report.pdf"
      />
      <CreditsCard
        title="Formal verification"
        content={<SafeLogo width={104} height={32} />}
        altText="Safe logo"
        url="https://app.safe.global/welcome"
      />
    </footer>
  );
};

interface CreditsCardProps {
  title: string;
  url: string;
  imageUrl?: string;
  altText?: string;
  content?: ReactNode;
}

const CreditsCard = ({
  title,
  imageUrl,
  altText,
  content,
  url,
}: CreditsCardProps) => {
  return (
    <Link href={url} target="_blank" className="flex-shrink-0">
      <div className="flex flex-col items-center justify-center gap-1 opacity-40 hover:opacity-100 transition-all">
        <p className="opacity-80 font-medium text-center text-sm">{title}</p>
        {imageUrl ? (
          <div className="h-12 flex items-center justify-center">
            <div className="w-24 h-8 relative flex items-center justify-center">
              {/* eslint-disable-next-line */}
              <img
                src={imageUrl}
                alt={altText || "Logo"}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        ) : (
          <div className="h-12 flex items-center justify-center">{content}</div>
        )}
      </div>
    </Link>
  );
};

export default Footer;
