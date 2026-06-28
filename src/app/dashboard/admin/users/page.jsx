import ManageUsers from '@/components/ManageUsers';
import React from 'react';
import toast from 'react-hot-toast';

const UserPage = async() => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json"
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