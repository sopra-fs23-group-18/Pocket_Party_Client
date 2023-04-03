import { useEffect, useState } from 'react';
import { api, handleError } from 'helpers/api';
import { useHistory } from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import { Button } from 'components/ui/Button';
import "styles/views/Lobby.scss";
import Player from 'components/ui/Player';

const Lobby = props => {


    const history = useHistory();

    // useEffect(() => {
    //     // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    //     async function fetchData() {
    //         try {
    //             const response = await api.get('/users');

    //             await new Promise(resolve => setTimeout(resolve, 1000));

    //             // Get the returned users and update the state.
    //             setUsers(response.data);

    //             // This is just some data for you to see what is available.
    //             // Feel free to remove it.
    //             console.log('request to:', response.request.responseURL);
    //             console.log('status code:', response.status);
    //             console.log('status text:', response.statusText);
    //             console.log('requested data:', response.data);

    //             // See here to get more data.
    //             console.log(response);
    //         } catch (error) {
    //             console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
    //             console.error("Details:", error);
    //             alert("Something went wrong while fetching the users! See the console for details.");
    //         }
    //     }

    //     fetchData();
    // }, []);

    return (
        <BaseContainer>
            <div className='lobby field'>Lobby Pin: 123456
            </div>
            <div className="lobby container">
                <div className='lobby label color-team1'>Team 1
                    <div className="lobby form team1">
                        <ul className='user-list'>
                            {/* List of players in team 1 */}
                            <Player name='Sven'></Player>
                            <Player name='Nils'></Player>
                        </ul>
                    </div>
                </div>
                <div>
                    <ul className='user-list'>
                        {/* List of unassigned players */}
                        <Player name='Stefan'></Player>
                    </ul>
                </div>
                <div className='lobby label color-team2'> Team 2
                    <div className="lobby form team2">
                        <ul className='user-list'>
                            {/* List of players in team 2 */}
                        </ul>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
}

export default Lobby;