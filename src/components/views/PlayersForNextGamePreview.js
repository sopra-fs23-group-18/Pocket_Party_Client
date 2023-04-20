import 'styles/views/PlayersForNextGamePreview.scss'
import 'styles/views/GamePreview.scss';
import { useEffect, useState } from 'react';
import { api } from 'helpers/api';
import PlayerContainer from 'components/ui/PlayerContainer';
import BaseContainer from 'components/ui/BaseContainer';
import GameHeader from 'components/ui/HeaderContainer';
import HeaderContainer from 'components/ui/HeaderContainer';

//TODO implement api call for player names once the endpoint has been implemented in the backend
const PlayersForNextGamePreview = ({ id }) => {
    // const [pointsToGain, setPointsToGain] = useState('');
    // const [name, setName] = useState('');
    // async function getData() {
    //     const response = await api.get(`/lobbies/${id}/minigame`);
    //     const name = response.type;
    //     const pointsToGain = response.scoreToGain;
    //     pointsToGain += "pt";
    //     setPointsToGain(pointsToGain || 'NA')
    //     setName(name || 'NA');
    // }
    // useEffect(() => {
    //     getData();
    // }, []);

    return (
        <BaseContainer>
        <HeaderContainer title='Minigame' text='Pong'></HeaderContainer>
            <div className='preview container'>
                <div className='playersForNextGamePreview player-team1'>
                    <PlayerContainer name='Player 1' team='team1' />
                </div>
                <label className='playersForNextGamePreview versusLabel'>VS</label>
                <div className='playersForNextGamePreview player-team2'>
                    <PlayerContainer name='Player 2' team='team2' />
                </div>
            </div>
        </BaseContainer>
    );
}
export default PlayersForNextGamePreview;
