// Purpose: Timer component that counts down from a given time
import React, { useState, useEffect } from 'react';
import 'styles/ui/Timer.scss';

export const Timer = props => {
    const [time, setTime] = useState(props.children);
    const [isActive, setIsActive] = useState(true);
    
    React.useEffect(() => {
        let interval = null;
        if (isActive && time > 0) {
            interval = setInterval(() => {
                setTime(time - 1);
            }, 1000);
        } else if (!isActive && time !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    });

    return (
        <div className="timer">
            <div className="timer-display">
                Time left: {time} 
            </div>  
        </div>
    );

}