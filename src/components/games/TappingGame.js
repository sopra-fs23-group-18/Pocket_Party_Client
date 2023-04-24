import React, {useContext} from "react";
import 'styles/games/tappingGame.scss';
import { useEffect, useRef, useState } from 'react';
import { Timer } from "components/ui/Timer";

export const TappingGame = props => {

    const [count1, setCount1] = useState(0);
    const [count2, setCount2] = useState(0);

    // Todo: update the progress bar based on the count received from the mobile
    // Need to use WebRTC connection to get the count from the mobile

    useEffect(() => {
        // update progress bar respectively
        document.querySelectorAll('.progress')[0].style.height = `${count1/2}%`;
        document.querySelectorAll('.progress')[1].style.height = `${count2/2}%`;
    }, [count1, count2]);
   
    // update the counter when the button is clicked
    const handleClick1 = () => {
        setCount1(count1 + 1);
    }  
    const handleClick2 = () => {
        setCount2(count2 + 1);
    }

    return (
        <div className="tapping-game">
            <h1>Tapping Game</h1>
            <div className="tapping-game__container">
                <div class="bar">
                    <div class="progress">
                    <div class="count">{count1}</div>
                    </div>
                </div>
                <div class="bar">
                    <div class="progress">
                    <div class="count">{count2}</div>
                    </div>
                </div>
            </div>
            <button onClick={handleClick1}>Click me</button>
            <button onClick={handleClick2}>Click me</button>
            <Timer>10</Timer>
        </div>

    ); 

}