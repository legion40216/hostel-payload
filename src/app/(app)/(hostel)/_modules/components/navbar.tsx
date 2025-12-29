import React from 'react'
import NavLeft from './navbar/nav-left'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  return (
    <div className='flex items-center justify-between pt-4'>
      <NavLeft />

      <Button>
        Contact Us
      </Button>
    </div>
  )
}
