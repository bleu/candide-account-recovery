import * as React from "react";
import { Button as BleuButton } from "./bleu-button";
import { ButtonProps as BleuButtonProps } from "./bleu-button";

interface ButtonProps extends BleuButtonProps {
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
