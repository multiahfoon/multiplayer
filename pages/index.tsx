import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import {
  onChildAdded,
  onChildRemoved,
  onDisconnect,
  onValue,
  ref,
  remove,
  set,
  update,
} from 'firebase/database'

import {
  createName,
  getKeyString,
  getRandomSafeSpot,
  isSolid,
  randomFromArray,
} from '../lib/miscHandlers'

import { auth, database } from '../firebase'

import { ARROW_KEYS, PLAYER_COLORS } from '../common/constants'
import { playerIdState } from '../atoms/playerIdAtom'
import { useRecoilState } from 'recoil'

const Home: NextPage = () => {
  const [keyPressed, setKeyPressed] = useState<boolean>(true)

  const coinElements = useRef<any>({})
  const coins = useRef<any>({})
  const gameContainer = useRef<any>() // .game-container
  const playerElements = useRef<any>({})
  const playerNameInput = useRef<any>() // #player-name
  const players = useRef<any>({})
  const [playerId, setPlayerId] = useRecoilState(playerIdState)

  // onMount sign in as anonymous user
  useEffect(() => {
    handleAuth()
  }, [])

  useEffect(() => {
    if (playerId) initGame()
  }, [playerId])

  // key press event listeners
  useEffect(() => {
    window.addEventListener('keydown', keydownFunction)
    window.addEventListener('keyup', keyupFunction)

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', keydownFunction)
      window.removeEventListener('keyup', keyupFunction)
    }
  }, [])

  async function handleColorBtnClick() {
    const playerRef = ref(database, `/players/${playerId}`)

    const mySkinIndex = PLAYER_COLORS.indexOf(players.current[playerId].color)

    const nextColor = PLAYER_COLORS[mySkinIndex + 1] || PLAYER_COLORS[0]

    await update(playerRef, {
      color: nextColor,
    })
  }

  // If pressed key is our target key then set to true
  function keydownFunction({ key }: { key: string }) {
    if (ARROW_KEYS.hasOwnProperty(key) && keyPressed) {
      // update position
      ARROW_KEYS
      keyArrowPress(ARROW_KEYS[key].x, ARROW_KEYS[key].y)
      setKeyPressed(false)
    }
  }

  // If released key is our target key then set to false
  const keyupFunction = ({ key }: { key: string }) => {
    if (ARROW_KEYS[key]) {
      setKeyPressed(true)
    }
  }

  function keyArrowPress(xChange = 0, yChange = 0) {
    const playerRef = ref(database, `/players/${playerId}`)

    const newX = players.current[playerId].x + xChange
    const newY = players.current[playerId].y + yChange
    if (!isSolid(newX, newY)) {
      //move to the next space
      players.current[playerId].x = newX
      players.current[playerId].y = newY
      if (xChange === 1) {
        players.current[playerId].direction = 'right'
      }
      if (xChange === -1) {
        players.current[playerId].direction = 'left'
      }

      set(playerRef, players.current[playerId])

      attemptGrabCoin(newX, newY)
    }
  }

  async function handleAuth() {
    await signInAnonymously(auth)

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        //You're logged in!
        const id = user.uid
        setPlayerId(id)

        const name = createName()
        playerNameInput.current = name

        const playerRef = ref(database, `/players/${id}`)

        const { x, y } = getRandomSafeSpot()

        await set(playerRef, {
          id,
          name,
          direction: 'right',
          color: randomFromArray(PLAYER_COLORS),
          x,
          y,
          coins: 0,
        })

        //Remove me from Firebase when I disconnect
        await onDisconnect(playerRef).remove()

        // Begin the game now that we are signed in
      }
    })
  }

  async function handleNameChange(e: any) {
    const playerRef = ref(database, `/players/${playerId}`)

    const newName = e.target.value || createName()
    playerNameInput.current = newName

    await update(playerRef, {
      name: newName,
    })
  }

  async function attemptGrabCoin(x: any, y: any) {
    const key = getKeyString(x, y)

    if (coins.current[key]) {
      const playerRef = ref(database, `/players/${playerId}`)

      // Remove this key from data, then uptick Player's coin count
      await remove(ref(database, `coins/${key}`))

      await update(playerRef, {
        coins: players.current[playerId].coins + 1,
      })
    }
  }

  async function placeCoin() {
    const { x, y } = getRandomSafeSpot()
    const coinRef = ref(database, `coins/${getKeyString(x, y)}`)

    await set(coinRef, { x, y })

    const coinTimeouts = [2000, 3000, 4000, 5000]

    setTimeout(() => {
      placeCoin()
    }, randomFromArray(coinTimeouts))
  }

  async function initGame() {
    const allPlayersRef = ref(database, '/players')
    const allCoinsRef = ref(database, '/coins')

    onChildAdded(allPlayersRef, (snapshot) => {
      //Fires whenever a new node is added the tree
      const addedPlayer = snapshot.val()

      const characterElement = document.createElement('div')
      characterElement.classList.add('Character', 'grid-cell')

      if (addedPlayer.id === playerId) {
        characterElement.classList.add('you')
      }

      characterElement.innerHTML = `
          <div class="Character_shadow grid-cell"></div>
          <div class="Character_sprite grid-cell"></div>
          <div class="Character_name-container">
            <span class="Character_name">${addedPlayer.name}</span>
            <span class="Character_coins">${addedPlayer.coins}</span>
          </div>
          <div class="Character_you-arrow"></div>
        `

      playerElements.current[addedPlayer.id] = characterElement

      //Fill in some initial state
      characterElement.setAttribute('data-color', addedPlayer.color)
      characterElement.setAttribute('data-direction', addedPlayer.direction)
      const left = 16 * addedPlayer.x + 'px'
      const top = 16 * addedPlayer.y - 4 + 'px'
      characterElement.style.transform = `translate3d(${left}, ${top}, 0)`

      gameContainer.current.appendChild(characterElement)
    })

    onValue(allPlayersRef, (snapshot) => {
      //Fires whenever a change occurs
      players.current = snapshot.val() || {}
      Object.keys(players.current).forEach((key) => {
        const characterState = players.current[key]
        let el = playerElements.current[key]

        // Now update the DOM
        el.querySelector('.Character_name').innerText = characterState.name
        el.querySelector('.Character_coins').innerText = characterState.coins

        el.setAttribute('data-color', characterState.color)
        el.setAttribute('data-direction', characterState.direction)
        const left = 16 * characterState.x + 'px'
        const top = 16 * characterState.y - 4 + 'px'
        el.style.transform = `translate3d(${left}, ${top}, 0)`
      })
    })

    // Remove character DOM element after they leave
    onChildRemoved(allPlayersRef, (snapshot) => {
      const removedKey = snapshot.val().id

      gameContainer.current.removeChild(playerElements.current[removedKey])
      delete playerElements.current[removedKey]
    })

    // This block will remove coins.current from local state when Firebase `coins.current` value updates
    onValue(allCoinsRef, (snapshot) => {
      coins.current = snapshot.val() || {}
    })

    onChildAdded(allCoinsRef, (snapshot) => {
      const coin = snapshot.val()
      const key = getKeyString(coin.x, coin.y)
      coins.current[key] = true

      // Create the DOM Element
      const coinElement = document.createElement('div')
      coinElement.classList.add('Coin', 'grid-cell')
      coinElement.innerHTML = `
        <div class="Coin_shadow grid-cell"></div>
        <div class="Coin_sprite grid-cell"></div>
      `

      // Position the Element
      const left = 16 * coin.x + 'px'
      const top = 16 * coin.y - 4 + 'px'
      coinElement.style.transform = `translate3d(${left}, ${top}, 0)`

      // Keep a reference for removal later and add to DOM
      coinElements.current[key] = coinElement
      gameContainer.current.appendChild(coinElement)
    })

    onChildRemoved(allCoinsRef, (snapshot) => {
      const { x, y } = snapshot.val()
      const keyToRemove = getKeyString(x, y)

      gameContainer.current.removeChild(coinElements.current[keyToRemove])
      delete coinElements.current[keyToRemove]
    })

    placeCoin()
  }

  return (
    <div>
      <Head>
        <title>Multiplayer</title>
        <meta name='description' content='Multiplayer' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div ref={gameContainer} className='game-container' />
      <div className='player-info'>
        <div>
          <label>Your Name</label>
          <input
            value={playerNameInput.current}
            onChange={handleNameChange}
            maxLength={10}
            type='text'
          />
        </div>

        <div>
          <button onClick={handleColorBtnClick}>Change Color</button>
        </div>
      </div>
    </div>
  )
}

export default Home
