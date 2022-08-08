import {
  onChildAdded,
  onChildRemoved,
  onValue,
  ref,
  set,
} from 'firebase/database'
import React, { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { coinsState } from '../atoms/coinsAtom'
import { database } from '../firebase'
import { playerIdState } from '../atoms/playerIdAtom'
import {
  getKeyString,
  getRandomSafeSpot,
  randomFromArray,
} from '../lib/miscHandlers'

import { Coin } from './Coin'

export function Coins() {
  const [coins, setCoins] = useRecoilState<any>(coinsState)
  const playerId = useRecoilValue(playerIdState)

  useEffect(() => {
    const allCoinsRef = ref(database, '/coins')

    // listener for when coins value change
    onValue(allCoinsRef, (snapshot) => {
      setCoins(snapshot.val())
    })

    // listener for when new coins are added
    onChildAdded(allCoinsRef, (snapshot) => {
      const coin = snapshot.val()
      const key = getKeyString(coin.x, coin.y)

      const newCoin = { [key]: true }
      setCoins({ ...coins, ...newCoin })
    })

    // listener for when coins are removed
    onChildRemoved(allCoinsRef, (snapshot) => {
      const { x, y } = snapshot.val()

      const { [getKeyString(x, y)]: removedCoin, ...leftOverCoins } = coins

      setCoins(leftOverCoins)
    })

    if (playerId) placeCoin()
  }, [])

  async function placeCoin() {
    const { x, y } = getRandomSafeSpot()
    const coinRef = ref(database, `coins/${getKeyString(x, y)}`)
    const coinTimeouts = [2000, 3000, 4000, 5000]

    await set(coinRef, { x, y })

    setTimeout(() => {
      placeCoin()
    }, randomFromArray(coinTimeouts))
  }

  return (
    <>
      {coins &&
        Object.keys(coins).forEach((key) => (
          <Coin x={16 * coins[key].x} y={16 * coins[key].y - 4} />
        ))}
    </>
  )
}
