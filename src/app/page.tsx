'use client'

import { useState, useEffect, useRef } from "react";
// import { flushSync } from 'react-dom';

const ROWS = 6;
const TILES_PER_ROW = 5;
const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
]

const getColorClass = (color?: string) => {
  if (color === 'green') return 'bg-[#6aaa64]'
  if (color === 'yellow') return 'bg-[#c9b458]'
  if (color === 'gray') return 'bg-[#787c7e]'
  return 'bg-gray-400'
}

function Key({ letter, onClick, color }: { letter: string, onClick: (letter: string) => void, color?: string }) {
  const isWide = letter === 'ENTER' || letter === 'BACKSPACE'
  const width = isWide 
  ? 'w-16 sm:w-20 md:w-24 lg:w-32' 
  : 'w-7 sm:w-8 md:w-10 lg:w-12'
  const bgColor = getColorClass(color)

  const classes = `border-2 ${width} ${bgColor} h-10 sm:h-11 md:h-12 text-xs sm:text-sm md:text base
  p-1 hover:brightness-110 active:scale-95 transition-transform`
  return (
    <button onClick={() => onClick(letter)} className={classes}>
      {letter === 'BACKSPACE' ? (
        <>
        <span className="hidden sm:inline text-xs sm:text-sm">BACKSPACE</span>
        <span className="sm:hidden">←</span>
        </>
      ) : letter === 'ENTER' ? (
        <>
        <span className="hidden sm:inline text-xs sm:text-sm">ENTER</span>
        <span className="sm:hidden text-xl">↵</span>
        </>
      ) : (
        letter
      )}
    </button>
  )
}

function Tile({ letter, color, isAnimating, delay, rowIsRevealed, isPop }:
  { letter?: string, color?: string, isAnimating?: boolean, delay?: number, rowIsRevealed?: boolean, isPop?: boolean }) {
  const bgColor = getColorClass(color)
  const style = { animationDelay: `${delay}ms`}
  let borderColor = ''

  if (!letter) {
    borderColor = 'border-gray-300' 
  } else if (!rowIsRevealed) {
    borderColor = 'border-gray-500'
  } else {
    borderColor = 'border-gray-600' 
  }
  
  const classes = `flex justify-center items-center border-2 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 
  text-xl sm:text-2xl uppercase
  ${borderColor} ${rowIsRevealed ? 'text-white' : 'text-gray-900'}
  ${rowIsRevealed ? bgColor : ''} ${isAnimating ? 'animate-flip' : ''}
  ${isPop ? 'animate-pop' : ''}`

  return (
    <div className={classes} style={style}>{letter}</div>
  )
}

export default function Game() {
  const [guesses, setGuesses] = useState(Array(6).fill(''))
  const [colors, setColors] = useState(Array(6).fill(null).map(() => Array(5).fill(null)))
  const [currRow, setCurrRow] = useState< number >(0)
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const [animateRow, setAnimateRow] = useState< number | null >(null)
  const [revealedRows, setRevealedRows] = useState<Set<number>>(new Set())
  const [target, setTarget] = useState('')
  const [loading, setLoading] = useState(true)
  const [keyColors, setKeyColors] = useState<{ [key:string]: string }>({})
  const [validWords, setValidWords] = useState<Set<string>>(new Set())
  const [shakingRow, setShakingRow] = useState<number | null>(null)
  const [notification, setNotification] = useState<string | null>(null)

  const guessesRef = useRef(guesses)
  const rowRef = useRef(currRow)
  const colorsRef = useRef(colors)
  const gameRef = useRef(gameStatus)
  const targetRef = useRef(target)
  const loadingRef = useRef(loading)
  const validWordsRef = useRef(validWords)

  guessesRef.current = guesses
  rowRef.current = currRow
  colorsRef.current = colors
  gameRef.current = gameStatus
  targetRef.current = target
  loadingRef.current = loading
  validWordsRef.current = validWords

  const handleKeyClick = (key: string) => {
    if (loading || gameStatus !== 'playing') return
    
    if (key === 'ENTER') {
      submitGuess()
    } else if (key === 'BACKSPACE') {
      deleteLetter()
    } else {
      addLetter(key)
    }
  }

  const updateKeyColors = (guess: string, rowColors: string[]) => {
    setKeyColors(prevKeyColors => { 
      const newKeyColors = { ...prevKeyColors }
      
      for (let i = 0; i < guess.length; i++) {
        const letter = guess[i].toUpperCase()
        const color = rowColors[i]

        if (!newKeyColors[letter] || 
            (color === 'green') ||
            (color === 'yellow' && newKeyColors[letter] !== 'green')) {
          newKeyColors[letter] = color
        }
      }
      
      return newKeyColors
    })
  }

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 2000)
  }

  const checkGuess = (guess: string, target: string) => {

    let i = 0
    const letterCount: { [key: string]: number } = {}
    for (const char of target) {
      letterCount[char] = (letterCount[char] || 0) + 1
    }

    const newColors = [...colorsRef.current]

    for(i = 0; i < TILES_PER_ROW; i++) {
      if (guess[i].toUpperCase() === target[i]){
        newColors[rowRef.current][i] = 'green'
        letterCount[target[i]]--
      } else {
        newColors[rowRef.current][i] = 'gray'
      }
    }

    for(i = 0; i < TILES_PER_ROW; i++) {
      if (newColors[rowRef.current][i] != 'green' && letterCount[guess[i].toUpperCase()] > 0) {
        newColors[rowRef.current][i] = 'yellow'
        letterCount[guess[i].toUpperCase()]--
      } 
    }
    return newColors[rowRef.current]
  }

  const addLetter = (letter: string) => {
    if(guessesRef.current[rowRef.current].length < 5) {
      const newGuesses = [...guessesRef.current]
      newGuesses[rowRef.current] = newGuesses[rowRef.current] + letter
      setGuesses(newGuesses)
    }
  }

  const submitGuess = () => {
    if(guessesRef.current[rowRef.current].length === 5) {
      const current = rowRef.current
      const guess = guessesRef.current[rowRef.current].toUpperCase()
      
      if (!validWordsRef.current.has(guess)) {
        setShakingRow(current)
        showNotification("Not in word list")
        setTimeout(() => setShakingRow(null), 500)
        return
      }
      const rowColors = checkGuess(guessesRef.current[rowRef.current], targetRef.current)

      const newColors = [...colorsRef.current] 
      newColors[current] = rowColors
      setColors(newColors)
      updateKeyColors(guessesRef.current[rowRef.current], rowColors)

      setAnimateRow(current)

      setTimeout(() => {
        setAnimateRow(null)
        setRevealedRows(prev => new Set(prev).add(current))
      }, 900)

      if (guessesRef.current[rowRef.current].toUpperCase() === targetRef.current) {
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

  const deleteLetter = () => {
    if(guessesRef.current[rowRef.current].length > 0) {
      const updatedGuesses = [...guessesRef.current]
      updatedGuesses[rowRef.current] = guessesRef.current[rowRef.current].slice(0, -1)
      setGuesses(updatedGuesses)
    }
  }

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch('/api/words')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json()
        setValidWords(new Set(result.words))

      } catch (err) {
        console.error('Error loading word list:', err)
      }
    }
    
    fetchWords()
  }, [])

  useEffect(() => {
    const handleWord = async () => {
        try {
          const response = await fetch('api')
        if(!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json()
        setTarget(result.word);
      } catch (err) {
        console.error('Error: ', err)
      } finally {
        setLoading(false)
      }
    }
    handleWord()
  }, [])

  useEffect(() => {
    const handleTyping = async (e: KeyboardEvent) => {
      if (loadingRef.current || gameRef.current !== 'playing') return

      if(/^[a-zA-Z]$/.test(e.key)) {
        addLetter(e.key)
      }

      if(e.key === 'Enter') {
        submitGuess()
      }

      if(e.key == 'Backspace') {
        deleteLetter()
      }
    }
    window.addEventListener('keydown', handleTyping)

    return () => {
      window.removeEventListener('keydown', handleTyping)
    }
  }, [])

  useEffect(() => {
    if (gameStatus === 'won') {
      showNotification('You won! 🎉')
    } else if (gameStatus === 'lost') {
      showNotification(`Game over! The word was ${target}`)
    }
  }, [gameStatus, target])



  return (
    <>
      <div className='bg-gray-100 min-h-[100dvh] flex flex-col justify-center items-center'>
        <div className="max-w-lg w-full p-2 sm:p-4 md:p-6">
          <div className="mb-6 sm:mb-8 md:mb-12 
          text-2xl sm:text-3xl md:text-4xl
          text-center font-bold border-b-2 
          pb-2 sm:pb-3 md:pb-4">
          Wordle
          </div>
          {notification && (
            <div className="fixed top-4 sm:top-6 md:top-0 
            left-1/2 -translate-x-1/2 z-50 
          bg-gray-800 text-white px-4 py-2 sm:px-6 sm:py-3
            rounded-lg shadow-lg text-sm sm:text-base font-semibold animate-toast">
            {notification}
            </div>
          )}
          <div className="flex flex-col items-center gap-2 sm:gap3 md:gap-4">
            {Array.from({length: ROWS}, (_, i) => (
              <div key={i} className={`flex gap-0.5 md:gap-1 ${i === shakingRow ? 'animate-shake' : ''}`}>
                {Array.from({length: TILES_PER_ROW}, (_, tiles_index) => (
                  <Tile 
                  key={`${i}-${tiles_index}-${guesses[i][tiles_index] || 'empty'}`}
                  letter={guesses[i][tiles_index]} 
                  color={colors[i][tiles_index]} 
                  isAnimating={i === animateRow} 
                  delay={tiles_index * 100}
                  rowIsRevealed={revealedRows.has(i)}
                  isPop={guesses[i][tiles_index] && !revealedRows.has(i)}/>
                  ))}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-0.5 sm:gap-1 mt-8">
            {KEYBOARD_ROWS.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1">
                {row.map(key => (
                  <Key 
                  onClick={handleKeyClick} 
                  key={key} 
                  letter={key}
                  color={keyColors[key]}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
    
  )
}
