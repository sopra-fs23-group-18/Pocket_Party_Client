import React, { useContext } from "react";
import 'styles/games/TappingGame.scss';
import { useEffect, useState } from 'react';
import { Timer } from "components/ui/Timer";
import { useHistory } from "react-router-dom";
import { WebSocketContext } from "App";
import { LobbyContext, MinigameContext } from "components/routing/routers/AppRouter";
import { ActivationState } from "@stomp/stompjs";
import PlayerContainer from "components/ui/PlayerContainer";
import { Button } from "components/ui/Button";

export const TappingGame = props => {
    const history = useHistory();
    const connections = useContext(WebSocketContext);
    const lobbyContext = useContext(LobbyContext);
    const minigameContext = useContext(MinigameContext);

    const [count1, setCount1] = useState(0);
    const [count2, setCount2] = useState(0);

    const onPlayerOneInput = (msg) => {
        const data = JSON.parse(msg.body)
        if (data.inputType === "TAP") {
            setCount1(data.rawData.x);
        }
    }

    const onPlayerTwoInput = (msg) => {
        const data = JSON.parse(msg.body)
        if (data.inputType === "TAP") {
            setCount2(data.rawData.x);
        }
    }

    useEffect(() => {
        if (connections.stompConnection.state === ActivationState.ACTIVE) {
            connections.stompConnection.publish({
                destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[0].id}/signal`,
                body: JSON.stringify({
                    signal: "START",
                    minigame: "QUICK_FINGERS"
                })
            })
            connections.stompConnection.publish({
                destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[0].id}/signal`,
                body: JSON.stringify({
                    signal: "START",
                    minigame: "QUICK_FINGERS"
                })
            })
        }
        return () => {
            if (connections.stompConnection.state === ActivationState.ACTIVE) {
                connections.stompConnection.publish({
                    destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[0].id}/signal`,
                    body: JSON.stringify({
                        signal: "STOP",
                        minigame: "QUICK_FINGERS"
                    })
                })
                connections.stompConnection.publish({
                    destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[0].id}/signal`,
                    body: JSON.stringify({
                        signal: "STOP",
                        minigame: "QUICK_FINGERS"
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
        connections.stompConnection.onConnect = (_) => {
            connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[0].id}/input`, onPlayerOneInput);
            connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[0].id}/input`, onPlayerTwoInput);

            connections.stompConnection.publish({
                destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[0].id}/signal`,
                body: JSON.stringify({
                    signal: "START",
                    minigame: "QUICK_FINGERS"
                })
            })
            connections.stompConnection.publish({
                destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[0].id}/signal`,
                body: JSON.stringify({
                    signal: "START",
                    minigame: "QUICK_FINGERS"
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
            <div className="tapping-game__container">
                <PlayerContainer team="team1" player={minigameContext.minigame.team1Players[0]} />
                <div className="bar">
                    <div className="progress">
                        <div className="count">{count1}</div>
                    </div>
                </div>
                <PlayerContainer team="team2" player={minigameContext.minigame.team2Players[0]} />
                <div className="bar">
                    <div className="progress">
                        <div className="count">{count2}</div>
                    </div>
                </div>
            </div>
            <Timer onExpire={() => {
                const scoreToGain = minigameContext.minigame.scoreToGain;
                let winnerScore = count1 > count2 ? count1 : count2;
                const winningTeam = count1 > count2 ? { type: "TEAM_ONE", name: lobbyContext.lobby.teams[0].name } : { type: "TEAM_TWO", name: lobbyContext.lobby.teams[1].name }
                const total = count1 + count2;
                winnerScore = Math.round(winnerScore / total * scoreToGain) || scoreToGain / 2;
                const winner = { score: winnerScore, type: winningTeam.type, name: winningTeam.name }
                const looser = { score: scoreToGain - winnerScore };
                const isDraw = count1 === count2;
                history.push("/minigameWon", { winner, looser, isDraw })
            }}>20</Timer>
        </div>

    );

}
