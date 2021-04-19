import { Canvas, createCanvas } from 'canvas'
import { Pixels } from '@murall/event-processor'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constants'
import append from './append'
import crop from './crop'

export default (pixels: Pixels, returnCropped?: boolean): Canvas => {
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
  return returnCropped ? crop(canvas, pixels) : append(canvas, pixels)
}
