import { DatabaseReference } from 'firebase/database'
import { atom } from 'recoil'

export const playerRefState = atom({
  key: 'playerIdState',
  default: '',
})
