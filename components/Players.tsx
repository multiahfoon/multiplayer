import React from 'react'

import { database } from '../firebase'
import { onChildAdded, onChildRemoved, onValue, ref } from 'firebase/database'
import { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { playersState } from '../atoms/playersAtom'

import { Player } from './Player'
import { playerIdState } from '../atoms/playerIdAtom'

export function Players() {
  const [players, setPlayers] = useRecoilState<any>(playersState)
  const playerId = useRecoilValue<any>(playerIdState)

  useEffect(() => {
    if (!playerId) return
    const allPlayersRef = ref(database, '/players')

    // listener for when a player joins the game
    onChildAdded(allPlayersRef, (snapshot) => {
      const newPlayer = snapshot.val()
      setPlayers({
        ...players,
        [newPlayer.id]: newPlayer,
      })
    })

    // listener for when players leaves the game
    onChildRemoved(allPlayersRef, (snapshot) => {
      const { [snapshot.val().id]: removedPlayer, ...everyoneElse } = players

      setPlayers(everyoneElse)
    })

    // listener for when player values change. E.g. score, name or color
    onValue(allPlayersRef, (snapshot) => setPlayers(snapshot.val()))
  }, [playerId])

  return (
    <>
      {players ? (
        Object.keys(players).map((key) => (
          <Player
            coins={players[key].coins}
            color={players[key].color}
            direction={players[key].direction}
            id={players[key].id}
            key={key}
            name={players[key].name}
            x={players[key].x}
            y={players[key].y}
          />
        ))
      ) : (
        <></>
      )}
    </>
  )
}
