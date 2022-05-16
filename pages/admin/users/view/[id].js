import React from 'react';
import AdminLayout from '../../../../components/adminLayout';

import {useRouter} from "next/router"
 
const UserView = () => {

    const router = useRouter();

    
    React.useEffect(()=>{


    })
    
    return (
        <AdminLayout>
             Admin User View {router.query.id}
                   
        </AdminLayout>
    );
}

export default UserView;
