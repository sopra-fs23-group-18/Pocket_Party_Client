import BaseContainer from "components/ui/BaseContainer";
import PlayerContainer from "components/ui/PlayerContainer";
import "styles/views/GameWon.scss";
import Confetti from 'react-confetti';
import HeaderContainer from "components/ui/HeaderContainer";
import { useHistory, useLocation } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { api } from "helpers/api";
import { LobbyContext, MinigameContext } from "components/routing/routers/AppRouter";

const MinigameWon = () => {
    const minigameContext = useContext(MinigameContext);

    const timeout = useRef(null);
    const [loser, setLoser] = useState();
    const [loserTeam, setLoserTeam] = useState();
    const [winner, setWinner] = useState();
    const [winnerTeam, setWinnerTeam] = useState();
    let location = useLocation();
    const navigation = useHistory();

    async function getWinner(winnerTeam) {
        if (winnerTeam.color === "RED") {
            setWinner(minigameContext.minigame.team1Players[0])
            setWinnerTeam("team1")
            setLoser(minigameContext.minigame.team2Players[0])
            setLoserTeam("team2")
        }
        else {
            setWinner(minigameContext.minigame.team2Players[0])
            setWinnerTeam("team2")
            setLoser(minigameContext.minigame.team1Players[0])
            setLoserTeam("team1")
        }
    }

    useEffect(() => {
        getWinner(location.state.winner);
        timeout.current = setTimeout(() => { navigation.push("/teamScoreOverview", location.state) }, 5000)
    }, [])
    return (location.state.isDraw ? <BaseContainer> <div className="gameWon div"><label className='gameWon draw'>It's a draw!</label></div> </BaseContainer> :
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
