"use client"

import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { increment } from '../state/counterSlice';
import { RootState } from '../state/store'

const HabitsHome: React.FC = () => {    
    
    // Get the count from the Redux state
    const count = useSelector((state: RootState) => state.counter.count);
    const userName = useSelector((state: RootState) => state.user.username);

    const rootState = useSelector((state: RootState) => state);
    

    useEffect(() => {
        console.log("root state in habitsHome:", rootState);
    }, [])

    // Get the dispatch function
    const dispatch = useDispatch();

    return (
        <div className="redux-container">
            This is the habits home
            <div>
                <h1>Hello, {userName}</h1>
                <h1>Count: {count}</h1>
                <button onClick={() => dispatch(increment())}>Increment</button>
            </div>
        </div>
    );
}

export default HabitsHome;