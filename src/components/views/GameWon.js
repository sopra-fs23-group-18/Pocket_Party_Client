import BaseContainer from "components/ui/BaseContainer";
import GameHeader from "components/ui/GameHeader";
import PlayerContainer from "components/ui/PlayerContainer";
import "styles/views/GameWon.scss"
const GameWon = ({ lobbyId }) => {

    return (
        <BaseContainer>
            <GameHeader />
            <div className="GameWon maindiv">
                <label className="GameWon TWI">The winner is</label>
                <PlayerContainer />
                <PlayerContainer />
            </div>
        </BaseContainer>
    )
}
export default GameWon;
