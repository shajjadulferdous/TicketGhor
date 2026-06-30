
import ManageTickets from '@/components/ManageTicket';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import React from 'react';
import toast from 'react-hot-toast';

const ManageTicketPage = async() => {
    const {token }= await auth.api.getToken({
        headers: await headers()
    })
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pending-tickets`,{
        method:"GET",
        headers:{
            headers:await headers(),
            Authorization: `Bearer ${token}`
        },
        cache:'no-store'
    })
    if (!response.ok){
        toast.error("server error");
        return;
    }
    const tickets = await response.json();
    return (
        // <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
        //     {/* <ManageTickets initialTickets={tickets} />; */}
        //     {
        //         tickets.map( ticket => <ManageTickets key={ticket?._id} initialTickets={ticket}/>)
        //     }
        // </div>
         <ManageTickets initialTickets={tickets}/>
    );
};

export default ManageTicketPage;