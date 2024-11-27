import { promises as fs } from 'fs'
import path from 'path'

export async function GET() {
  const musicDir = path.join(process.cwd(), 'public', 'music')
  const files = await fs.readdir(musicDir)
  const mp3Files = files.filter(file => file.endsWith('.mp3'))
  return Response.json(mp3Files)
}

