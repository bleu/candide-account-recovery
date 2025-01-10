import * as React from "react";
import { Button as BleuButton } from "@bleu.builders/ui";
import { ButtonProps as BleuButtonProps } from "@bleu.builders/ui";

interface ButtonProps extends BleuButtonProps {
  // Add any additional props you want here
  fullWidth?: boolean;
}

export default function Button({
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <BleuButton
      className={`
        bg-primary 
        text-primary-foreground 
        hover:bg-terciary 
        hover:text-primary 
        ${className}
      `}
      {...props}
    >
      {children}
    </BleuButton>
  );
}
