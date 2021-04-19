import { Canvas, createImageData } from 'canvas'
import { reduce, isNil } from 'lodash'
import { Pixels } from '@murall/event-processor'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constants'

type Dimensions = {
  minWidth: number
  minHeight: number
  maxWidth: number
  maxHeight: number
}

const smaller = (current: number, newVal: number): number => current < newVal ? current : newVal

const larger = (current: number, newVal: number): number => current > newVal ? current : newVal

const calculateMinMax = (index: number, dimensions: Dimensions): Dimensions => {
  const width = index % CANVAS_WIDTH
  const height = Math.floor(index / CANVAS_WIDTH)
  return {
    minWidth: isNil(dimensions.minWidth) ? width : smaller(dimensions.minWidth || 0, width),
    minHeight: isNil(dimensions.minHeight) ? height : smaller(dimensions.minHeight || 0, height),
    maxWidth: larger(dimensions.maxWidth, width),
    maxHeight: larger(dimensions.maxHeight, height)
  }
}

const cropImage = (canvas: Canvas, dimensions: Dimensions): Canvas => {
  // crop event image
  const ctx = canvas.getContext('2d')
  const width = 1 + dimensions.maxWidth - dimensions.minWidth
  const height = 1 + dimensions.maxHeight - dimensions.minHeight
  const cut = ctx.getImageData(dimensions.minWidth, dimensions.minHeight, width, height)
  canvas.width = width
  canvas.height = height
  ctx.putImageData(cut, 0, 0)
  return canvas
}

export default (canvas: Canvas, pixels: Pixels): Canvas => {
  if (!pixels) return canvas

  const ctx = canvas.getContext('2d')
  const canvasBuffer = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data.buffer
  const imageDataBuffer = new Uint32Array(canvasBuffer)
  
  const dimensions: Dimensions = reduce(pixels, (carry, value, index) => {
    // add pixel to canvas
    imageDataBuffer[index] = value
  
    return calculateMinMax(index, carry)
  }, { minWidth: null, minHeight: null, maxWidth: 0, maxHeight: 0 })

  const processedImageData = createImageData(new Uint8ClampedArray(canvasBuffer), CANVAS_WIDTH, CANVAS_HEIGHT)
  ctx.putImageData(processedImageData, 0, 0)
  return cropImage(canvas, dimensions)
}
