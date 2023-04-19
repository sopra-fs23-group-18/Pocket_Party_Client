import BaseContainer from "components/ui/BaseContainer";
import GameHeader from "components/ui/GameHeader";
import PlayerContainer from "components/ui/PlayerContainer";
import "styles/views/GameWon.scss";
import Confetti from 'react-confetti';

const GameWon = ({ lobbyId }) => {
    return (
        <BaseContainer>
            <GameHeader />
            <Confetti numberOfPieces={200} />
            <div className="GameWon maindiv">
                <label className="GameWon TWI">The winner is</label>
                <div className="GameWon Winner">
                    <PlayerContainer />
                </div>
                <div className="GameWon Loser">
                    <PlayerContainer />
                </div>
            </div>
        </BaseContainer>
    )
}

export default GameWon;
