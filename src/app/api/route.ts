import fs from 'fs/promises'
import path from 'path'

const PATH = path.join(process.cwd(), 'src', 'app', 'words', 'valid-wordle-words.txt');
export async function GET() {
    try {
        const data = await fs.readFile(PATH, 'utf8');
        const words = data.split('\n');
        const chosenWord = words[Math.floor(Math.random() * words.length)].trim().toUpperCase()
        return Response.json({ word: chosenWord})
    } catch (err) {
        console.error('Error: ', err);
        return Response.json({ err: 'Failed to load words' }, {status: 500})
    }
}
