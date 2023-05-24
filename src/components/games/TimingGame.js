import { ActivationState } from "@stomp/stompjs";
import { WebSocketContext } from "App";
import { LobbyContext, MinigameContext } from "components/routing/routers/AppRouter";
import { Timer } from "components/ui/Timer";
import { useContext, useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom"
import { TimingGamePlayerView } from "./timingGame/TimingGamePlayerView"
import BaseContainer from "components/ui/BaseContainer";
import PlayerContainer from "components/ui/PlayerContainer";

export const TimingGame = props => {
    const location = useLocation();
    const history = useHistory();

    const connections = useContext(WebSocketContext);
    const lobbyContext = useContext(LobbyContext);
    const minigameContext = useContext(MinigameContext);

    const player1 = useRef();
    const player2 = useRef();

    const [player1Score, setPlayer1Score] = useState(0);
    const [player2Score, setPlayer2Score] = useState(0);


    const onPlayerOneInput = (msg) => {
        const data = JSON.parse(msg.body)
        if (data.inputType === "SHAKE") {
            player1.current.move();
        }
    }

    const onPlayerTwoInput = (msg) => {
        const data = JSON.parse(msg.body)
        if (data.inputType === "SHAKE") {
            player2.current.move();
        }
    }

    useEffect(() => {
        const player = props.playerIndex === 0 ? minigameContext?.minigame.team1Players[0] : minigameContext?.minigame.team2Players[0];
        if (connections.stompConnection.state === ActivationState.ACTIVE) {
            connections.stompConnection.publish({
                destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[0].id}/signal`,
                body: JSON.stringify({
                    signal: "START",
                    minigame: "TIMING_GAME"
                })
            })
            connections.stompConnection.publish({
                destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[0].id}/signal`,
                body: JSON.stringify({
                    signal: "START",
                    minigame: "TIMING_GAME"
                })
            })
        }
        return () => {
            if (connections.stompConnection.state === ActivationState.ACTIVE) {
                connections.stompConnection.publish({
                    destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[0].id}/signal`,
                    body: JSON.stringify({
                        signal: "STOP",
                        minigame: "TIMING_GAME"
                    })
                })
                connections.stompConnection.publish({
                    destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[0].id}/signal`,
                    body: JSON.stringify({
                        signal: "STOP",
                        minigame: "TIMING_GAME"
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
                    minigame: "TIMING_GAME"
                })
            })
            connections.stompConnection.publish({
                destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[0].id}/signal`,
                body: JSON.stringify({
                    signal: "START",
                    minigame: "TIMING_GAME"
                })
            })
        };
    }, [connections, lobbyContext, minigameContext])


    return (
        <BaseContainer>
            <div style={{ display: 'flex', flexDirection: 'column', justifyItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyItems: 'center' }}>
                        <PlayerContainer team='team1' player={minigameContext?.minigame?.team1Players[0]} />
                        <span style={{ fontWeight: 'bold', fontSize: '30px', marginTop: '1em', color: 'black' }}>Score: {player1Score}</span>
                        <TimingGamePlayerView ref={player1} setScore={setPlayer1Score} score={player1Score} playerIndex={0} />

                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyItems: 'center' }}>
                        <PlayerContainer team='team2' player={minigameContext?.minigame?.team2Players[0]} />
                        <span style={{ fontWeight: 'bold', fontSize: '30px', marginTop: '1em', color: 'black' }}>Score: {player2Score}</span>
                        <TimingGamePlayerView ref={player2} setScore={setPlayer2Score} score={player2Score} playerIndex={1} />

                    </div>
                </div>
                <Timer onExpire={() => {
                    const scoreToGain = minigameContext.minigame.scoreToGain;
                    const isDraw = player1Score === player2Score;
                    let winner
                    let looser
                    if (isDraw) {
                        winner = { score: scoreToGain / 2, type: "TEAM_ONE", name: "Team Red" };
                        looser = { score: scoreToGain / 2, type: "TEAM_TWO", name: "Team Blue" };
                    }
                    else {
                        let winnerScore = player1Score > player2Score ? player1Score : player2Score;
                        const winningTeam = player1Score > player2Score ? { type: "TEAM_ONE", name: "Team Red" } : { type: "TEAM_TWO", name: "Team Blue" }
                        const total = player1Score + player2Score;
                        winnerScore = Math.round(winnerScore / total * scoreToGain) || scoreToGain / 2;
                        winner = { score: winnerScore, type: winningTeam.type, name: winningTeam.name }
                        looser = { score: scoreToGain - winnerScore };
                    }

                    history.push("/minigameWon", { winner, looser, isDraw });
                }}> 20 </Timer>
            </div>
        </BaseContainer>
    )
}