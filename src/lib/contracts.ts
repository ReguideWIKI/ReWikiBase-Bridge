export function getBridgeAddress(chainId: number | undefined): `0x${string}` {
  if (chainId === 5) {
    return '0xe93c8cD0D409341205A592f8c4Ac1A5fe5585cfA'
  } else {
    return '0x49048044D57e1C92A77f79988d21Fa8fAF74E97e'
  }
}
