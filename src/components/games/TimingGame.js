import { ActivationState } from "@stomp/stompjs";
import { WebSocketContext } from "App";
import { LobbyContext, MinigameContext } from "components/routing/routers/AppRouter";
import { Timer } from "components/ui/Timer";
import { useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom"
import { TimingGamePlayerView } from "./timingGame/TimingGamePlayerView"

export const TimingGame = props => {
    const location = useLocation();
    const connections = useContext(WebSocketContext);
    const lobbyContext = useContext(LobbyContext);
    const minigameContext = useContext(MinigameContext);

    const player1 = useRef();
    const player2 = useRef();

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
            <TimingGamePlayerView ref={player1} playerIndex={0}/>
            <TimingGamePlayerView ref={player2} playerIndex={1}/>
        </div>
          <Timer> 20 </Timer>
          </div>
    )
}