export interface AddChain {
  chainId: string
  chainName: string
  nativeCurrency: {
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls: string[]
}
