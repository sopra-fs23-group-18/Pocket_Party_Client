import React, { useContext } from "react";
import 'styles/games/tappingGame.scss';
import { useEffect, useRef, useState } from 'react';
import { Timer } from "components/ui/Timer";
import { useHistory } from "react-router-dom";
import { WebSocketContext } from "App";
import { LobbyContext, MinigameContext } from "components/routing/routers/AppRouter";
import { ActivationState } from "@stomp/stompjs";

export const TappingGame = props => {
    const navigation = useHistory();
    const [gameOver, setGameOver] = useState(false);
    const connections = useContext(WebSocketContext);
    const lobbyContext = useContext(LobbyContext);
    const minigameContext = useContext(MinigameContext);

    const [count1, setCount1] = useState(0);
    const [count2, setCount2] = useState(0);

    const onPlayerOneInput = (msg) => {
        const data = JSON.parse(msg.body)
        if(data.inputType === "TAP"){
            setCount1(data.rawData.x);
        }
    }

    const onPlayerTwoInput = (msg) => {
        const data = JSON.parse(msg.body)
        if(data.inputType === "TAP"){
            setCount2(data.rawData.x);
        }
    }

    useEffect(() => {
        const player = props.playerIndex === 0 ? minigameContext?.minigame.team1Player : minigameContext?.minigame.team2Player;
        if(connections.stompConnection.state === ActivationState.ACTIVE){
            connections.stompConnection.publish({
                destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Player.id}/signal`,
                body: JSON.stringify({
                    signal: "START",
                    minigame: "TAPPING_GAME"
                })
            })
            connections.stompConnection.publish({
                destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Player.id}/signal`,
                body: JSON.stringify({
                    signal: "START",
                    minigame: "TAPPING_GAME"
                })
            })
        }
    }, [])

    useEffect(() => {

        const player = props.playerIndex === 0 ? minigameContext?.minigame.team1Player : minigameContext?.minigame.team2Player;
        if (connections.stompConnection.state === ActivationState.ACTIVE) {
            connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Player.id}/input`, onPlayerOneInput);
            connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Player.id}/input`, onPlayerTwoInput);
            return;
        }
        connections.stompConnection.onConnect = (_) => {
            connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Player.id}/input`, onPlayerOneInput);
            connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Player.id}/input`, onPlayerTwoInput);

            connections.stompConnection.publish({
                destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Player.id}/signal`,
                body: JSON.stringify({
                    signal: "START",
                    minigame: "TAPPING_GAME"
                })
            })
            connections.stompConnection.publish({
                destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Player.id}/signal`,
                body: JSON.stringify({
                    signal: "START",
                    minigame: "TAPPING_GAME"
                })
            })
        };
    }, [connections, lobbyContext, minigameContext])

    useEffect(() => {
        // update progress bar respectively
        document.querySelectorAll('.progress')[0].style.height = `${count1 / 2}%`;
        document.querySelectorAll('.progress')[1].style.height = `${count2 / 2}%`;
    }, [count1, count2]);

    
    //TODO creator of this game: set gameover to true once the game is finished THANKS!
    //TODO: pass winner to MinigameWon
    useEffect(() => {
        if (gameOver === true) {
            navigation.push("/minigameWon")
        }
    }, [gameOver])
    //^ ONLY FOR TESTING
    // useEffect(() => {
    //     setTimeout(() => {
    //         setGameOver(true)
    //     }, 200000);
    // }, [])

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
            <Timer onExpire={() => {
                setGameOver(true);
            }}>20</Timer>
        </div> 

    );

}
