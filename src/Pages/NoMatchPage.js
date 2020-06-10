import React from 'react';
import { useLocation } from 'react-router-dom';


function NoMatchPage() {

    let location = useLocation();

    return (
        <div>
            No match for {location.pathname}
        </div>

    )
}


export default NoMatchPage;