import React, { useContext } from "react";
import { useEffect, useRef, useState, useLayoutEffect,  useCallback} from 'react';
import { Timer } from "components/ui/Timer";
import { useHistory } from "react-router-dom";
import { WebSocketContext } from "App";
import { LobbyContext, MinigameContext } from "components/routing/routers/AppRouter";
import { ActivationState } from "@stomp/stompjs";
import { Button } from "components/ui/Button";
import {PongGameBoard} from "./pongGame/PongGameBoard";
import 'styles/games/pongGame.scss'

export const PongGame = props => {

    const movement = useRef();

    const leftPaddleUp = useCallback(() => {
        movement.current.moveLeftPaddleUp();
        console.log("Left paddle up");
    }, []);

    const leftPaddleDown = useCallback(() => {
        movement.current.moveLeftPaddleDown();
        console.log("Left paddle down");
    }, []);

    const stopLeftPaddle = useCallback(() => {
        movement.current.stopLeftPaddle();
        console.log("Stop left paddle");
    }, []);

    const rightPaddleUp = useCallback(() => {
        movement.current.moveRightPaddleUp();
        console.log("Right paddle up");
    }, []);        

    const rightPaddleDown = useCallback(() => {
        movement.current.moveRightPaddleDown();
        console.log("Right paddle down");
    }, []);

    const stopRightPaddle = useCallback(() => {
        movement.current.stopRightPaddle();
        console.log("Stop right paddle");
    }, []);


    return (
        <div className="pong-game">
            <PongGameBoard ref={movement} />
            <div style={{display: "flex", flexDirection: "row"}}>
            <Button onClick={leftPaddleUp}>Left paddle up</Button>
            <Button onClick={leftPaddleDown}>Left paddle down</Button>
            <Button onClick={stopLeftPaddle}>Stop left paddle</Button>
            <Button onClick={rightPaddleUp}>Right paddle up</Button>
            <Button onClick={rightPaddleDown}>Right paddle down</Button>
            <Button onClick={stopRightPaddle}>Stop right paddle</Button>
            </div>
            
        </div>
    )
}

        