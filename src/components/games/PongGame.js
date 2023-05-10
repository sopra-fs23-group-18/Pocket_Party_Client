import React, { useContext } from "react";
import { useEffect, useRef, useState, useLayoutEffect,  useCallback} from 'react';
import { Timer } from "components/ui/Timer";
import { WebSocketContext } from "App";
import { LobbyContext, MinigameContext } from "components/routing/routers/AppRouter";
import { ActivationState } from "@stomp/stompjs";
import { Button } from "components/ui/Button";
import {PongGameBoard} from "./pongGame/PongGameBoard";
import 'styles/games/pongGame.scss'

export const PongGame = props => {

    const movement = useRef();

    const connections = useContext(WebSocketContext);
    const lobbyContext = useContext(LobbyContext);
    const minigameContext = useContext(MinigameContext);

    const onPlayerOneInput = (msg) => {
        const data = JSON.parse(msg.body)
        console.log(data);
        if (data.inputType === "PONG") {
            if (data.rawData.x === 1) {
                movement.current.moveLeftPaddleUp();
            } else if (data.rawData.x === -1) {
                movement.current.moveLeftPaddleDown();
            } else if (data.rawData.x === 0) {
                movement.current.stopLeftPaddle();
            }
        }
    }

    const onPlayerTwoInput = (msg) => {
        const data = JSON.parse(msg.body)
        console.log(data);
        if (data.inputType === "PONG") {
            if (data.rawData.x === 1) {
                movement.current.moveRightPaddleUp();
            } else if (data.rawData.x === -1) {
                movement.current.moveRightPaddleDown();
            } else if (data.rawData.x === 0) {
                movement.current.stopRightPaddle();
            }
        }
    }

    // const leftPaddleUp = useCallback(() => {
    //     movement.current.moveLeftPaddleUp();
    //     console.log("Left paddle up");
    // }, []);

    // const leftPaddleDown = useCallback(() => {
    //     movement.current.moveLeftPaddleDown();
    //     console.log("Left paddle down");
    // }, []);

    // const stopLeftPaddle = useCallback(() => {
    //     movement.current.stopLeftPaddle();
    //     console.log("Stop left paddle");
    // }, []);

    // const rightPaddleUp = useCallback(() => {
    //     movement.current.moveRightPaddleUp();
    //     console.log("Right paddle up");
    // }, []);        

    // const rightPaddleDown = useCallback(() => {
    //     movement.current.moveRightPaddleDown();
    //     console.log("Right paddle down");
    // }, []);

    // const stopRightPaddle = useCallback(() => {
    //     movement.current.stopRightPaddle();
    //     console.log("Stop right paddle");
    // }, []);

    useEffect(() => {
        if (connections.stompConnection.state === ActivationState.ACTIVE) {
            connections.stompConnection.publish({
                destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[0].id}/signal`,
                body: JSON.stringify({
                    signal: "START",
                    minigame: "PONG_GAME"
                })
            })
            connections.stompConnection.publish({
                destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[0].id}/signal`,
                body: JSON.stringify({
                    signal: "START",
                    minigame: "PONG_GAME"
                })
            })
        }
        return () => {
            if (connections.stompConnection.state === ActivationState.ACTIVE) {
                connections.stompConnection.publish({
                    destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[0].id}/signal`,
                    body: JSON.stringify({
                        signal: "STOP",
                        minigame: "PONG_GAME"
                    })
                })
                connections.stompConnection.publish({
                    destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[0].id}/signal`,
                    body: JSON.stringify({
                        signal: "STOP",
                        minigame: "PONG_GAME"
                    })
                })
            }
        }
    }, [])

    useEffect(() => {
        const player = props.playerIndex === 0 ? minigameContext?.minigame.team1Players[0] : minigameContext?.minigame.team2Players[0];
        if (connections.stompConnection.state === ActivationState.ACTIVE) {
            connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[0].id}/input`, onPlayerOneInput);
            connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[0].id}/input`, onPlayerTwoInput);
            return;
        }
        console.log("Subscribing to input");
        connections.stompConnection.onConnect = (_) => {
            connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[0].id}/input`, onPlayerOneInput);
            connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[0].id}/input`, onPlayerTwoInput);

            connections.stompConnection.publish({
                destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[0].id}/signal`,
                body: JSON.stringify({
                    signal: "START",
                    minigame: "PONG_GAME"
                })
            })
            connections.stompConnection.publish({
                destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[0].id}/signal`,
                body: JSON.stringify({
                    signal: "START",
                    minigame: "PONG_GAME"
                })
            })
        };
    }, [connections, lobbyContext, minigameContext])

    return (
        <div className="pong-game">
            <PongGameBoard ref={movement} />
            <div style={{display: "flex", flexDirection: "row"}}>
            {/* <Button onClick={leftPaddleUp}>Left paddle up</Button>
            <Button onClick={leftPaddleDown}>Left paddle down</Button>
            <Button onClick={stopLeftPaddle}>Stop left paddle</Button>
            <Button onClick={rightPaddleUp}>Right paddle up</Button>
            <Button onClick={rightPaddleDown}>Right paddle down</Button>
            <Button onClick={stopRightPaddle}>Stop right paddle</Button> */}
            </div>
            
        </div>
    )
}

        