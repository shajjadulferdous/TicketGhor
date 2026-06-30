import ManageUsers from '@/components/ManageUsers';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import React from 'react';
import toast from 'react-hot-toast';

const UserPage = async() => {
    const {token }= await auth.api.getToken({
          headers: await headers()
    })

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json",
            Authorization: `Bearer ${token}`
        },
        cache:"no-cache"
    });
    if(!response.ok){
        toast.error("server error");
        return;
    }
    const users = await response.json();
    return (
        <ManageUsers initialUsers={users}></ManageUsers>
    );
};

export default UserPage;