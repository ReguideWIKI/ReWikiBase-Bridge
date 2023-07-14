import { useCallback, useMemo, useState } from 'react'

import { AddChain } from '../lib/types'

export function useAddChain(chain: AddChain) {
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | undefined>()
  const provider = useInjectedProvider()

  const addChain = useCallback(async () => {
    if (provider && provider.request) {
      setError(undefined)

      try {
        setIsLoading(true)
        const response = await provider.request({
          method: 'wallet_addEthereumChain',
          params: [chain],
        })

        setIsLoading(false)
        if (response !== null) {
          return setError('Failed to Switch Network')
        }

        setIsSuccess(true)
      } catch (e) {
        console.log(e)
        setIsLoading(false)
        setError('Failed to Switch Network')
      }
    }
  }, [chain, provider])

  return {
    error,
    addChain,
    isLoading,
    isSuccess,
    isEnabled:
      provider?.isMetaMask &&
      provider?._state?.isUnlocked &&
      provider.selectedAddress,
  }
}

function useInjectedProvider() {
  const { ethereum: library } = window
  return useMemo(() => library, [library])
}
