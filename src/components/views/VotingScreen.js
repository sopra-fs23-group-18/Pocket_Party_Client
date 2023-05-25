import { WebSocketContext } from "App";
import { GameContext, LobbyContext, MinigameContext } from "components/routing/routers/AppRouter";
import { useContext, useEffect, useState } from "react";

export const VotingScreen = () => {
    const connections = useContext(WebSocketContext);
    const lobbyContext = useContext(LobbyContext);
    const gameContext = useContext(GameContext);
    const minigameContext = useContext(MinigameContext);
    const [lobbyId, setLobbyId] = useState(null);
    const [players, setPlayers] = useState([]);



    const sendToPlayers = (body, lobbyId, players) => {
        for (const player of players) {
            console.log(connections.stompConnection.connected);
            if (connections.stompConnection.connected) {
                connections.stompConnection.publish({
                    destination: `/lobbies/${lobbyId}/players/${player.id}/signal`,
                    body: JSON.stringify(body)
                })
                console.log("trash bruder trash");
            } else {
                console.log("Fuck off");
            }
        }
    }

    useEffect(() => {
        console.log(lobbyContext);
        setPlayers([...lobbyContext.lobby.teams[0].players, ...lobbyContext.lobby.teams[1].players]);
        setLobbyId(lobbyContext.lobby.id);
    }, [])

    useEffect(() => {
        if (connections.stompConnection.connected) {
            // connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[0].id}/input`, onPlayerOneInput);
            // connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[0].id}/input`, onPlayerTwoInput);
            return;
        }

        connections.stompConnection.onConnect = (_) => {
            console.log("ONCONNECT");
            // connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[0].id}/input`, onPlayerOneInput);
            // connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[0].id}/input`, onPlayerTwoInput);
            sendToPlayers({
                signal: "VOTE",
                minigame: null,
                data: null
            }, lobbyId, players);
        };
    }, [connections, players, lobbyId])

    useEffect(() => {
        console.log("breeeee");
        if (players.length > 0 && lobbyId !== null) {
            sendToPlayers({
                signal: "VOTE",
                minigame: null,
                data: null
            }, lobbyId, players);
        }
    }, [players, lobbyId])

    return (<h1>VOTING</h1>);
}