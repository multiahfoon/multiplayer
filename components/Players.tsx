import React from 'react'

import { database } from '../firebase'
import { onChildAdded, onValue, ref } from 'firebase/database'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'

import { playersState } from '../atoms/playersAtom'

import { Player } from './Player'

export function Players() {
  const [players, setPlayers] = useRecoilState<any>(playersState)

  useEffect(() => {
    const allPlayersRef = ref(database, '/players')

    // listener for when new player added
    onChildAdded(allPlayersRef, (snapshot) => {
      const newPlayer = snapshot.val()
      setPlayers({
        ...players,
        newPlayer,
      })
    })

    // listener for when players values change
    onValue(allPlayersRef, (snapshot) => setPlayers(snapshot.val() || {}))
  }, [])

  return (
    <>
      {players &&
        Object.keys(players).forEach((key) => {
          return (
            <Player
              key={key}
              coins={players[key].coins}
              color={players[key].color}
              direction={players[key].direction}
              id={players[key].id}
              name={players[key].name}
              x={players[key].x}
              y={players[key].y}
            />
          )
        })}
    </>
  )
}
