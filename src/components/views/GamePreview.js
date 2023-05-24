import { api } from 'helpers/api';
import 'styles/views/GamePreview.scss';
import { useContext, useEffect, useState } from 'react';
import BaseContainer from 'components/ui/BaseContainer';
import HeaderContainer from 'components/ui/HeaderContainer';
import { useHistory, useLocation } from 'react-router-dom';
import { GameContext, LobbyContext, MinigameContext } from 'components/routing/routers/AppRouter';
import { Button } from 'components/ui/Button';
import pong_game from '../../images/pong_game.png'
import tapping_game from '../../images/tapping_game.png'
import timing_game from '../../images/timing_game.png'

const GamePreview = () => {
    let location = useLocation();
    const minigameContext = useContext(MinigameContext);
    const lobbyContext = useContext(LobbyContext);
    const gameContext = useContext(GameContext);
    const [errorMessage, setErrorMessage] = useState('');
    // const [description, setDescription] = useState('Description has not loaded yet!');
    // const [minigameTitle, setMinigameTitle] = useState('');
    // const [points, setPoints] = useState(0);
    const [data, setData] = useState(null);
    const history = useHistory();

    useEffect(() => {
        async function fetchData() {
            const responsePost = await api.post(`/lobbies/${lobbyContext.lobby.id}/games/${gameContext.game.id}/minigames`);
            if (responsePost.status !== 201) {
                setErrorMessage(responsePost.status);
                history.push({
                    pathname: '/error',
                    state: { msg: errorMessage }
                });

                return;
            }
            const responsePut = await api.put(`/lobbies/${lobbyContext.lobby.id}/games/${gameContext.game.id}/minigames`);
            if (responsePut.status !== 204) {
                setErrorMessage(responsePut);
                history.push({
                    pathname: '/error',
                    state: { msg: errorMessage }
                });
                return
            }
            const responseGet = await api.get(`/lobbies/${lobbyContext.lobby.id}/games/${gameContext.game.id}/minigame`);
            if (responseGet.status !== 200) {
                setErrorMessage(responseGet.status);
                history.push({
                    pathname: '/error',
                    state: { msg: errorMessage }
                });

            }
            setData(responseGet.data);
            minigameContext.setMinigame(responseGet.data)
            localStorage.setItem("minigameContext", JSON.stringify(responseGet.data));

        };
        fetchData();
    }, []);

    const next = () => {
        history.push("/playerPreview", data)
    }
    //maybe add formatMinigameTypeString helper function
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
        return `../../images/${type.toLowerCase()}.png`;
    }
    return (
        <BaseContainer>
            <HeaderContainer text={formatMinigameTypeString(data?.type || '')} title="Minigame" points={data?.scoreToGain}></HeaderContainer>
            <label className="preview label">How to play</label>
            <div className='preview descBox'>
                <label className='preview description'>{data?.description}</label>
                <img className='preview image' src={data?.type}></img>
            </div>
            <Button className='preview button-container' onClick={next}>Start game!</Button>
        </BaseContainer>
    );
}

export default GamePreview;
