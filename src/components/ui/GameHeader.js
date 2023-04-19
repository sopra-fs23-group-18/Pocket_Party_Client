import 'styles/ui/GameHeader.scss'
import BaseContainer from './BaseContainer';
import { useState, useEffect } from 'react';
import { api } from 'helpers/api';
const GameHeader = ({ lobbyId }) => {
    const [info, setInfo] = useState({ type: 'Not Found', scoreToGain: 'Not Found' });
    useEffect(() => {
        const get_data = async () => {
            const data = await api.get(`lobbies/${lobbyId}/minigame`);
            setInfo(data);
        };

        get_data();
    }, [lobbyId]);
    return (
        <BaseContainer>
            <div className="GameHeader Minigamecontainer">
                <label className='GameHeader Minigamelabel'>Minigame</label>
            </div>
            <div className='GameHeader Minigametitlebox'>
                <label className='GameHeader title'>{info.type}</label>
                <label className='GameHeader pts'>{info.scoreToGain}pt</label>
            </div>
        </BaseContainer>
    )
}
export default GameHeader;
