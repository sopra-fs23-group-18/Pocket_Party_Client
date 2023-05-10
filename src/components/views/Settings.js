import { useContext, useEffect, useState } from 'react';
import { api, handleError } from 'helpers/api';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Button } from 'components/ui/Button';
import { Timer } from 'components/ui/Timer';
import 'styles/views/Settings.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { LobbyContext } from 'components/routing/routers/AppRouter';

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */

const Settings = props => {
  let location = useLocation();
  const history = useHistory();
  const lobbyContext = useContext(LobbyContext);


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
    const response = await api.post(`/lobbies/${location.state.id}/games`, requestBody);
    console.log(response.data);
    history.push('/lobby', response.data);
  };

  useEffect(() => {
    lobbyContext.setLobby({ id: location.state.id })
    localStorage.setItem("lobbyContext", JSON.stringify({ id: location.state.id }));
  }, [location.state.id])


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