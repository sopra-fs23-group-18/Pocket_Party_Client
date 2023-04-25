import BaseContainer from "components/ui/BaseContainer";
import GameHeader from "components/ui/HeaderContainer";
import PlayerContainer from "components/ui/PlayerContainer";
import "styles/views/GameWon.scss";
import Confetti from 'react-confetti';
import HeaderContainer from "components/ui/HeaderContainer";
import { useHistory, useLocation } from "react-router-dom";
import { useEffect } from "react";

const MinigameWon = () => {
    let location = useLocation();
    const navigation = useHistory();
    useEffect(() => {
        setTimeout(() => {
            navigation.push("/teamScoreOverview")
        }, 5000)
    }, []);
    return (
        <BaseContainer>
            <HeaderContainer title="Winner" text="Minigame" ></HeaderContainer>
            <Confetti numberOfPieces={200} />
            <div className="gameWon maindiv">
                <label className="gameWon twi">The winner is</label>
                <div className="gameWon winner">
                    <PlayerContainer player={location.state.team1Player} />
                </div>
                <div className="gameWon loser">
                    <PlayerContainer player={location.state.team2Player} />
                </div>
            </div>
        </BaseContainer>
    )
}

export default MinigameWon;
