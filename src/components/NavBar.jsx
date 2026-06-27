'use client'
import { authClient } from '@/lib/auth-client';
import { Avatar, Button, Dropdown, Spinner } from '@heroui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import NavLink from './NavLink';
import { Playfair_Display } from 'next/font/google';

// Load the premium font
const playfair = Playfair_Display({ 
    subsets: ['latin'], 
    weight: ['600', '700', '900'],
    display: 'swap',
});

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    
    const { 
        data: session, 
        isPending, 
        error,
        refetch 
    } = authClient.useSession();
    
    const user = session?.user;
    
    const links = (
      <>
        <li>
          <NavLink href="/">Home</NavLink>
        </li>
        <li>
          <NavLink href={'/tickets'}>All Tickets</NavLink>
        </li>
        {user && (
          <li>
            <NavLink href="/add-tutor">Dashboard</NavLink>
          </li>
        )}
      </>
    );

    return (
    <nav className="sticky top-0 z-40 w-full border-b border-separator bg-[#F8F9FA] backdrop-blur-lg">
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          
          <div className="flex items-center gap-3">
            {/* Premium Font Logo Replacement */}
            <Link href="/" className={`${playfair.className} flex items-center select-none`}>
              <span className="text-2xl md:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#35858E] to-[#1e4e54]">
                Ticket
              </span>
              <span className="text-2xl md:text-3xl font-semibold text-slate-800 tracking-wide">
                Ghor
              </span>
            </Link>
          </div>
        </div>
        
        <ul className="hidden items-center gap-6 md:flex text-black">
            {links}
        </ul>
        
        <div className="hidden items-center gap-4 md:flex">
          {user ? ( 
            isPending ? (
              <div className='flex justify-center items-center'>
                  <Spinner size="xl" className='text-[#35858E]' />
              </div>
            ) : (
              <Dropdown>
                <Button aria-label="Menu" variant="ghost" size="icon" className="p-0 rounded-full">
                  <Avatar>
                    <Avatar.Image alt={user?.name} src={user?.image} />
                    <Avatar.Fallback>{user?.name.charAt(0) || 'S'}</Avatar.Fallback>
                  </Avatar>
                </Button>
                <Dropdown.Popover>
                  <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
                    <Dropdown.Item id="new-file">
                      <Link className="w-full block" href={'/my-profile'}>Profile</Link>
                    </Dropdown.Item>
                    <Dropdown.Item id="copy-link">
                      <button 
                        className="w-full text-left" 
                        onClick={async () => {
                          await authClient.signOut(); 
                          router.push('/');
                        }}
                      >
                        Logout
                      </button>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            )
          ) : (
            <>
              <NavLink href="/login">Login</NavLink>
              <NavLink href={'/register'}>Register</NavLink>
            </>
          )}
        </div>
      </header>
      
      {isMenuOpen && (
        <div className="border-t border-separator md:hidden">
          <ul className="flex flex-col gap-2 p-4">
            {links}
            <li className="mt-4 flex flex-col gap-2 border-t border-separator pt-4">
              {!user ? (
                <>
                  <NavLink href="/login" className="block py-2">
                    Login
                  </NavLink>
                  <NavLink href={'/register'}>Sign Up</NavLink>
                </>
              ) : (
                <>
                  <Link href={'/my-profile'}>Profile</Link>
                  <button 
                    className="text-left"
                    onClick={async () => {
                      await authClient.signOut(); 
                      router.push('/');
                    }}
                  >
                    Logout
                  </button>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav> 
    );
};

export default NavBar;