import { Canvas } from 'canvas'
import { extract, process } from '@murall/event-processor'
import { L1, L2 } from '../connections/web3'
import createCanvas from '../canvas/create'
import saveImage from '../canvas/save-image'
import fetchMetadata, { Metadata } from '../metadata/fetch'

export type FetchTokenOptions = {
  readonly isLayer2?: boolean
  readonly save?: boolean
  readonly downloadDir?: string
  readonly cropped?: boolean
  readonly includeMetadata?: boolean
}

export type TokenData = {
  canvas: Canvas
  metadata?: Metadata
}

const imageFilename = (tokenId) => `token_${tokenId}.png`

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
  if (!event) throw new Error(`Failed to process log event for token ${id}`)
  const pixels = process(event) || {}

  const canvas = createCanvas(pixels, options.cropped)
  if (options.save) {
    await saveImage(canvas, { directory: options.downloadDir, filename: imageFilename(id) })
  }
  if (!options.includeMetadata) return { canvas }

  const metadata = await fetchMetadata(id, options)
  return { canvas, metadata }
}
