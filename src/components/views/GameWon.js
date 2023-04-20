import BaseContainer from "components/ui/BaseContainer";
import GameHeader from "components/ui/HeaderContainer";
import PlayerContainer from "components/ui/PlayerContainer";
import "styles/views/GameWon.scss";
import Confetti from 'react-confetti';
import HeaderContainer from "components/ui/HeaderContainer";

const GameWon = ({ lobbyId }) => {
    return (
        <BaseContainer>
        <HeaderContainer title="Winner" text="WINNER" ></HeaderContainer>
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
