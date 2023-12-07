import { useMemo } from "react";
import { LIVE_CONTRACTS, SupportedNetwork } from "@xinfin/osx-client-common";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { JsonRpcProvider } from "@ethersproject/providers";
import {
  useAccount,
  useDisconnect,
  useBalance,
  useEnsName,
  useEnsAvatar,
  useNetwork as useWagmiNetwork,
} from "wagmi";

import { useNetwork } from "../contexts/network";
import { useEthersSigner } from "./useEthersSigner";
import { BigNumber } from "ethers";
import { CHAIN_METADATA, translateToNetworkishName } from "../utils/networks";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export interface IUseWallet {
  connectorName: string;
  balance: BigNumber | null;
  ensAvatarUrl: string;
  ensName: string;
  isConnected: boolean;
  isModalOpen?: boolean;
  /**
   * Returns true iff the wallet is connected and it is on the wrong network
   * (i.e., the chainId returned by the useSigner context does not agree with
   * the network name returned by the useNetwork context).
   */
  isOnWrongNetwork: boolean;
  network: string;
  provider: Web3Provider | null;
  signer: JsonRpcSigner | null;
  status: "connecting" | "reconnecting" | "connected" | "disconnected";
  address: string | null;
  chainId: number;
  methods: {
    selectWallet: (
      cacheProvider?: boolean,
      networkId?: string
    ) => Promise<void>;
    disconnect: () => Promise<void>;
  };
}

export const useWallet = (): IUseWallet => {
  const { network } = useNetwork();
  const { openConnectModal, } = useConnectModal();
  const { chain } = useWagmiNetwork();
  const { address, status: wagmiStatus, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = chain?.id || 0;
  const signer = useEthersSigner(chainId);

  const provider = useMemo(() => {
    if (["apothem"].includes(network)) {
      return new JsonRpcProvider(CHAIN_METADATA[network].rpc[0], {
        chainId: CHAIN_METADATA[network].id,
        name: translateToNetworkishName(network),
        ensAddress:
          LIVE_CONTRACTS[translateToNetworkishName(network) as SupportedNetwork]
            .ensRegistry,
      });
    } else return signer?.provider;
  }, [network, signer?.provider]);

  const { data: wagmiBalance } = useBalance({
    address,
  });

  const { data: ensName } = useEnsName({
    address,
  });

  const { data: ensAvatarUrl } = useEnsAvatar({
    name: ensName,
  });

  const balance: bigint | null = wagmiBalance?.value || null;
  const isOnWrongNetwork: boolean =
    isConnected && CHAIN_METADATA[network].id !== chainId;

  const methods = {
    selectWallet: async (cacheProvider?: boolean, networkId?: string) => {
      // openConnectModal
      await new Promise((resolve) => {
        resolve({
          networkId,
          cacheProvider,
        });
      });
    },
    disconnect: async () => {
      await new Promise((resolve) => {
        disconnect();
        resolve(true);
      });
    },
  };

  return {
    connectorName: connector?.name || "",
    provider: provider as Web3Provider,
    signer: signer as JsonRpcSigner,
    status: wagmiStatus,
    address: address as string,
    chainId,
    balance: BigNumber.from(balance || 0),
    ensAvatarUrl: ensAvatarUrl as string,
    ensName: ensName as string,
    isConnected,
    isOnWrongNetwork,
    methods,
    network,
  };
};
