import { AddChain } from './types'

export const baseTestnet: AddChain = {
  chainId: '0x14a33', // 84531
  chainName: 'Base Goerli Testnet',
  nativeCurrency: { symbol: 'ETH', decimals: 18 },
  rpcUrls: ['https://goerli.base.org'],
  blockExplorerUrls: ['https://goerli.basescan.org'],
}

export const baseMainnet: AddChain = {
  chainId: '0x2105', // 8453
  chainName: 'Base',
  nativeCurrency: { symbol: 'ETH', decimals: 18 },
  rpcUrls: ['https://developer-access-mainnet.base.org'],
  blockExplorerUrls: ['https://basescan.org'],
}
