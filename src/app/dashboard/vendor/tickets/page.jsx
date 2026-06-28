import BusCard from '@/components/BusCard';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

const MyTicketPage = async() => {
    const session = await auth.api.getSession({
        headers:await headers()
    })
    const user =  session?.user;
    if (!user){
        redirect('/login');
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-products/${user?.email}`,
        {   method:"GET",
            headers:{
                "Content-Type":"application/json"
            },
            cache:"no-cache"
        }
    )
    if(!response.ok){
          return <div>sever error</div>;
    }
    const mytickets = await response.json();
    
    return (
        <div>
            <h1 className='font-bold text-4xl text-center'>My Tickets</h1>
            <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {
                mytickets.map( ticket => <BusCard key={ticket?._id} listing={ticket}></BusCard>)
            }
            </main>
        </div>
    );
};

export default MyTicketPage;
