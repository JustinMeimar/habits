import React, { useState, useEffect } from 'react';
import "../globals.css"

const HomeHeader: React.FC = () => {
     
    return (
        <div className="home-header-container">
            Welcome <div className="home-header-username"> fifferfaffer </div>
        </div>
    );
}

export default HomeHeader;