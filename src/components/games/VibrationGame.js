import { WebSocketContext } from "App";
import { LobbyContext, MinigameContext } from "components/routing/routers/AppRouter";
import BaseContainer from "components/ui/BaseContainer";
import PlayerContainer from "components/ui/PlayerContainer";
import { Timer } from "components/ui/Timer";
import { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { VibCircle } from "./vibrationGame/VibCircle";
import { VibMerge } from "./vibrationGame/VibMerge";
import { VibRect } from "./vibrationGame/VibRect";
import { VibTriangle } from "./vibrationGame/VibTriangle";
import "styles/games/VibrationGame.scss";

export const VibrationGame = () => {
    const connections = useContext(WebSocketContext);
    const lobbyContext = useContext(LobbyContext);
    const minigameContext = useContext(MinigameContext);

    const [choosenVibration, setChoosenVibration] = useState(null);
    const [currentVib, setCurrentVib] = useState("VIB_ONE");

    const [voting, setVoting] = useState(false);
    const [votingResult, setVotingResult] = useState([]);

    const [headerText, setHeaderText] = useState("Listen carefully and remember");

    const [lobbyId, setLobbyId] = useState(null);
    const [players, setPlayers] = useState([]);

    const vibrationRepresentationOne = useRef();
    const vibrationRepresentationTwo = useRef();
    const vibrationRepresentationThree = useRef();
    const vibrationRepresentationRand = useRef();

    const history = useHistory();

    const onPlayerOneInput = (msg) => {
        const data = JSON.parse(msg.body)
        if (data.inputType === 'VIBRATION_VOTE') {
            setVotingResult((old) => {
                const result = {
                    player: minigameContext?.minigame.team1Players[0],
                    option: data.rawData.x
                }
                return [...old, result];
            })
        }
    }

    const onPlayerTwoInput = (msg) => {
        const data = JSON.parse(msg.body)
        if (data.inputType === 'VIBRATION_VOTE') {
            setVotingResult((old) => {
                const result = {
                    player: minigameContext?.minigame.team2Players[0],
                    option: data.rawData.x
                }
                return [...old, result];
            })
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

    useEffect(() => {
        if (lobbyContext.lobby) {
            setLobbyId(lobbyContext.lobby.id)
        }
        if (minigameContext.minigame) {
            setPlayers([minigameContext?.minigame.team1Players[0].id, minigameContext?.minigame.team2Players[0].id])
        }

    }, [lobbyContext, minigameContext])

    useEffect(() => {
        if (connections.stompConnection.connected) {
            connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[0].id}/input`, onPlayerOneInput);
            connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[0].id}/input`, onPlayerTwoInput);
            return;
        }

        connections.stompConnection.onConnect = (_) => {
            connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[0].id}/input`, onPlayerOneInput);
            connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[0].id}/input`, onPlayerTwoInput);
            sendToPlayers({
                signal: "START",
                minigame: "VIBRATION_VOYAGE",
                data: null
            }, lobbyId, players);
        };
    }, [connections, players, lobbyId])

    useEffect(() => {
        if (players.length > 0 && lobbyId !== null) {
            sendToPlayers({
                signal: "START",
                minigame: "VIBRATION_VOYAGE",
                data: null
            }, lobbyId, players);
            setTimeout(() => {
                playAllVibrations();
            }, 2000)
        }

    }, [players, lobbyId])


    useEffect(() => {
        return () => {
            sendToPlayers({
                signal: "STOP",
                minigame: "VIBRATION_VOYAGE"
            }, lobbyId, players)
        }
    }, [])


    const playVibrationONE = () => {
        sendToPlayers({
            signal: "PLAY",
            minigame: "VIBRATION_VOYAGE",
            data: "VIB_ONE"
        }, lobbyId, players)
        vibrationRepresentationOne.current?.play();
        vibrationRepresentationRand.current?.play()
    }


    const playVibrationTWO = () => {
        sendToPlayers({
            signal: "PLAY",
            minigame: "VIBRATION_VOYAGE",
            data: "VIB_TWO"
        }, lobbyId, players)
        vibrationRepresentationTwo.current?.play();
        vibrationRepresentationRand.current?.play()

    }

    const playVibrationTHREE = () => {
        sendToPlayers({
            signal: "PLAY",
            minigame: "VIBRATION_VOYAGE",
            data: "VIB_THREE"
        }, lobbyId, players)
        vibrationRepresentationThree.current?.play();
        vibrationRepresentationRand.current?.play()

    }

    const chooseAndPlayRandomVibration = () => {
        const vibrations = [playVibrationONE, playVibrationTWO, playVibrationTHREE];
        const randomIndex = Math.floor(Math.random() * 3) + 1 // returns a number between 1 and 3 (both inclusiv)
        setChoosenVibration(randomIndex - 1);
        setHeaderText("Listen and recall")
        vibrations[randomIndex - 1].call();
    }

    const displayRepresentation = (vib) => {
        if (vib === "VIB_ONE") {
            return <VibRect ref={vibrationRepresentationOne} />
        }
        if (vib === "VIB_TWO") {
            return <VibCircle ref={vibrationRepresentationTwo} />
        }
        if (vib === "VIB_THREE") {
            return <VibTriangle ref={vibrationRepresentationThree} />
        }
        if (vib === "VIB_RAND") {
            return <VibMerge ref={vibrationRepresentationRand} />
        }
    }
    const playAllVibrations = () => {
        setCurrentVib("VIB_ONE");
        playVibrationONE()
        setTimeout(() => {
            setCurrentVib("VIB_TWO");
            playVibrationTWO();
        }, 5000);
        setTimeout(() => {
            setCurrentVib("VIB_THREE");
            playVibrationTHREE();
        }, 10000)

        setTimeout(() => {
            setCurrentVib("VIB_RAND");
            chooseAndPlayRandomVibration();
        }, 15000)
        setTimeout(() => {
            sendToPlayers({
                signal: "VOTE",
                minigame: "VIBRATION_VOYAGE",
                data: null
            }, lobbyId, players)
            setVoting(true);
        }, 18000)
    }

    const displayVoting = (choosenVibration, votingResult) => {
        return (
            <div>
                <div style={{ display: "flex", justifyContent: 'center', flexDirection: 'row' }}>
                    <div>
                        <VibRect style={{ marginRight: '1em' }} />
                        <div>
                            {votingResult.map((r) => {
                                if (r.option === 0) {
                                    return <PlayerContainer player={r.player} />
                                }
                            })}
                        </div>
                    </div>
                    <div>
                        <VibCircle />
                        <div>
                            {votingResult.map((r) => {
                                if (r.option === 1) {
                                    return <PlayerContainer player={r.player} />
                                }
                            })}
                        </div>
                    </div>
                    <div>
                        <VibTriangle style={{ marginTop: '1em' }} />
                        <div>
                            {votingResult.map((r) => {
                                if (r.option === 2) {
                                    return <PlayerContainer player={r.player} />
                                }
                            })}
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: 'center' }}>                <Timer onExpire={() => {
                    const scoreToGain = minigameContext.minigame.scoreToGain;
                    let correctChoosers = votingResult.map((r) => {
                        if (r.option === choosenVibration)
                            return r.player
                    })
                    let winner;
                    let looser;
                    let isDraw = false;
                    // Draw:  either both have guessed false or both players have guessed right 
                    if (correctChoosers.length === 0 || correctChoosers.length === 2) {
                        winner = { score: scoreToGain / 2, type: "TEAM_ONE", name: lobbyContext.lobby.teams[0].name };
                        looser = { score: scoreToGain / 2, type: "TEAM_TWO", name: lobbyContext.lobby.teams[1].name };
                        isDraw = true;
                    }
                    else {
                        const winnerIsTeamRed = correctChoosers[0].id === minigameContext.minigame.team1Players[0].id;

                        if (winnerIsTeamRed) {
                            winner = { score: scoreToGain, type: "TEAM_ONE", name: lobbyContext.lobby.teams[0].name };
                            looser = { score: 0, type: "TEAM_TWO", name: lobbyContext.lobby.teams[1].name };
                        }
                        else {
                            winner = { score: scoreToGain, type: "TEAM_TWO", name: lobbyContext.lobby.teams[1].name };
                            looser = { score: 0, type: "TEAM_ONE", name: lobbyContext.lobby.teams[0].name };
                        }
                    }
                    history.push("/minigameWon", { winner, looser, isDraw })
                }}>10</Timer>
                </div>
            </div>
        );
    }

    return (
        <BaseContainer>
            <div className="vibGame container">
                {/* <VibRect ref={vibrationRepresentationOne}/> */}
                {voting ? <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="vibGame label">{headerText}</span>
                </div> :
                    <span className="vibGame label">{headerText}</span>
                }
                {voting ? displayVoting(choosenVibration, votingResult) : displayRepresentation(currentVib)}
            </div>
        </BaseContainer>);
}