import { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import '../../styles/views/WinnerScreen.scss';
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import { GameContext, LobbyContext } from "components/routing/routers/AppRouter";


export const WinnerScreen = () => {
    const history = useHistory();
    let location = useLocation();
    const gameContext = useContext(GameContext);
    const lobbyContext = useContext(LobbyContext);

    const [winnerTeam, setWinnerTeam] = useState(null);

    useEffect(() => {
        console.log(location.state);

        const { winnerTeam } = location.state;
        setWinnerTeam(winnerTeam);
    }, [])

    const restartGame = async () => {
        //TODO delete Lobby
        history.push("/createLobby");
    }
    const redirectToLobby = () => {
        history.push("/lobby", { id: lobbyContext.lobby.id })
    }
    const content = (winnerTeam) => {
        if (!location.state.draw) {
            return <div className="container">
                <h1 className="winnerTitle">Winner</h1>
                {winnerTeam && <h1 className={`winnerName ${winnerTeam?.type === "TEAM_ONE" ? "team1" : "team2"}`}>{winnerTeam?.name}</h1>}
                <div className="score">Score: {winnerTeam?.score} pts </div>
                <Button className='restart-button' onClick={restartGame}>End Game</Button>
                <Button className='restart-button' onClick={redirectToLobby}>Play again!</Button>
            </div>
        } else {
            return <div className="container">
                <h1 className="winnerTitle">Its a Draw!</h1>
                <div className="score">Score: {gameContext.game.winningScore} pts </div>
                <Button className='restart-button' onClick={restartGame}>End Game</Button>
                <Button className='restart-button' onClick={redirectToLobby}>Play again!</Button>
            </div>
        }
    }
    return (
        <BaseContainer>
            <div>{content(winnerTeam)}</div>
        </BaseContainer>
    )
};
