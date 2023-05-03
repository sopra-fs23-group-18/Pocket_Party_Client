import { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import '../../styles/views/WinnerScreen.scss';
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import { LobbyContext } from "components/routing/routers/AppRouter";


export const WinnerScreen = () => {
    const history = useHistory();
    const location = useLocation();
    const lobbyContext = useContext(LobbyContext);
    const [winnerTeam, setWinnerTeam] = useState();

    useEffect(() => {
        const { winnerTeam } = location.state;
        setWinnerTeam(winnerTeam);
    }, [location])

    const restartGame = async () => {
        //TODO delete Lobby
        history.push("/createLobby");
    }
    return (
        <BaseContainer>
            <div className="container">
                <h1 className="winnerTitle">Winner</h1>
                {winnerTeam && <h1 className={`winnerName ${winnerTeam.color === "RED" ? "team1" : "team2"}`}>{winnerTeam.name}</h1>}
                <div className="score">Score: {lobbyContext.lobby.winningScore} pts </div>
                <Button className='lobby button-container' onClick={restartGame}>New Game</Button>
            </div>
        </BaseContainer>
    )
};
