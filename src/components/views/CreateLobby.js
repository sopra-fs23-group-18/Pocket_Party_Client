import React, { useState } from 'react';
import { api } from 'helpers/api';
import { useHistory } from 'react-router-dom';
import { Button } from 'components/ui/Button';
import 'styles/views/Lobby.scss';
import BaseContainer from "components/ui/BaseContainer";

const CreateLobby = props => {
  const history = useHistory();
  const [winningScore, setWinningScore] = useState(2000);

  const doCreateLobby = async () => {
    const response = await api.post('/lobbies');
    history.push('/lobby', response.data);
  };

  const handleOptionClick = (score) => {
    setWinningScore(score);
  };

  return (
    <BaseContainer>
      <div className="lobby container">
        <div className="lobby form">
          <div className='lobby label'>Duration</div>
          <div className="lobby settings">
            <div className={`option ${winningScore === 1000 ? 'selected' : ''}`} onClick={() => handleOptionClick(1000)}>
              <span className="option-label">Short</span>
            </div>
            <div className={`option ${winningScore === 2000 ? 'selected' : ''}`} onClick={() => handleOptionClick(2000)}>
              <span className="option-label">Normal</span>
            </div>
            <div className={`option ${winningScore === 3000 ? 'selected' : ''}`} onClick={() => handleOptionClick(3000)}>
              <span className="option-label">Long</span>
            </div>
          </div>
          <Button className="lobby button-container" onClick={() => doCreateLobby()}>
            Create Lobby
          </Button>
        </div>
      </div>
    </BaseContainer>
  );
};

export default CreateLobby;
