'use client'
import React from 'react'
import { Auth } from '../context/AuthContext';
import Link from 'next/link';

const navbar = () => {
  const { user } = Auth();

  return (
    <nav className='min-h-[10vh] flex justify-between items-end py-2'>
        <div className='text-md md:text-xl font-bold text-sky-400'>
            System-300
        </div>

{user && <div className='flex gap-3 items-end'>
    <Link href='/' className='text-blue-200'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 md:size-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>  
    </Link>
    <Link href='/profile'>
            {user?.photoURL ? 
                <img src={user.photoURL} className='rounded-full flex justify-center items-center w-6 h-6 md:w-8 md:h-8' alt="" />:
                user?.displayName ?
                    <div className='uppercase rounded-full flex justify-center items-center w-6 h-6 md:w-8 md:h-8 text-sm bg-red-700'>
                        {user?.displayName[0]}
                    </div>:
                    user?.email ?
                    <div className='uppercase rounded-full flex justify-center items-center w-6 h-6 md:w-8 md:h-8 text-sm bg-red-700'>
                        {user.email[0]}
                    </div>:
                <div></div>
            }

        </Link>   
</div>}

    </nav>
  )
}

export default navbar