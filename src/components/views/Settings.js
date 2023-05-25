import { useContext, useEffect, useState } from 'react';
import { api, handleError } from 'helpers/api';
import { useHistory, useLocation } from 'react-router-dom';
import { Button } from 'components/ui/Button';
import 'styles/views/Settings.scss';
import BaseContainer from "components/ui/BaseContainer";
import { GameContext, LobbyContext } from 'components/routing/routers/AppRouter';
import HeaderContainer from 'components/ui/HeaderContainer';

const Settings = props => {
  let location = useLocation();
  const history = useHistory();
  const lobbyContext = useContext(LobbyContext);
  const gameContext = useContext(GameContext);

  const [winningScore, setWinningScore] = useState(2000);

  const doCreateGame = async () => {
    const requestBody = JSON.stringify({
      winningScore: winningScore,
      chosenMinigames: location.state?.chosenMinigames || []
    });
    const response = await api.post(`/lobbies/${lobbyContext.lobby.id}/games`, requestBody);
    if (response.status === 201) {
      gameContext.setGame(response.data);
      localStorage.setItem("gameContext", JSON.stringify((response.data)));
      history.push("/gamePreview", { lobbyId: lobbyContext.lobby.id });
    }
  };

  const handleDurationOptionClick = (score) => {
    setWinningScore(score);
  };

  const goToMinigameChoice = (score) => {
    history.push("/minigameChoiceSettings");
  };

  return (
    <BaseContainer>
      <HeaderContainer text="Choose your settings" title="Settings"></HeaderContainer>
      <div className="settings container">
        <div className="settings form">
          <Button className="settings button-container"
            onClick={() => goToMinigameChoice()}
          >
            Minigames
          </Button>
          {/* Options for Duration of the Game: */}
          <div className='settings label'>Duration</div>
          <div className="settings option-container">
            <div className={`option ${winningScore === 500 ? 'selected' : ''}`} onClick={() => handleDurationOptionClick(500)}>
              <span className="option-label">Short</span>
            </div>
            <div className={`option ${winningScore === 2000 ? 'selected' : ''}`} onClick={() => handleDurationOptionClick(2000)}>
              <span className="option-label">Normal</span>
            </div>
            <div className={`option ${winningScore === 3000 ? 'selected' : ''}`} onClick={() => handleDurationOptionClick(3000)}>
              <span className="option-label">Long</span>
            </div>
          </div>
          <Button className="settings button-container"
            onClick={() => doCreateGame()}
          >
            Start Game
          </Button>
        </div>
      </div>
    </BaseContainer >


  );
};

export default Settings;