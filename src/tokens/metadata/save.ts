import fs from 'fs'
import { Metadata } from './index'

export type FileOptions = {
  directory?: string
  filename?: string
}

export default async (metadata: Metadata, options?: FileOptions): Promise<void> => {
  if (!metadata) return

  const { directory, filename } = options || {}
  const dir = directory || '.'
  const name = filename || 'metadata.json'
  const path = `${dir}/${name}`

  fs.writeFile(path, JSON.stringify(metadata), (err) => {
    if (err) console.error(err)
  })
}
