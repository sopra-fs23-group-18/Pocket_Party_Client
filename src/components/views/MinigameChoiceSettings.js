import { useContext, useEffect, useState } from 'react';
import { api, handleError } from 'helpers/api';
import { useHistory, useLocation } from 'react-router-dom';
import { Button } from 'components/ui/Button';
import 'styles/views/Settings.scss';
import BaseContainer from "components/ui/BaseContainer";
import { GameContext, LobbyContext } from 'components/routing/routers/AppRouter';
import HeaderContainer from 'components/ui/HeaderContainer';

const MinigameChoiceSettings = props => {
    const history = useHistory();

    const [chosenMinigames, setChosenMinigames] = useState([]);

    const saveMinigameChoice = (score) => {
        history.push("/settings", { chosenMinigames });
    };

    const handleMinigameOptionClick = (minigame) => {
        if (chosenMinigames.includes(minigame)) {
            setChosenMinigames(chosenMinigames.filter((name) => name !== minigame));
        } else {
            setChosenMinigames([...chosenMinigames, minigame]);
        }
    };

    const handleSelectAllMinigames = () => {
        if (chosenMinigames.length === 6) {
            setChosenMinigames([]);
        } else {
            setChosenMinigames(['TIMING_TUMBLE', 'QUICK_FINGERS', 'POCKET_PONG', 'VIBRATION_VOYAGE', 'GREEDY_GAMBIT', 'ROCK_PAPER_SCISSORS']);
        }
    };

    return (
        <BaseContainer>
            <HeaderContainer text="Choose your Minigames" title="Settings"></HeaderContainer>
            <div className="settings container">
                <div className="settings minigames-form">
                    <div className='settings label'>Minigames</div>
                    <Button className={'settings button-container'} onClick={() => handleSelectAllMinigames()}>
                        Select all
                    </Button>
                    <div className='settings option-container'>
                        <div className={`option ${chosenMinigames.includes('TIMING_TUMBLE') ? 'selected' : ''}`} onClick={() => handleMinigameOptionClick('TIMING_TUMBLE')}>
                            <span className="option-label">Timing Tumble</span>
                        </div>
                        <div className={`option ${chosenMinigames.includes('QUICK_FINGERS') ? 'selected' : ''}`} onClick={() => handleMinigameOptionClick('QUICK_FINGERS')}>
                            <span className="option-label">Quick Fingers</span>
                        </div>
                        <div className={`option ${chosenMinigames.includes('POCKET_PONG') ? 'selected' : ''}`} onClick={() => handleMinigameOptionClick('POCKET_PONG')}>
                            <span className="option-label">Pocket Pong</span>
                        </div>
                    </div>
                    <div className='settings option-container'>
                        <div className={`option ${chosenMinigames.includes('VIBRATION_VOYAGE') ? 'selected' : ''}`} onClick={() => handleMinigameOptionClick('VIBRATION_VOYAGE')}>
                            <span className="option-label">Vibration Voyage</span>
                        </div>
                        <div className={`option ${chosenMinigames.includes('GREEDY_GAMBIT') ? 'selected' : ''}`} onClick={() => handleMinigameOptionClick('GREEDY_GAMBIT')}>
                            <span className="option-label">Greedy Gambit</span>
                        </div>
                        <div className={`option ${chosenMinigames.includes('ROCK_PAPER_SCISSORS') ? 'selected' : ''}`} onClick={() => handleMinigameOptionClick('ROCK_PAPER_SCISSORS')}>
                            <span className="option-label">Rock Paper Scissors</span>
                        </div>
                    </div>
                    <Button className="settings button-container"
                        onClick={() => saveMinigameChoice()}
                        disabled={(chosenMinigames.length == [])}
                    >
                        save
                    </Button>
                </div>
            </div>
        </BaseContainer >
    );
};

export default MinigameChoiceSettings;