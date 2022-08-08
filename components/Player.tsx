import React from 'react'

import { useRecoilValue } from 'recoil'

import { playerIdState } from '../atoms/playerIdAtom'
import { Player } from '../types'

export function Player({ coins, color, direction, id, name, x, y }: Player) {
  const playerId = useRecoilValue(playerIdState)
  // @TODO fix: id is read as a number but only in player component
  const uuid = `${id}`

  return (
    <div
      className={`Character grid-cell ${uuid === playerId ? 'you' : ''}
          data-color=${color}
          data-direction=${direction}
          `}
      style={{ transform: `translate3d(${16 * x}px,${16 * y - 4}px,0)` }}
    >
      <div className='Character_shadow grid-cell' />
      <div className='Character_sprite grid-cell' />
      <div className='Character_name-container'>
        <span className='Character_name'>{name}</span>
        <span className='Character_coins'>{coins}</span>
      </div>
      <div className='Character_you-arrow' />
    </div>
  )
}
