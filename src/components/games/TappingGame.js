import React, { useContext } from "react";
import 'styles/games/tappingGame.scss';
import { useEffect, useRef, useState } from 'react';
import { Timer } from "components/ui/Timer";
import { useHistory } from "react-router-dom";
import { WebSocketContext } from "App";
import { LobbyContext, MinigameContext } from "components/routing/routers/AppRouter";
import { ActivationState } from "@stomp/stompjs";
import PlayerContainer from "components/ui/PlayerContainer";

export const TappingGame = props => {
    const history = useHistory();
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
        return () => {
            if (connections.stompConnection.state === ActivationState.ACTIVE) {
                connections.stompConnection.publish({
                    destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Player.id}/signal`,
                    body: JSON.stringify({
                        signal: "STOP",
                        minigame: "TAPPING_GAME"
                    })
                })
                connections.stompConnection.publish({
                    destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Player.id}/signal`,
                    body: JSON.stringify({
                        signal: "STOP",
                        minigame: "TAPPING_GAME"
                    })
                })
            }
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


    return (
        <div className="tapping-game">
            <h1>Tapping Game</h1>
            <div className="tapping-game__container">
                <PlayerContainer team="team1" player={minigameContext.minigame.team1Player}/>
                <div class="bar">
                    <div class="progress">
                        <div class="count">{count1}</div>
                    </div>
                </div>
                <PlayerContainer team="team2" player={minigameContext.minigame.team2Player}/>
                <div class="bar">
                    <div class="progress">
                        <div class="count">{count2}</div>
                    </div>
                </div>
            </div>
            <Timer onExpire={() => {
                const scoreToGain = minigameContext.minigame.scoreToGain;
                let winnerScore = count1 > count2 ? count1 : count2;
                const winningTeam = count1 > count2 ? {color: "RED", name: "Team Red"}: {color: "BLUE", name: "Team Blue"}
                const total = count1 + count2;
                winnerScore = Math.round(winnerScore / total * scoreToGain) || scoreToGain / 2;
                const winner = { score: winnerScore, color: winningTeam.color, name: winningTeam.name }
                const looser = { score: scoreToGain - winnerScore};
                history.push("/minigameWon", {winner, looser} )
            }}>20</Timer>
        </div> 

    );

}
