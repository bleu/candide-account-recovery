export const getReadableError = (error: Error) => {
  if (error.message.includes("User rejected transaction")) {
    return "User rejected transaction.";
  }

  return "Transaction error.";
};
