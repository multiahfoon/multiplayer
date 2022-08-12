import { ref, update } from 'firebase/database'
import { useRecoilState, useRecoilValue } from 'recoil'
import { playerIdState } from '../atoms/playerIdAtom'
import { playerNameState } from '../atoms/playerNameAtom'
import { database } from '../firebase'

export function PlayerNameInput() {
  const playerId = useRecoilValue<string>(playerIdState)
  const [playerName, setPlayerName] = useRecoilState<string>(playerNameState)

  async function handleNameChange(e: any) {
    const newName = e.target.value
    const playerRef = ref(database, `/players/${playerId}`)
    setPlayerName(newName)

    await update(playerRef, {
      name: newName,
    })
  }

  return (
    <div className='name-input'>
      <input
        value={playerName}
        onChange={handleNameChange}
        maxLength={10}
        type='text'
      />
    </div>
  )
}
