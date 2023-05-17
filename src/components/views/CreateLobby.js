import React, { useState } from 'react';
import { api } from 'helpers/api';
import { useHistory } from 'react-router-dom';
import { Button } from 'components/ui/Button';
import 'styles/views/CreateLobby.scss';
import BaseContainer from 'components/ui/BaseContainer';
import Info from './Info';

const CreateLobby = (props) => {
  const history = useHistory();

  const doCreateLobby = async () => {
    const response = await api.post('/lobbies');
    history.push('/lobby', response.data);
  };

  return (
    <BaseContainer>
      <div className="createlobby container">
        <div className="createlobby info">
          <Info infotext={'Welcome to Pocket Party! blablablablabla this is a test'} />
        </div>
        <div className="createlobby form">
          <Button className="createlobby button-container" onClick={() => doCreateLobby()}>
            Create Lobby
          </Button>
        </div>
      </div>
    </BaseContainer>
  );
};

export default CreateLobby;
