# Wordle Clone

A modern, fully-functional Wordle game clone built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## 🎮 Live Demo

**[Play Now →](https://wordleclone-nu.vercel.app/)**

## Features

- **Classic Wordle Gameplay**: 6 attempts to guess a 5-letter word
- **Real-time Validation**: Instant feedback with color-coded tiles
  - 🟩 Green: Correct letter in correct position
  - 🟨 Yellow: Correct letter in wrong position
  - ⬜ Gray: Letter not in word
- **Smart Keyboard**: On-screen keyboard with color feedback matching tile states
- **Word Validation**: Checks against a comprehensive dictionary of valid Wordle words
- **Animations**: 
  - Tile flip animations on guess submission
  - Shake animation for invalid words
  - Toast notifications for game events
- **Physical Keyboard Support**: Type directly with your keyboard
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: [Next.js 15.5.4](https://nextjs.org/) with App Router
- **React**: Version 19.1.0
- **TypeScript**: Type-safe development
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Build Tool**: Turbopack (Next.js's rust-based bundler)

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wordle
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Play

1. **Guess the Word**: Type a 5-letter word using your keyboard or the on-screen keyboard
2. **Submit**: Press Enter (or click the ENTER button)
3. **Check Feedback**: 
   - Green tiles mean the letter is correct and in the right spot
   - Yellow tiles mean the letter is in the word but in the wrong spot
   - Gray tiles mean the letter is not in the word
4. **Keep Guessing**: You have 6 attempts to guess the correct word
5. **Win or Lose**: Guess the word in 6 tries to win!

## Project Structure

```
wordle/
├── src/
│   └── app/
│       ├── api/              # API routes
│       │   ├── route.ts      # Get random word
│       │   └── words/
│       │       └── route.ts  # Get valid words list
│       ├── words/
│       │   └── valid-wordle-words.txt  # Dictionary file
│       ├── page.tsx          # Main game component
│       ├── layout.tsx        # Root layout
│       └── globals.css       # Global styles with animations
├── public/                   # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

## Key Components

### Game Logic (`src/app/page.tsx`)

- **State Management**: Uses React hooks (useState, useEffect, useRef) for game state
- **Guess Validation**: Checks if guessed word exists in valid word list
- **Color Logic**: Implements Wordle's exact color-matching algorithm
  - Prioritizes exact matches (green) first
  - Then marks remaining correct letters as yellow
  - Handles duplicate letters correctly
- **Keyboard Input**: Supports both physical and on-screen keyboards

### API Routes

- **`/api`**: Returns a random word from the dictionary
- **`/api/words`**: Returns the complete list of valid words for validation

### Custom Animations

Defined in `globals.css`:
- **flip**: Tile reveal animation (0.5s)
- **shake**: Invalid word feedback (0.5s)
- **toast**: Notification slide-in/out (2s)

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Change Word List

Edit `src/app/words/valid-wordle-words.txt` to modify the available words.

### Modify Game Rules

In `src/app/page.tsx`, adjust:
- `ROWS = 6` - Number of attempts
- `TILES_PER_ROW = 5` - Word length

### Styling

Colors and animations can be customized in:
- `src/app/globals.css` - Global styles and animations
- Inline Tailwind classes in components

### Other Platforms

This Next.js app can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- Render
- AWS
- Google Cloud
- Azure

Build command: `npm run build`  
Start command: `npm start`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Inspired by the original [Wordle](https://www.nytimes.com/games/wordle/) by Josh Wardle
- Word list sourced from valid Wordle dictionary
- Built with modern web technologies

## Contact

For questions or suggestions, please open an issue in the repository.

---

**Enjoy playing! 🎮**
