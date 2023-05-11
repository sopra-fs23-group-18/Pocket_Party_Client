import { useContext, useEffect, useState } from 'react';
import { api, handleError } from 'helpers/api';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Button } from 'components/ui/Button';
import { Timer } from 'components/ui/Timer';
import 'styles/views/Settings.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { GameContext, LobbyContext } from 'components/routing/routers/AppRouter';

const Settings = props => {
  let location = useLocation();
  const history = useHistory();
  const lobbyContext = useContext(LobbyContext);
  const gameContext = useContext(GameContext);

  const [winningScore, setWinningScore] = useState(2000);
  const [pointCalculation, setPointCalculation] = useState(null);
  const [playerChoice, setPlayerChoice] = useState('RANDOM');
  //const [gameMode, setGameMode] = useState(null);
  const [chosenMinigames, setChosenMinigames] = useState([]);

  const doCreateGame = async () => {
    const requestBody = JSON.stringify({
      winningScore: winningScore,
      // pointCalculation: pointCalculation,
      playerChoice: playerChoice
    });
    const response = await api.post(`/lobbies/${lobbyContext.lobby.id}/games`, requestBody);
    if (response.status === 201) {
      gameContext.setGame(response.data);
      localStorage.setItem("gameContext", JSON.stringify((response.data)));
      history.push("/gamePreview", { lobbyId: lobbyContext.lobby.id });
    }
  };


  // setChosenMinigames([
  //   ...chosenMinigames,
  //   { id: nextId++, name: name}
  // ]);

  const handleDurationOptionClick = (score) => {
    setWinningScore(score);
  };

  return (
    <BaseContainer>
      <div className="settings container">
        <div className="settings form">
          <div className='settings label'>Duration</div>
          <div className="settings option-container">
            <div className={`option ${winningScore === 1000 ? 'selected' : ''}`} onClick={() => handleDurationOptionClick(1000)}>
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
      {/* <div className="lobby button-container">
            <Button
              width="100%"
              onClick={() => doCreateGame()}
            >
              Save settings
            </Button>
          </div>
          <div className="lobby button-container">
            <Button
              width="100%"
              onClick={() => setPointCalculation("EXPONENTIAL")}
            >
              Exponential
            </Button>
          </div>
          <div className="lobby button-container">
            <Button
              width="100%"
              onClick={() => setPointCalculation("LINEAR")}
            >
              Linear
            </Button>
          </div>
          <div className="lobby button-container">
            <Button
              width="100%"
              onClick={() => setPlayerChoice("RANDOM")}
            >
              Random
            </Button>
          </div>
          <div className="lobby button-container">
            <Button
              width="100%"
              onClick={() => setPlayerChoice("VOTING")}
            >
              Voting
            </Button> */}
      {/* </div> */}
    </BaseContainer >


  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Settings;