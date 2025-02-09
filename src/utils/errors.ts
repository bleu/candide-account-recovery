export class WalletError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WalletError";
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class TransactionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TransactionError";
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error instanceof WalletError) return "Wallet Error: " + error.message;
    if (error instanceof ValidationError)
      return "Validation Error: " + error.message;
    if (error instanceof TransactionError)
      return "Transaction Error: " + error.message;
    return error.message;
  }
  return "An unknown error occurred";
}
