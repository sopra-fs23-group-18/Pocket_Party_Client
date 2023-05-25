import BaseContainer from "components/ui/BaseContainer";
import PlayerContainer from "components/ui/PlayerContainer";
import "styles/views/MinigameWon.scss";
import Confetti from 'react-confetti';
import HeaderContainer from "components/ui/HeaderContainer";
import { useHistory, useLocation } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
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
        if (winnerTeam.type === "TEAM_ONE") {
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

    function formatMinigameTypeString(type) {
        const words = type.split('_');
        const formattedWords = words.map(function (word) {
            const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            return capitalizedWord;
        });
        const formattedString = formattedWords.join(' ');
        return formattedString;
    }

    useEffect(() => {
        getWinner(location.state.winner);
        timeout.current = setTimeout(() => { navigation.push("/teamScoreOverview", location.state) }, 5000)
    }, [])
    return (
        location.state.isDraw ?
            <BaseContainer>
                <div className="gameWon maindiv">
                    <HeaderContainer title="Draw" text={formatMinigameTypeString(minigameContext.minigame.type)} ></HeaderContainer>
                    <label className='gameWon twi'>IT'S A DRAW</label>
                </div>
            </BaseContainer>
            :
            <BaseContainer>
                <Confetti numberOfPieces={200} />
                <HeaderContainer title="Winner" text={formatMinigameTypeString(minigameContext.minigame.type)} ></HeaderContainer>
                <div className="gameWon maindiv">
                    <label className="gameWon twi">THE WINNER IS</label>
                    <div className="gameWon winners">
                        {winner && <PlayerContainer player={winner} team={winnerTeam} />}
                    </div>
                    <div className="gameWon losers">
                        {loser && <PlayerContainer player={loser} team={loserTeam} />}
                    </div>
                </div>
            </BaseContainer>
    )
}

export default MinigameWon;
