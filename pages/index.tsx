import Head from 'next/head'
import type { NextPage } from 'next'

import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { onDisconnect, ref, remove, set, update } from 'firebase/database'
import { useEffect, useRef, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { auth, database } from '../firebase'

import {
  createName,
  getKeyString,
  getRandomSafeSpot,
  isSolid,
  randomFromArray,
} from '../lib/miscHandlers'

import { ARROW_KEYS, PLAYER_COLORS } from '../common/constants'
import { playerIdState } from '../atoms/playerIdAtom'
import { playerNameState } from '../atoms/playerNameAtom'
import { playersState } from '../atoms/playersAtom'

import { Coins } from '../components/Coins'
import { PlayerColorBtn } from '../components/PlayerColorBtn'
import { PlayerNameInput } from '../components/PlayerNameInput'
import { Players } from '../components/Players'
import { coinsState } from '../atoms/coinsAtom'
import { Coins as CoinsType } from '../types'

const Home: NextPage = () => {
  const [, setPlayerName] = useRecoilState<any>(playerNameState)
  const [playerId, setPlayerId] = useRecoilState<any>(playerIdState)
  const [players, setPlayers] = useRecoilState<any>(playersState)
  const coins = useRecoilValue<CoinsType>(coinsState)
  const keyPressed = useRef<boolean>(true)

  // onMount sign in as anonymous user
  useEffect(() => {
    if (!playerId) handleAuth()
  }, [])

  // key press event listeners
  useEffect(() => {
    if (!playerId || !players) return
    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', keyDown)
      window.removeEventListener('keyup', keyUp)
    }
  }, [playerId, players])

  async function keyDown({ key }: { key: string }) {
    if (ARROW_KEYS.hasOwnProperty(key) && keyPressed) {
      await arrowKeyPress(ARROW_KEYS[key].x, ARROW_KEYS[key].y)

      keyPressed.current = false
    }
  }

  function keyUp({ key }: { key: string }) {
    if (ARROW_KEYS[key]) {
      keyPressed.current = true
    }
  }

  async function arrowKeyPress(xChange = 0, yChange = 0) {
    const newX = players[playerId].x + xChange
    const newY = players[playerId].y + yChange

    if (!isSolid(newX, newY)) {
      const newPosition = {
        x: newX,
        y: newY,
        direction: xChange === 1 ? 'right' : 'left',
      }

      setPlayers({
        ...players,
        [playerId]: newPosition,
      })

      await update(ref(database, `/players/${playerId}`), newPosition)

      await attemptGrabCoin(newX, newY)
    }
  }

  async function handleAuth() {
    await signInAnonymously(auth)

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // If user successfully logged in
        // Post initial player data
        const id = user.uid
        const name = createName()

        const playerRef = ref(database, `/players/${id}`)

        const { x, y } = getRandomSafeSpot()

        setPlayerId(id)
        setPlayerName(name)

        await set(playerRef, {
          id,
          name,
          direction: 'right',
          color: randomFromArray(PLAYER_COLORS),
          x,
          y,
          coins: 0,
        })

        //Remove current player when they leave the game
        await onDisconnect(playerRef).remove()
      }
    })
  }

  async function attemptGrabCoin(x: any, y: any) {
    const key = getKeyString(x, y)

    if (coins[key]) {
      // If player position equal to coin position
      // Remove coin from current game session
      await remove(ref(database, `coins/${key}`))
      // Update player coin count
      await update(ref(database, `/players/${playerId}`), {
        coins: players[playerId].coins + 1,
      })
    }
  }

  return (
    <div>
      <Head>
        <title>Multiplayer</title>
        <meta name='description' content='Multiplayer' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className='game-container'>
        <Players />
        <Coins />
      </div>

      <div className='player-info'>
        <PlayerNameInput />
        <PlayerColorBtn />
      </div>
    </div>
  )
}

export default Home
