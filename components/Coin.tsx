import React from 'react'

export function Coin({ x, y }: any) {
  return (
    <div
      className='Coin grid-cell'
      style={{ transform: `translate3d(${x}px, ${y}px,0)` }}
    >
      <div className='Coin_shadow grid-cell' />
      <div className='Coin_sprite grid-cell' />
    </div>
  )
}
