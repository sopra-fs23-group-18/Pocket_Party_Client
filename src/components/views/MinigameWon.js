import BaseContainer from "components/ui/BaseContainer";
import GameHeader from "components/ui/HeaderContainer";
import PlayerContainer from "components/ui/PlayerContainer";
import "styles/views/GameWon.scss";
import Confetti from 'react-confetti';
import HeaderContainer from "components/ui/HeaderContainer";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";

const MinigameWon = ({ lobbyId }) => {
    const navigation = useHistory();
    useEffect(() => {
        setTimeout(() => {
            navigation.push("/teamScoreOverview")
        }, 5000), []
    });
    return (
        <BaseContainer>
            <HeaderContainer title="Winner" text="Minigame" ></HeaderContainer>
            <Confetti numberOfPieces={200} />
            <div className="gameWon maindiv">
                <label className="gameWon twi">The winner is</label>
                <div className="gameWon winner">
                    {/* <PlayerContainer /> */}
                </div>
                <div className="gameWon loser">
                    {/* <PlayerContainer /> */}
                </div>
            </div>
        </BaseContainer>
    )
}

export default MinigameWon;
