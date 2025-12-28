import React from 'react'
import Link from 'next/link'
export default function NavLeft() {
  return (
    <div>
      <Link href="/">
        <h1 className='text-2xl font-bold'>HostelHub</h1>
      </Link>
    </div>
  )
}
