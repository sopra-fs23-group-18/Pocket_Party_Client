import React, { useState } from 'react';
import { api } from 'helpers/api';
import { useHistory } from 'react-router-dom';
import { Button } from 'components/ui/Button';
import 'styles/views/CreateLobby.scss';
import BaseContainer from 'components/ui/BaseContainer';
import Info from '../ui/Info';
import { handleError } from 'helpers/api';
import pocketpartylogo from 'images/pocketpartylogo.png'

const CreateLobby = (props) => {
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState('');

  const doCreateLobby = async () => {
    try {
      const response = await api.post('/lobbies');
      history.push('/lobby', response.data);
    } catch (error) {
      alert(`Error!\n${handleError(error)}`)
    }
  };

  return (
    <BaseContainer>
      {/* <img className='logo' src={pocketpartylogo}></img> */}
      <div className="createlobby container">
        <div className="createlobby info">
          <Info infotext={'Welcome to Pocket Party! This is a party game for at least two players where you will compete in several different minigames until a team has reached the winning score! Click the button below to get started.'} />
        </div>
        <div className="createlobby form">
          <img className='logo' src={pocketpartylogo}></img>
          <Button className="createlobby button-container" onClick={() => doCreateLobby()}>
            Create Lobby
          </Button>
        </div>
      </div>
    </BaseContainer>
  );
};

export default CreateLobby;
