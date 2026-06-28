
import ManageTickets from '@/components/ManageTicket';
import { headers } from 'next/headers';
import React from 'react';
import toast from 'react-hot-toast';

const ManageTicketPage = async() => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pending-tickets`,{
        method:"GET",
        headers:{
            headers:await headers()
        },
        cache:'no-cache'
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