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

export const TappingGameFor4 = props => {
    const history = useHistory();
    const connections = useContext(WebSocketContext);
    const lobbyContext = useContext(LobbyContext);
    const minigameContext = useContext(MinigameContext);

    const [players, setPlayers] = useState([]);
    const [lobbyId, setLobbyId] = useState(null);

    const [count1, setCount1] = useState(0);
    const [count2, setCount2] = useState(0);
    const [count3, setCount3] = useState(0);
    const [count4, setCount4] = useState(0);

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

    const onPlayerThreeInput = (msg) => {
        const data = JSON.parse(msg.body)
        if (data.inputType === "TAP") {
            setCount3(data.rawData.x);
        }
    }

    const onPlayerFourInput = (msg) => {
        const data = JSON.parse(msg.body)
        if (data.inputType === "TAP") {
            setCount4(data.rawData.x);
        }
    }

    const sendToPlayers = (body, lobbyId, players) => {
        for (const player of players) {
            console.log(connections.stompConnection.connected);
            if (connections.stompConnection.connected) {
                connections.stompConnection.publish({
                    destination: `/lobbies/${lobbyId}/players/${player}/signal`,
                    body: JSON.stringify(body)
                })
            }
        }
    }

    // set lobby id and players
  useEffect(() => {
    if (lobbyContext.lobby) {
        setLobbyId(lobbyContext.lobby.id)
    }

    if (minigameContext.minigame) {
        setPlayers([minigameContext?.minigame.team1Players[0].id, minigameContext?.minigame.team1Players[1].id,  minigameContext?.minigame.team2Players[0].id, minigameContext?.minigame.team2Players[1].id])
    }

}, [lobbyContext, minigameContext])

    // websocket connection
  useEffect(() => {
    if (players.length > 0 && lobbyId !== null) {
        sendToPlayers({
            signal: "START",
            minigame: "TAPPING_GAME",
            data: null
        }, lobbyId, players);
    }

}, [players, lobbyId])

useEffect(() => {
  return () => {
      sendToPlayers({
          signal: "STOP",
          minigame: "TAPPING_GAME"
      }, lobbyId, players)
  }
}, [])

useEffect(() => {
    if (connections.stompConnection.state === ActivationState.ACTIVE) {
      connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[0].id}/input`, onPlayerOneInput);
      connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[1].id}/input`, onPlayerTwoInput);
      connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[0].id}/input`, onPlayerThreeInput);
      connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[1].id}/input`, onPlayerFourInput);

      return;
    }
    console.log("Subscribing to input");
    connections.stompConnection.onConnect = (_) => {
      connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[0].id}/input`, onPlayerOneInput);
      connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[1].id}/input`, onPlayerTwoInput);
      connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[0].id}/input`, onPlayerThreeInput);
      connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[1].id}/input`, onPlayerFourInput);

      sendToPlayers({
        signal: "START",
        minigame: "TAPPING_GAME",
        data: null
      }, lobbyId, players);
    };
  }, [connections, lobbyContext, minigameContext])

    useEffect(() => {
        // update progress bar respectively
        document.querySelectorAll('.progress')[0].style.height = `${count1 / 2}%`;
        document.querySelectorAll('.progress')[1].style.height = `${count2 / 2}%`;
        document.querySelectorAll('.progress')[2].style.height = `${count3 / 2}%`;
        document.querySelectorAll('.progress')[3].style.height = `${count4 / 2}%`;
    }, [count1, count2, count3, count4]);


    return (
        <div className="tapping-game">
            <div className="tap-container-4">
                <div className="tap-area">
                <PlayerContainer team="team1" player={minigameContext.minigame.team1Players[0]} />
                <div className="bar-4">
                    <div className="progress">
                        <div className="count">{count1}</div>
                    </div>
                </div>
                </div>
                <div className="tap-area">
                <PlayerContainer team="team1" player={minigameContext.minigame.team1Players[1]} />
                <div className="bar-4">
                    <div className="progress">
                        <div className="count">{count2}</div>
                    </div>
                </div>
                </div>
                <div className="tap-area">
                <PlayerContainer team="team2" player={minigameContext.minigame.team2Players[0]} />
                <div className="bar-4">
                    <div className="progress">
                        <div className="count">{count3}</div>
                    </div>
                </div>
                </div>
                <div className="tap-area">
                <PlayerContainer team="team2" player={minigameContext.minigame.team2Players[1]} />
                <div className="bar-4">
                    <div className="progress">
                        <div className="count">{count4}</div>
                    </div>
                </div>
                </div>
            </div>
            <Button onClick={() => {
                setCount1(11)
                setCount2(110)
                setCount3(51)
            }}>test</Button>
            <Timer onExpire={() => {
                const scoreToGain = minigameContext.minigame.scoreToGain;
                const team1Score = count1 + count2;
                const team2Score = count3 + count4;
                let winnerScore = team1Score > team2Score ? team1Score : team2Score;
                const winningTeam = team1Score > team2Score ? { type: "TEAM_ONE", name: lobbyContext.lobby.teams[0].name } : { type: "TEAM_TWO", name: lobbyContext.lobby.teams[1].name }
                const total = team1Score + team2Score;
                winnerScore = Math.round(winnerScore / total * scoreToGain) || scoreToGain / 2;
                const winner = { score: winnerScore, type: winningTeam.type, name: winningTeam.name }
                const looser = { score: scoreToGain - winnerScore };
                const isDraw = team1Score === team2Score;
                history.push("/minigameWon", { winner, looser, isDraw })
            }}>20</Timer>
        </div>

    );

}
