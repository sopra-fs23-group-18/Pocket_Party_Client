import { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import '../../styles/views/WinnerScreen.scss';
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import { GameContext, LobbyContext } from "components/routing/routers/AppRouter";


export const WinnerScreen = () => {
    const history = useHistory();
    const location = useLocation();
    const gameContext = useContext(GameContext);
    const [winnerTeam, setWinnerTeam] = useState();

    useEffect(() => {
        const { winnerTeam } = location.state.winnerTeam;
        setWinnerTeam(winnerTeam);
    }, [location])

    const restartGame = async () => {
        //TODO delete Lobby
        history.push("/createLobby");
    }
    const redirectToLobby = () => {
        history.push("/lobby")
    }
    const content = () => {
        if (!location.state.draw) {
            <div className="container">
                <h1 className="winnerTitle">Winner</h1>
                {winnerTeam && <h1 className={`winnerName ${winnerTeam.type === "TEAM_ONE" ? "team1" : "team2"}`}>{winnerTeam.name}</h1>}
                <div className="score">Score: {winnerTeam.score} pts </div>
                <Button className='lobby button-container' onClick={restartGame}>New Game</Button>
                <button className='lobby button-container' onClick={redirectToLobby}>Play again!</button>
            </div>
        } else {
            <div className="container">
                <h1 className="winnerTitle">Its a Draw!</h1>
                <div className="score">Score: {gameContext.game.winningScore} pts </div>
                <Button className='lobby button-container' onClick={restartGame}>New Game</Button>
                <Button className='lobby button-container' onClick={redirectToLobby}>Play again!</Button>
            </div>
        }
    }
    return (
        <BaseContainer>
            <div>{content()}</div>
        </BaseContainer>
    )
};
