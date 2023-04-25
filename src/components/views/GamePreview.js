import { api } from 'helpers/api';
import 'styles/views/GamePreview.scss';
import { useEffect, useState } from 'react';
import BaseContainer from 'components/ui/BaseContainer';
import HeaderContainer from 'components/ui/HeaderContainer';
import { useLocation } from 'react-router-dom';

const GamePreview = () => {
    let location = useLocation();
    const lobbyId = location.state.lobbyId;

    // const [description, setDescription] = useState('Description has not loaded yet!');
    // const [minigameTitle, setMinigameTitle] = useState('');
    // const [points, setPoints] = useState(0);
    const [data, setData] = useState(null);
    useEffect(() => {
        async function fetchData() {
            const response = await api.get(`/lobbies/${lobbyId}/minigame`);

            setData(response.data);

        };
        fetchData();
    }, [lobbyId]);

    function formatMinigameTypeString(type) {
        const words = type.split('_');
        const formattedWords = words.map(function (word) {
            const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            return capitalizedWord;
        });
        const formattedString = formattedWords.join(' ');
        return formattedString;
    }

    function getImagePath(type) {
        return `${process.env.PUBLIC_URL}/images/${type.toLowerCase()}.png`;
    }
    //TODO: get images and display it, get title and points and display them
    return (
        <BaseContainer>
            <HeaderContainer text={formatMinigameTypeString(data?.type || '')} title="Minigame" points={data?.scoreToGain}></HeaderContainer>
            <label className="preview label">How to play</label>
            <div className='preview descBox'>
                <label className='preview description'>{data?.description}</label>
                <img className='preview image' src={getImagePath(data?.type || '')}></img>
            </div>
        </BaseContainer>
    );
}

export default GamePreview;
