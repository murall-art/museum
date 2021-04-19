import { Contract } from 'web3-eth-contract'
import { Eth as Ethereum } from 'web3-eth'
const Eth: typeof Ethereum = require('web3-eth')

type Contracts = {
  MurAll: { get: () => Promise<Contract> }
  Nft: { get: () => Promise<Contract> }
}

export type MurAllChainData = {
  readonly eth: Ethereum
  readonly contracts: Contracts
}

const { PROVIDER_URL, PROVIDER_URL_L2 } = process.env

const network = async (eth: Ethereum, contract) => {
  const netId = await eth.net.getId()
  return contract.networks[netId]
}

const initContract = async (path: string, eth: Ethereum): Promise<Contract> => {
  const buildFilePath = `../../contracts/${path}.json`
  const buildFile = require(buildFilePath)
  const deployedNetwork = await network(eth, buildFile)
  return new eth.Contract(buildFile.abi, deployedNetwork && deployedNetwork.address)
}

const init = (isL1 = true): MurAllChainData => {
  const eth: Ethereum = new Eth(Eth.givenProvider || (isL1 ? PROVIDER_URL : PROVIDER_URL_L2))
  const folder = isL1 ? 'l1' : 'l2'
  const contracts = {
    MurAll: { get: () => initContract(`${folder}/MurAll`, eth) },
    Nft: { get: () => initContract(`${folder}/MurAllNFT`, eth) }
  }
  return { eth, contracts }
}

export const L1 = (): MurAllChainData => init()
export const L2 = (): MurAllChainData => init(false)
