import { ActivationState } from "@stomp/stompjs";
import { WebSocketContext } from "App";
import { LobbyContext, MinigameContext } from "components/routing/routers/AppRouter";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { VibCircle } from "./vibrationGame/VibCircle";
import { VibMerge } from "./vibrationGame/VibMerge";
import { VibRect } from "./vibrationGame/VibRect";
import { VibTriangle } from "./vibrationGame/VibTriangle";

export const VibrationGame = () => {
    const connections = useContext(WebSocketContext);
    const lobbyContext = useContext(LobbyContext);
    const minigameContext = useContext(MinigameContext);
    const [choosenVibration, setChoosenVibration] = useState(null);
    const [lobbyId, setLobbyId] = useState(null);
    const [players, setPlayers] = useState([]);

    const vibrationRepresentationOne = useRef();
    const vibrationRepresentationTwo = useRef();

    const onPlayerOneInput = (msg) => {
        const data = JSON.parse(msg.body)
        console.log(data);
    }

    const onPlayerTwoInput = (msg) => {
        const data = JSON.parse(msg.body)
        console.log(data);
    }

    const sendToPlayers = (body, lobbyId, players) => {
        for (const player of players) {
            console.log(connections.stompConnection.connected);
            if (connections.stompConnection.connected) {
                connections.stompConnection.publish({
                    destination: `/lobbies/${lobbyId}/players/${player}/signal`,
                    body: JSON.stringify(body)
                })
                console.log("trash bruder trash");
            }else{
                console.log("Fuck off");
            }
        }
    }

    useEffect(() => {
        if (lobbyContext.lobby) {
            setLobbyId(lobbyContext.lobby.id)
        }
        if (minigameContext.minigame) {
            setPlayers([minigameContext?.minigame.team1Player.id, minigameContext?.minigame.team2Player.id])
        }
        
    }, [lobbyContext, minigameContext, ])

    useEffect(() => {
        if (connections.stompConnection.connected) {
            connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Player.id}/input`, onPlayerOneInput);
            connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Player.id}/input`, onPlayerTwoInput);
            return;
        }

        connections.stompConnection.onConnect = (_) => {
            connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Player.id}/input`, onPlayerOneInput);
            connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Player.id}/input`, onPlayerTwoInput);
            sendToPlayers({
                signal: "START",
                minigame: "VIBRATION_GAME",
                data: null
            }, lobbyId, players);
        };
    },[connections, players, lobbyId])

    useEffect(() => {
        if(players.length > 0 && lobbyId !== null){
            sendToPlayers({
                signal: "START",
                minigame: "VIBRATION_GAME",
                data: null
            }, lobbyId, players);
        }
    }, [players, lobbyId])


    useEffect(() => {
        return () => {
            sendToPlayers({
                signal: "STOP",
                minigame: "VIBRATION_GAME"
            }, lobbyId, players)
        }
    }, [])


    const playVibrationONE = useCallback(() => {
        sendToPlayers({
            signal: "PLAY",
            minigame: "VIBRATION_GAME",
            data: "VIB_ONE"
        }, lobbyId, players)
        vibrationRepresentationOne.current.play();
    }, [lobbyId, players, vibrationRepresentationOne])


    const playVibrationTWO = useCallback(() => {
        sendToPlayers({
            signal: "PLAY",
            minigame: "VIBRATION_GAME",
            data: "VIB_TWO"
        }, lobbyId, players)
        vibrationRepresentationTwo.current.play();
    }, [lobbyId, players])

    const playVibrationTHREE = useCallback(() => {
        sendToPlayers({
            signal: "PLAY",
            minigame: "VIBRATION_GAME",
            data: "VIB_THREE"
        }, lobbyId, players)
    }, [lobbyId, players])


    const chooseAndPlayRandomVibration = () => {
        const vibrations = [playVibrationONE, playVibrationTWO, playVibrationTHREE];
        const randomIndex = Math.floor(Math.random() * 3) + 1 // returns a number between 1 and 3 (both inclusiv)
        setChoosenVibration(randomIndex - 1);
        vibrations[randomIndex - 1].call();
    }


    return (
        <BaseContainer>
            {/* <VibRect ref={vibrationRepresentationOne}/> */}
            <VibMerge ref={vibrationRepresentationTwo}/>
            <Button onClick={() => {playVibrationTWO()}}>Pattern 1</Button>
        </BaseContainer>);
}