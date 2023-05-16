import React, { useState } from 'react';
import { api } from 'helpers/api';
import { useHistory } from 'react-router-dom';
import { Button } from 'components/ui/Button';
import 'styles/views/Lobby.scss';
import BaseContainer from "components/ui/BaseContainer";

const CreateLobby = props => {
  const history = useHistory();

  const doCreateLobby = async () => {
    const response = await api.post('/lobbies');
    history.push('/lobby', response.data);
  };



  return (
    <BaseContainer>
      <div className="lobby container">
        <div className="lobby form">
          <Button className="lobby button-container" onClick={() => doCreateLobby()}>
            Create Lobby
          </Button>
        </div>
      </div>
    </BaseContainer>
  );
};

export default CreateLobby;
