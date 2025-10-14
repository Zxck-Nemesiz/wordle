'use client'

import { useState, useEffect, useRef } from "react";

const ROWS = 6;
const TILES_PER_ROW = 5;
const TARGET = 'REACT'

function Tile({ letter, color, isAnimating, delay, rowIsRevealed }: { letter?: string, color?: string, isAnimating?: boolean, delay?: number, rowIsRevealed?: boolean| undefined }) {
  let bgColor = ''
  const style = { animationDelay: `${delay}ms`}
  let borderColor = ''

  if (!letter) {
    borderColor = 'border-gray-300' 
  } else if (!rowIsRevealed) {
    borderColor = 'border-gray-500'
  } else {
    borderColor = 'border-gray-600' 
  }
  
  if (color === 'green') {
    bgColor = 'bg-[#6aaa64]'
  } else if (color === 'yellow') {
    bgColor = 'bg-[#c9b458]'
  } else if (color === 'gray') {
    bgColor = 'bg-[#787c7e]'
  }

  const classes = `flex justify-center items-center border-2 w-16 h-16 text-2xl uppercase ${borderColor} ${rowIsRevealed ? 'text-white' : 'text-gray-900'} ${rowIsRevealed ? bgColor : ''} ${isAnimating ? 'animate-flip' : ''}`

  return (
    <div className={classes} style={style}>{letter}</div>
  )
}

export default function Game() {
  const [guesses, setGuesses] = useState(Array(6).fill(''))
  const [colors, setColors] = useState(Array(6).fill(null).map(() => Array(5).fill(null))) //color of 6 row, 5 tile
  const [currRow, setCurrRow] = useState(0)
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const [animateRow, setAnimateRow] = useState< number| null >(null)
  const [revealedRows, setRevealedRows] = useState<Set<number>>(new Set())

  const guessesRef = useRef(guesses)
  const rowRef = useRef(currRow)
  const colorsRef = useRef(colors)
  const gameRef = useRef(gameStatus)

  guessesRef.current = guesses
  rowRef.current = currRow
  colorsRef.current = colors
  gameRef.current = gameStatus

  const checkGuess = (guess: string, target: string) => {
    let i = 0
    const seen = new Set([...target])

    const newColors = [...colorsRef.current]
    for(i = 0; i < TILES_PER_ROW; i++) {
      if (guess[i].toUpperCase() === target[i]) {
        newColors[rowRef.current][i] = 'green'
      }
      else if (seen.has(guess[i].toUpperCase())) {
        newColors[rowRef.current][i] = 'yellow'
      }
      else {
        newColors[rowRef.current][i] = 'gray'
      }
    }
    setColors(newColors)
  }

  useEffect(() => {
    const handleTyping = (e: KeyboardEvent) => {
      if (gameRef.current !== 'playing') return

      if(guessesRef.current[rowRef.current].length < 5 && /^[a-zA-Z]$/.test(e.key)) {
        const newGuesses = [...guessesRef.current]
        newGuesses[rowRef.current] = newGuesses[rowRef.current] + e.key
        setGuesses(newGuesses)
      }

      if(e.key === 'Enter') {
        if(guessesRef.current[rowRef.current].length === 5) {
          const current = rowRef.current
          checkGuess(guessesRef.current[rowRef.current], TARGET)
          setAnimateRow(current)

          setTimeout(() => {
            setAnimateRow(null)
            setRevealedRows(prev => new Set(prev).add(current))
          }, 900)
          
          if (guessesRef.current[rowRef.current].toUpperCase() === TARGET) {
            setGameStatus('won')
          }
          else if (rowRef.current === ROWS - 1) {
            setGameStatus('lost')
          }
          else {
            setCurrRow(rowRef.current + 1)
          }
        }
      }

      if(e.key == 'Backspace') {
        if(guessesRef.current[rowRef.current].length > 0) {
          const updatedGuesses = [...guessesRef.current]
          updatedGuesses[rowRef.current] = guessesRef.current[rowRef.current].slice(0, -1)
          setGuesses(updatedGuesses)
        }
      }
    }
    window.addEventListener('keydown', handleTyping)

    return () => {
      window.removeEventListener('keydown', handleTyping)
    }
  }, [])

  const messages = {
    won: 'You won! 🎉',
    lost: `Game over! The word was ${TARGET}`
  }

  const msg_colors = {
  won: 'text-green-600',
  lost: 'text-red-600'
}

  return (
    <>
      <div className='bg-gray-100 min-h-[100dvh] flex flex-col justify-center items-center'>
        <div className="max-w-lg w-full p-6">
          <div className="mb-12 text-4xl text-center font-bold border-b-2 pb-4">Wordle</div>
          <div className="flex flex-col items-center gap-4">
            {Array.from({length: ROWS}, (_, i) => (
              <div key={i} className="flex gap-1">
                {Array.from({length: TILES_PER_ROW}, (_, tiles_index) => (
                  <Tile 
                  key={tiles_index} 
                  letter={guesses[i][tiles_index]} 
                  color={colors[i][tiles_index]} 
                  isAnimating={i === animateRow} 
                  delay={tiles_index * 100}
                  rowIsRevealed={revealedRows.has(i)}/>
                ))}
              </div>
            ))}
          </div>
          {gameStatus !== 'playing' && (
            <div className={`text-center mt-6 text-2xl font-bold ${msg_colors[gameStatus]}`}>{messages[gameStatus]}</div>
          )}
        </div>
      </div>
    </>
    
  )
}
