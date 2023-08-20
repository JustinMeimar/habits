
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import "../globals.css"

const HomeHeader: React.FC = () => {
     
    const userName = useSelector((state: RootState) => state.user.username);
    
    return (
        <div className="home-header-container">
            Welcome <div className="home-header-username"> {userName} </div>
        </div>
    );
}

export default HomeHeader;