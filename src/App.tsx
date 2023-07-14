import { useConnectModal } from '@rainbow-me/rainbowkit'
import { getBridgeAddress } from './lib/contracts'
import {
  useAccount,
  useDisconnect,
  useNetwork,
  usePrepareSendTransaction,
  useSendTransaction,
  useSwitchNetwork,
  useWaitForTransaction,
} from 'wagmi'
import { useState } from 'react'
import useDebounce from './hooks/useDebounce'
import { LoadingText } from './components/LoadingText'
import { parseEther } from 'viem/utils'
import { buildBaseExplorerLink, buildEtherscanLink } from './lib/utilts'

export default function App() {
  const { chain } = useNetwork()
  const { address } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { disconnect } = useDisconnect()

  const [isTestnet, setIsTestnet] = useState(false)
  const [amountEth, setAmountEth] = useState<string>('')
  const [gasEth, setGasEth] = useState<string>('')
  const debouncedEth = useDebounce(amountEth, 500)
  const numberRegex = /^\d*\.?\d*$/
  const isEthValueValid =
    numberRegex.test(debouncedEth) && Number(debouncedEth) > 0

  const switchToGoerli = useSwitchNetwork({ chainId: 5 })
  const switchToHomestead = useSwitchNetwork({ chainId: 1 })
  const isCorrectChain = chain?.id === (isTestnet ? 5 : 1)

  const defaultGas = BigInt(gasEth)
  const prepare = usePrepareSendTransaction({
    chainId: isTestnet ? 5 : 1,
    to: getBridgeAddress(isTestnet ? 5 : 1),
    value: isEthValueValid
      ? parseEther(`${Number(debouncedEth)}`, 'wei')
      : undefined,
    gas: defaultGas,
    enabled: isEthValueValid,
  })

  const transaction = useSendTransaction(prepare.config)
  const receipt = useWaitForTransaction({ hash: transaction.data?.hash })

  return (
    <>

      <div className="flex-center-ver-hoz">
      <main className='wrapper'>
      <div className="box-alert">
        <div className="text-center"><a href="https://www.reguide.wiki" target='_blank'><img src="https://www.reguide.wiki/static/ReWiki-LOGO-150x150-999c482d3dee2772722df7b023219158.png" alt="" /></a></div>
      {!isTestnet && <p style={{fontSize: `40px`}}>BUILD BRIDGES ON BASE</p>
      }
      <p>ReWiki Labs does not accept any responsibility for any errors on this website (including omissions or inaccurate material). ReWiki Labs does not accept any responsibility for any trading or investment related losses incurred by ReWiki Labs visitors, even if they are a result of errors.</p>
      </div>
        <div className="network-toggle">
          <label htmlFor="mainnet">Mainnet</label>
          <input
            type="radio"
            name="network"
            value="mainnet"
            id="mainnet"
            defaultChecked={!isTestnet}
            onChange={() => {
              // switch to homestead if not already on homestead
              if (chain?.id !== 1) switchToHomestead.switchNetwork?.()
              setIsTestnet(false)
            }}
          />

          <label htmlFor="goerli">Goerli</label>
          <input
            type="radio"
            name="network"
            value="goerli"
            id="goerli"
            defaultChecked={isTestnet}
            onChange={() => {
              // switch to goerli if not already on goerli
              if (chain?.id !== 5) switchToGoerli.switchNetwork?.()
              setIsTestnet(true)
            }}
          />
        </div>

        <div className="input-group container">
          {!address ? (
            <button className="button" onClick={() => openConnectModal?.()}>
              Connect
            </button>
          ) : receipt.isError ? (
            <>
              <a
                className="button"
                target="_blank"
                href={buildEtherscanLink(
                  chain?.id,
                  transaction.data?.hash || ''
                )}
              >
                Transaction failed :/
              </a>
              <button onClick={() => window.location.reload()}>
                Refresh and try again
              </button>
            </>
          ) : receipt.isSuccess ? (
            <a
              className="button"
              target="_blank"
              href={buildBaseExplorerLink(chain?.id, address)}
            >
              View on Base Explorer
            </a>
          ) : transaction.data?.hash ? (
            <>
              <div className="bridge-loading">
                <div className="button">
                  <LoadingText>Bridging</LoadingText>
                </div>
                <span>
                  <a
                    target="_blank"
                    href={buildEtherscanLink(chain?.id, transaction.data?.hash)}
                  >
                    View on Etherscan: {buildEtherscanLink(chain?.id, transaction.data?.hash)}
                  </a>
                </span>
              </div>
            </>
          ) : (
            <>
              {chain?.id === 5 || chain?.id === 1 ? (
                <>
                  {/* Input for ETH amount */}
                  <label htmlFor="ethAmount" className='text-center'>ETH Mainnet to Base Mainnet</label>
                  <div className="input-wrapper ">
                    
                    <input
                      className="inputAmount"
                      id="ethAmount"
                      type="text"
                      placeholder="0.001"
                      onChange={(e) => setAmountEth(e.target.value)}
                    />

                    <span className="label-right">ETH </span>{Number(debouncedEth) === 0 ? (
                    <p className="text-success">Enter </ p>
                  ) : !isEthValueValid ? (
                    <p className="text-red">Invalid ETH amount</p>
                  ) : <p className="text-success">Correct</p>}
                  </div>
                  <hr className='gapp'/>
                  <div className="input-wrapper">
                    <input
                    className="inputAmount"
                      id="gasEth"
                      type="text"
                      placeholder="Default: 70000" value="70000"
                      onChange={(e) => setGasEth(e.target.value)}
                    />
                  <span className="label-right">GAS LIMIT</span>

                  </div>
                  

                  <button
                    className="button"
                    disabled={
                      !transaction.sendTransaction ||
                      amountEth !== debouncedEth ||
                      !isEthValueValid
                    }
                    onClick={() => transaction.sendTransaction?.()}
                  >
                    {transaction.isLoading ? (
                      <LoadingText>Confirm in wallet</LoadingText>
                    ) : prepare.error?.name === 'EstimateGasExecutionError' ? (
                      'Insufficient funds'
                    ) : !isCorrectChain ? (
                      'Wrong network'
                    ) : (
                      'Bridge'
                    )}
                  </button>
                </>
              ) : (
                <button
                  className="button"
                  onClick={() => switchToHomestead.switchNetwork?.()}
                >
                  Switch network
                </button>
              )}

              {/* Switch network button */}
              {!isCorrectChain ? (
                <button
                  onClick={() => {
                    if (isTestnet) switchToGoerli.switchNetwork?.()
                    if (!isTestnet) switchToHomestead.switchNetwork?.()
                  }}
                >
                  <LoadingText
                    loading={
                      switchToGoerli.isLoading || switchToHomestead.isLoading
                    }
                  >
                    Switch network
                  </LoadingText>
                </button>
              ) : (
                <button onClick={() => disconnect?.()}>Disconnect</button>
              )}
            </>
          )}
        </div>
      </main>
      </div>
    </>
  )
}
