import { api } from 'helpers/api';
import 'styles/views/GamePreview.scss';
import { useEffect, useState } from 'react';
import BaseContainer from 'components/ui/BaseContainer';
import HeaderContainer from 'components/ui/HeaderContainer';

const GamePreview = ({ id }) => {
    const [description, setDescription] = useState('Description has not loaded yet!');
    const [minigameTitle, setMinigameTitle] = useState('');
    const [points, setPoints] = useState('');
    useEffect(() => {
        const get_data = async () => {
            const data = await api.get(`lobbies/${id}/minigame`);
            setDescription(data.description);
            setMinigameTitle(data.type);
            setPoints(data.scoreToGain);
        };
        get_data();
    }, [id]);

    //TODO: get images and display it, get title and points and display them
    return (
        <BaseContainer>
            <HeaderContainer text={minigameTitle} title="Minigame" points={points}></HeaderContainer>
            <label className="preview label">How to play</label>
            <div className='preview descBox'>
                <label className='preview description'>{description}</label>
                <img className='preview image' src=''></img>
            </div>
        </BaseContainer>
    );
}

export default GamePreview;
