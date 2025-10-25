import fs from 'fs/promises'
import path from 'path'

const PATH = path.join(process.cwd(), 'src', 'app', 'words', 'valid-wordle-words.txt');

export async function GET() {
  try {
    const data = await fs.readFile(PATH, 'utf8');
    const words = data.split('\n')
      .map(w => w.trim().toUpperCase())
      .filter(w => w.length > 0)
    
    return Response.json({ words })
  } catch (err) {
    console.error('Error: ', err);
    return Response.json({ error: 'Failed to load words' }, { status: 500 })
  }
}