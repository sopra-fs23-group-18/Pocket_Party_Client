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

    let location = useLocation();
    const navigation = useHistory();
    useEffect(() => {
            if (!hasWon) {
                timeout.current = setTimeout(() => { navigation.push("/teamScoreOverview", location.state)}, 5000)
                return;
            }
            console.log("got calleds");
            clearTimeout(timeout.current);
            setTimeout( () => {
            api.get(`/lobbies/${lobbyContext.lobby.id}/winner`).then((response) => {
                navigation.push({
                    pathname: "/winner",
                    state: { winnerTeam: response.data }
                });
            })
                
            }, 5000 )

        
    }, [hasWon]);


    async function updateScores(winnerTeam) {
        const score = winnerTeam.score
        const color = winnerTeam.color
        const name = winnerTeam.name
        const requestbody = JSON.stringify({score, color, name})
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
                    <PlayerContainer player={minigameContext.minigame.team1Player} />
                </div>
                <div className="gameWon loser">
                    <PlayerContainer player={minigameContext.minigame.team2Player} />
                </div>
            </div>
        </BaseContainer>
    )
}

export default MinigameWon;
