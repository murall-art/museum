import { Canvas } from 'canvas'
import fs from 'fs'

export type FileOptions = {
  directory?: string
  filename?: string
}

export default async (canvas: Canvas, options?: FileOptions): Promise<void> => {
  if (!canvas) return

  const data = canvas.toDataURL().replace(/^data:image\/\w+;base64,/, '')
  const buffer = Buffer.from(data, 'base64')

  const { directory, filename } = options || {}
  const dir = directory || '.'
  const name = filename || 'image.png'
  const path = `${dir}/${name}`

  fs.writeFile(path, buffer, (err) => {
    if (err) console.error(err)
  })
}
