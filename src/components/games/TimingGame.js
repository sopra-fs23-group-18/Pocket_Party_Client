import { ActivationState } from "@stomp/stompjs";
import { WebSocketContext } from "App";
import { LobbyContext, MinigameContext } from "components/routing/routers/AppRouter";
import { Timer } from "components/ui/Timer";
import { useContext, useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom"
import { TimingGamePlayerView } from "./timingGame/TimingGamePlayerView"

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
        if(data.inputType === "SHAKE"){
            player1.current.move();
        }
    }

    const onPlayerTwoInput = (msg) => {
        const data = JSON.parse(msg.body)
        if(data.inputType === "SHAKE"){
            player2.current.move();
        }
    }

    useEffect(() => {
        const player = props.playerIndex === 0 ? minigameContext?.minigame.team1Player : minigameContext?.minigame.team2Player;
        if(connections.stompConnection.state === ActivationState.ACTIVE){
            connections.stompConnection.publish({
                destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Player.id}/signal`,
                body: JSON.stringify({
                    signal: "START",
                    minigame: "TIMING_GAME"
                })
            })
            connections.stompConnection.publish({
                destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Player.id}/signal`,
                body: JSON.stringify({
                    signal: "START",
                    minigame: "TIMING_GAME"
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
                    minigame: "TIMING_GAME"
                })
            })
            connections.stompConnection.publish({
                destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Player.id}/signal`,
                body: JSON.stringify({
                    signal: "START",
                    minigame: "TIMING_GAME"
                })
            })
        };
    }, [connections, lobbyContext, minigameContext])


    return(
        <div style={{display: 'flex', flexDirection: 'column', justifyItems: 'center'}}>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
            <div style={{display: 'flex', flexDirection: 'column', justifyItems: 'center'}}>
            <h1>Score: {player1Score}</h1>
            <TimingGamePlayerView ref={player1} setScore={setPlayer1Score} score={player1Score} playerIndex={0} />

            </div>
            <div style={{display: 'flex', flexDirection: 'column', justifyItems: 'center'}}>
            <h1>Score: {player2Score}</h1>
            <TimingGamePlayerView ref={player2} setScore={setPlayer2Score} score={player2Score} playerIndex={1}/>

            </div>
        </div>
          <Timer onExpire={() => {
            const scoreToGain = minigameContext.minigame.scoreToGain;
            let winnerScore = player1Score > player2Score ? player1Score : player2Score;
            const winningTeam = player1Score > player2Score ? {color: "RED", name: "team1"}: {color: "BLUE", name: "team2"}
            const total = player1Score + player2Score;
            winnerScore = Math.round(winnerScore / total * scoreToGain);
            const winner =  {score: winnerScore, color: winningTeam.color, name: winningTeam.name }
            const looser = {score: scoreToGain - winnerScore};
            history.push("/minigameWon", {winner, looser} )
          }}> 20 </Timer>
          </div>
    )
}