import BaseContainer from "components/ui/BaseContainer";
import GameHeader from "components/ui/HeaderContainer";
import PlayerContainer from "components/ui/PlayerContainer";
import "styles/views/GameWon.scss";
import Confetti from 'react-confetti';
import HeaderContainer from "components/ui/HeaderContainer";
import { useHistory, useLocation } from "react-router-dom";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { api } from "helpers/api";
import { LobbyContext, MinigameContext } from "components/routing/routers/AppRouter";

const MinigameWon = () => {
    const minigameContext = useContext(MinigameContext);
    const lobbyContext = useContext(LobbyContext);

    const [hasWon, setHasWon] = useState(false);
    const timeout = useRef(null);
    const [loser, setLoser] = useState();
    const [loserTeam, setLoserTeam] = useState();
    const [winner, setWinner] = useState();
    const [winnerTeam, setWinnerTeam] = useState();
    let location = useLocation();
    const navigation = useHistory();
    useEffect(() => {
        if (!hasWon) {
            timeout.current = setTimeout(() => { navigation.push("/teamScoreOverview", location.state) }, 5000)
            return;
        }
        console.log("got calleds");
        clearTimeout(timeout.current);
        setTimeout(() => {
            api.get(`/lobbies/${lobbyContext.lobby.id}/winner`).then((response) => {
                navigation.push("/winner", {winnerTeam: response.data}
                );
            })
        }, 5000)


    }, [hasWon]);


    async function updateScores(winnerTeam) {
        if (winnerTeam.color === "RED") {
            setWinner(minigameContext.minigame.team1Player)
            setWinnerTeam("team1")
            setLoser(minigameContext.minigame.team2Player)
            setLoserTeam("team2")
        }
        else {
            setWinner(minigameContext.minigame.team2Player)
            setWinnerTeam("team2")
            setLoser(minigameContext.minigame.team1Player)
            setLoserTeam("team1")
        }
        const score = winnerTeam.score
        const color = winnerTeam.color
        const name = winnerTeam.name
        const requestbody = JSON.stringify({ score, color, name })
        await api.put(`/lobbies/${lobbyContext.lobby.id}/minigame`, requestbody)
        const response = await api.get(`/lobbies/${lobbyContext.lobby.id}/gameover`)
        console.log();
        setHasWon(response.data.isFinished)
    }

    useEffect(() => {
        updateScores(location.state.winner);
    }, [])

    return (
        <BaseContainer>
            <HeaderContainer title="Winner" text="Minigame" ></HeaderContainer>
            <Confetti numberOfPieces={200} />
            <div className="gameWon maindiv">
                <label className="gameWon twi">The winner is</label>
                <div className="gameWon winner">
                    {winner && <PlayerContainer player={winner} team={winnerTeam} />}
                </div>
                <div className="gameWon loser">
                    {loser && <PlayerContainer player={loser} team={loserTeam} />}
                </div>
            </div>
        </BaseContainer>
    )
}

export default MinigameWon;
