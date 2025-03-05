export const getReadableError = (error: Error) => {
  if (error.message.includes("User rejected transaction")) {
    return "User rejected transaction.";
  }
  if (error.message.includes("Aborted")) {
    return "Transaction aborted.";
  }
  if (error.message.includes("time out")) {
    return "Transaction time out.";
  }
  console.error(error);
  return "Transaction error.";
};
