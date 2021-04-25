import { Canvas } from 'canvas'
import { extract, process } from '@murall/event-processor'
import { L1, L2 } from '../connections/web3'
import createCanvas from '../canvas/create'
import saveImage from '../canvas/save-image'
import { get as fetchMetadata, Metadata } from './metadata'

export type FetchTokenOptions = {
  readonly isLayer2?: boolean
  readonly save?: boolean
  readonly saveDir?: string
  readonly cropped?: boolean
  readonly includeMetadata?: boolean
}

export type TokenData = {
  canvas: Canvas
  metadata?: Metadata
}

const imageFilename = (tokenId: number): string => `token_${tokenId}.png`

export const get = async (id: number, opts?: FetchTokenOptions): Promise<TokenData | undefined> => {
  if (id == null) return
  const options = opts || {}

  const web3 = options.isLayer2 ? L2() : L1()
  const murallContract = await web3.contracts.MurAll.get()
  const logEvents = await murallContract.getPastEvents('Painted', {
    filter: { tokenId: [id] },
    fromBlock: 'earliest',
    toBlock: 'latest'
  })
  const [event] = logEvents.map(extract) || []
  if (!event) throw new Error(`Failed to fetch log event for token ${id}`)
  const pixels = process(event) || {}
  if (!pixels) throw new Error(`Failed to process token ${id} data`)

  const canvas = createCanvas(pixels, options.cropped)
  if (options.save) {
    await saveImage(canvas, { directory: options.saveDir, filename: imageFilename(id) })
  }
  if (!options.includeMetadata) return { canvas }

  const metadata = await fetchMetadata(id, options)
  return { canvas, metadata }
}

export const max = async (isLayer2?: boolean): Promise<number> => {
  const web3 = isLayer2 ? L2() : L1()
  const nftContract = await web3.contracts.Nft.get()
  const totalSupply = await nftContract.methods.totalSupply().call()
  return totalSupply > 0 ? totalSupply - 1 : totalSupply
}
