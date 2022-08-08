import { ref, update } from 'firebase/database'
import { useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { playerIdState } from '../atoms/playerIdAtom'
import { playersState } from '../atoms/playersAtom'
import { PLAYER_COLORS } from '../common/constants'
import { database } from '../firebase'

export function PlayerColorBtn() {
  const playerId = useRecoilValue<any>(playerIdState)
  const players = useRecoilValue<any>(playersState)

  async function handleColorBtnClick() {
    const playerRef = ref(database, `/players/${playerId}`)

    const mySkinIndex = PLAYER_COLORS.indexOf(players[playerId].color)

    const nextColor = PLAYER_COLORS[mySkinIndex + 1] || PLAYER_COLORS[0]

    await update(playerRef, {
      color: nextColor,
    })
  }

  return (
    <div>
      <button onClick={handleColorBtnClick}>Change Color</button>
    </div>
  )
}
