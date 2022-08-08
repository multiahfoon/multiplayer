import React from 'react'

import { database } from '../firebase'
import { onChildAdded, onChildRemoved, onValue, ref } from 'firebase/database'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'

import { playersState } from '../atoms/playersAtom'

import { Player } from './Player'

export function Players() {
  const [players, setPlayers] = useRecoilState<any>(playersState)

  useEffect(() => {
    const allPlayersRef = ref(database, '/players')

    // listener for when a player joins the game
    onChildAdded(allPlayersRef, (snapshot) => {
      const newPlayer = snapshot.val()
      setPlayers({
        ...players,
        newPlayer,
      })
    })

    // listener for when players values change. E.g. score, name or color
    onValue(allPlayersRef, (snapshot) => setPlayers(snapshot.val()))

    // listener for when players leaves the game
    onChildRemoved(allPlayersRef, (snapshot) => {
      const { [snapshot.val().id]: removedPlayer, ...everyoneElse } = players

      setPlayers(everyoneElse)
    })
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
