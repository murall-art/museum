import { Contract } from 'web3-eth-contract'
import { hexToAscii } from 'web3-utils'
import { L1, L2 } from '../../connections/web3'
import save from './save'

export type MetadataOptions = {
  readonly isLayer2?: boolean
  readonly save?: boolean
  readonly saveDir?: string
}

export type Metadata = {
  name: string
  artist: string
  number: number
  series: number
  viewUrl: string
  isFilled: boolean
}

export const get = async (id: number, opts?: MetadataOptions): Promise<Metadata | undefined> => {
  if (id == null) return
  const options = opts || {}
  
  const web3 = options.isLayer2 ? L2() : L1()
  const nftContract = await web3.contracts.Nft.get()
  
  const fetchName = async (contract: Contract, tokenId: number): Promise<string> => {
    const callSig = contract.methods.getName(tokenId).encodeABI()
    const result = await web3.eth.call({ to: contract.options.address, data: callSig })
    return hexToAscii(result).replace(/[\u0000-\u001F]/g, '').trim()
  }

  const [name, artist, number, series, viewUrl, isFilled] = await Promise.all([
    fetchName(nftContract, id),
    nftContract.methods.getArtist(id).call(),
    nftContract.methods.getNumber(id).call(),
    nftContract.methods.getSeriesId(id).call(),
    nftContract.methods.viewURI(id).call(),
    nftContract.methods.isArtworkFilled(id).call()
  ])

  const metadata: Metadata = { name, artist, number, series, viewUrl, isFilled }
  if (options.save) {
    await save(metadata, { directory: options.saveDir, filename: `metadata_${id}.json` })
  }
  return metadata
}
