export function buildEtherscanLink(
  chainId: number | undefined,
  txHash: string
) {
  return `https://${chainId === 5 ? 'goerli.' : ''}etherscan.io/tx/${txHash}`
}

export function buildBaseExplorerLink(
  chainId: number | undefined,
  address: string
) {
  return `https://${
    chainId === 5 ? 'goerli.' : ''
  }basescan.org/address/${address}`
}
