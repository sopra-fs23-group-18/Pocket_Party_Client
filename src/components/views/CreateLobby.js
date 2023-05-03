import React, { useContext, useState } from 'react';
import { api, handleError } from 'helpers/api';
import { useHistory } from 'react-router-dom';
import { Button } from 'components/ui/Button';
import { Timer } from 'components/ui/Timer';
import 'styles/views/Lobby.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { LobbyContext } from 'components/routing/routers/AppRouter';

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */

const CreateLobby = props => {
const history = useHistory();


  return (
    <BaseContainer>
      <div className="lobby container">
        <div className="lobby form">
          <div className="lobby button-container">
            <Button
              width="100%"
              onClick={() => history.push('/settings')}
            >
              Create Lobby
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
    
    
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default CreateLobby;
