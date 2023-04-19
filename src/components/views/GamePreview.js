import { api } from 'helpers/api';
import 'styles/views/GamePreview.scss';
import { useEffect, useState } from 'react';
import BaseContainer from 'components/ui/BaseContainer';
import GameHeader from 'components/ui/GameHeader';

const GamePreview = ({ id }) => {
    const [description, setDescription] = useState('Description has not loaded yet!');
    useEffect(() => {
        const get_data = async () => {
            const data = await api.get(`lobbies/${id}/minigame`);
            setDescription(data.description);
        };
        get_data();
    }, [id]);

    return (
        <BaseContainer>
            <GameHeader lobbyId={id} />
            <div className='preview desccontainer'>
                <label className="preview label">How to play</label>
                <div className='preview descBox'>
                    <label className='preview description'>{description}</label>
                </div>
            </div>
        </BaseContainer>
    );
}

export default GamePreview;
