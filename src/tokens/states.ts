import { Canvas } from 'canvas'
import { range, compact, head } from 'lodash'
import { extract, process } from '@murall/event-processor'
import { L1, L2 } from '../connections/web3'
import createCanvas from '../canvas/create'
import appendToCanvas from '../canvas/append'
import saveImage from '../canvas/save-image'

export type ApplyChangesOptions = {
  readonly isLayer2?: boolean
  readonly initialState?: Canvas
  readonly save?: boolean
  readonly saveDir?: string
  readonly filename?: string
}

const imageFilename = (from: number, to: number, name?: string) => name ? `${name}.png` : `tokens_${from}-${to}.png`

export const apply = async (from = 0, to = 1, opts?: ApplyChangesOptions): Promise<Canvas> => {
  const options = opts || {}

  const web3 = options.isLayer2 ? L2() : L1()
  const murallContract = await web3.contracts.MurAll.get()
  const logEvents = await murallContract.getPastEvents('Painted', {
    filter: { tokenId: range(from, to) },
    fromBlock: 'earliest',
    toBlock: 'latest'
  })
  const events = compact(logEvents.map(extract)) || []
  if (!events.length) throw new Error(`Failed to fetch log events for tokens ${from} to ${to}`)
  const processedEvents = compact(events.map(process))
  if (!processedEvents.length) throw new Error(`Failed to process tokens ${from} to ${to}`)

  const canvas = options.initialState || createCanvas(head(processedEvents))
  processedEvents.forEach(pixels => {
    appendToCanvas(canvas, pixels)
  })

  if (options.save) {
    await saveImage(canvas, { directory: options.saveDir, filename: imageFilename(from, to, options.filename) })
  }
  return canvas
}
