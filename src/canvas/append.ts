import { Canvas, createImageData } from 'canvas'
import { Pixels } from '@murall/event-processor'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constants'

export default (canvas: Canvas, pixels: Pixels): Canvas => {
  const ctx = canvas.getContext('2d')
  const canvasBuffer = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data.buffer
  const imageDataBuffer = new Uint32Array(canvasBuffer)
  Object.keys(pixels).map((key) => (imageDataBuffer[key] = pixels[key]))
  const processedImageData = createImageData(new Uint8ClampedArray(canvasBuffer), CANVAS_WIDTH, CANVAS_HEIGHT)
  ctx.putImageData(processedImageData, 0, 0)
  return canvas
}
