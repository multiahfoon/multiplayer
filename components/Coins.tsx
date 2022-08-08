import {
  onChildAdded,
  onChildRemoved,
  onValue,
  ref,
  update,
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

import { Coins } from '../types'

export function Coins() {
  const [coins, setCoins] = useRecoilState<Coins>(coinsState)
  const playerId = useRecoilValue(playerIdState)

  useEffect(() => {
    if (!playerId) return

    const allCoinsRef = ref(database, '/coins')

    // listener for when coins value change
    onValue(allCoinsRef, (snapshot) => {
      setCoins(snapshot.val())
    })

    // listener for when new coins are added
    onChildAdded(allCoinsRef, (snapshot) => {
      const coin = snapshot.val()
      const key = getKeyString(coin.x, coin.y)

      const newCoin = { [key]: { x: coin.x, y: coin.y } }

      setCoins({ ...coins, ...newCoin })
    })

    // listener for when coins are removed
    onChildRemoved(allCoinsRef, (snapshot) => {
      const { x, y } = snapshot.val()

      const { [getKeyString(x, y)]: removedCoin, ...leftOverCoins } = coins

      setCoins(leftOverCoins)
    })

    placeCoin()
  }, [playerId])

  async function placeCoin() {
    const { x, y } = getRandomSafeSpot()
    const coinRef = ref(database, `coins/${getKeyString(x, y)}`)
    const coinTimeouts = [2000, 3000, 4000, 5000]

    await update(coinRef, { x, y })

    setTimeout(() => {
      placeCoin()
    }, randomFromArray(coinTimeouts))
  }

  return (
    <>
      {coins ? (
        Object.keys(coins).map((key) => (
          <Coin key={key} x={16 * coins[key].x} y={16 * coins[key].y - 4} />
        ))
      ) : (
        <></>
      )}
    </>
  )
}
