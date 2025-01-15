import React from "react";
import { MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface HomeButtonProps {
  label: string;
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

const HomeButton = ({
  label,
  title,
  description,
  href = "/",
  onClick,
  className,
}: HomeButtonProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col bg-content-background text-content-foreground p-5 rounded-lg shadow-lg w-full border border-content-background hover:border-primary group text-start ",
        className
      )}
      onClick={onClick}
    >
      <div className="flex w-full justify-between mb-4">
        <span className="text-xs font-light opacity-60">{label}</span>
        <MoveRight className="text-primary group-hover:-rotate-45" size={24} />
      </div>
      <span className="mb-2 font-bold opacity-60">{title}</span>
      <p className="text-sm font-light opacity-60">{description}</p>
    </Link>
  );
};

export default HomeButton;
