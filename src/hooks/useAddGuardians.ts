"use client";

import {
  SocialRecoveryModule,
  MetaTransaction,
  Operation,
} from "abstractionkit";
import { useCallback } from "react";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { Address, encodeFunctionData } from "viem";
import useSWRMutation from "swr/mutation";
import { getBytes, solidityPacked } from "ethers";

const multisendCallOnlyAddress =
  "0x40A2aCCbd92BCA938b02010E17A5b8929b49130D" as Address;

function encodeMultiSendTransaction(metaTransaction: MetaTransaction): string {
  const operation = metaTransaction.operation ?? Operation.Call;

  const data = getBytes(metaTransaction.data);
  const encoded = solidityPacked(
    ["uint8", "address", "uint256", "uint256", "bytes"],
    [operation, metaTransaction.to, metaTransaction.value, data.length, data]
  );
  return encoded.slice(2);
}

function encodeMultiSendCallData(metaTransactions: MetaTransaction[]): string {
  return (
    "0x" + metaTransactions.map((tx) => encodeMultiSendTransaction(tx)).join("")
  );
}

const multisendCallOnlyAbi = [
  {
    inputs: [{ internalType: "bytes", name: "transactions", type: "bytes" }],
    name: "multiSend",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

function createMultisendTx(
  txs: {
    to: Address;
    data: `0x${string}`;
    value: bigint;
  }[]
) {
  const encodedMultisendData = encodeMultiSendCallData(txs);

  const multiSendTx = {
    to: multisendCallOnlyAddress,
    data: encodeFunctionData({
      abi: multisendCallOnlyAbi,
      functionName: "multiSend",
      args: [encodedMultisendData],
    }),
    value: BigInt(0),
  };
  return multiSendTx;
}

type publicClientType = NonNullable<ReturnType<typeof usePublicClient>>;

async function isModuleEnabled(
  publicClient: publicClientType,
  safeAddress: Address,
  moduleAddress: Address
) {
  console.log("fetching module is enabled...");
  const isEnabled = await publicClient.readContract({
    address: safeAddress,
    abi: [
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
    ],
    functionName: "isModuleEnabled",
    args: [moduleAddress],
  });
  console.log("isEnabled:", isEnabled);
  return isEnabled;
}

async function buildAddGuardiansTxs(
  srm: SocialRecoveryModule,
  publicClient: publicClientType,
  signer: Address,
  guardians: Address[],
  threshold: number
) {
  const txs = [];

  const moduleIsEnabled = await isModuleEnabled(
    publicClient,
    signer,
    srm.moduleAddress as Address
  );

  if (!moduleIsEnabled) {
    const enableModuleTx = srm.createEnableModuleMetaTransaction(signer);
    txs.push(enableModuleTx);
  }

  for (const guardian of guardians) {
    const addGuardianTx = srm.createAddGuardianWithThresholdMetaTransaction(
      guardian,
      BigInt(threshold)
    );
    txs.push(addGuardianTx);
  }

  return txs.map((tx) => {
    return {
      to: tx.to as Address,
      data: tx.data as `0x${string}`,
      value: tx.value,
    };
  });
}

export function useAddGuardians(guardians: Address[], threshold: number = 1) {
  const { address: signer } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const addGuardians = useCallback(async () => {
    if (!signer || !walletClient || !publicClient)
      throw new Error("Missing signer or client");

    const srm = new SocialRecoveryModule();
    const txs = await buildAddGuardiansTxs(
      srm,
      publicClient,
      signer,
      guardians,
      threshold
    );

    console.log({ txs });
    if (txs.length < 1) throw new Error("No transaction to call");

    if (txs.length > 1) console.log({ multisend: createMultisendTx(txs) });
    const txHash =
      txs.length < 2
        ? await walletClient.sendTransaction(txs[0])
        : await walletClient.sendTransaction(createMultisendTx(txs));

    console.log({ txHash });

    return txHash;
  }, [signer, walletClient, publicClient, guardians, threshold]);

  const {
    data: txHash,
    isMutating: isLoading,
    trigger,
    error,
  } = useSWRMutation<string>(
    signer && walletClient && publicClient && guardians.length > 0
      ? "guardians"
      : null,
    addGuardians
  );

  console.log({ txHash, error, isLoading });

  return { txHash, addGuardians: trigger, error, isLoading };
}
