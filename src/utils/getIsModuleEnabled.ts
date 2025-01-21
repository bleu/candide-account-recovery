import { Address, PublicClient } from "viem";

const isModuleEnabledAbi = [
  {
    name: "isModuleEnabled",
    type: "function",
    stateMutability: "view",
    inputs: [
      {
        name: "module",
        type: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
  },
];

export async function getIsModuleEnabled(
  publicClient: PublicClient,
  safeAddress: Address,
  moduleAddress: Address
) {
  try {
    const isEnabled = await publicClient.readContract({
      address: safeAddress,
      abi: isModuleEnabledAbi,
      functionName: "isModuleEnabled",
      args: [moduleAddress],
    });
    return isEnabled;
  } catch {
    return false;
  }
}
