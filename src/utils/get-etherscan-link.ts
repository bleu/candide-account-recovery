import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";

function getEtherscanBaseUrl(chainId: number): string {
  switch (chainId) {
    case mainnet.id:
      return "https://etherscan.io";
    case sepolia.id:
      return "https://sepolia.etherscan.io";
    case optimism.id:
      return "https://optimistic.etherscan.io";
    case base.id:
      return "https://basescan.org";
    case arbitrum.id:
      return "https://arbiscan.io";
    case polygon.id:
      return "https://polygonscan.com";
    default:
      return "https://etherscan.io";
  }
}

export function getEtherscanAddressLink(
  chainId: number,
  address: string
): string {
  const baseUrl = getEtherscanBaseUrl(chainId);
  return `${baseUrl}/address/${address}`;
}
