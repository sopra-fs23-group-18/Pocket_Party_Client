
import 'styles/views/PlayersForNextGamePreview.scss'
import 'styles/views/GamePreview.scss';
import { useEffect, useState } from 'react';
import { api } from 'helpers/api';
import PlayerContainer from 'components/ui/PlayerContainer';
import BaseContainer from 'components/ui/BaseContainer';
import GameHeader from 'components/ui/HeaderContainer';
import HeaderContainer from 'components/ui/HeaderContainer';
import { useHistory, useLocation } from 'react-router-dom';

//TODO implement api call for player names once the endpoint has been implemented in the backend
const PlayersForNextGamePreview = ({ id }) => {
    const location = useLocation();
    const [pointsToGain, setPointsToGain] = useState(0);
    const [name, setName] = useState('NA');
    const navigation = useHistory();
    useEffect(() => {
        setPointsToGain(Number.parseInt(location.state.scoreToGain))
        setName(formatMinigameTypeString(location.state.type));
    }, [location])

    function formatMinigameTypeString(type) {
        const words = type.split('_');
        const formattedWords = words.map(function (word) {
            const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            return capitalizedWord;
        });
        const formattedString = formattedWords.join(' ');
        return formattedString;
    }
    useEffect(() => {
        if (name !== 'NA') {
            setTimeout(() => {
                navigation.push("/game")
            }, 5000)
        }

    }, [name])

    return (
        <BaseContainer>
            <HeaderContainer title='Minigame' text={name} points={pointsToGain}></HeaderContainer>
            <div className='preview container'>
                <div className='playersForNextGamePreview player-team1'>
                    <PlayerContainer player={location.state.team1Player} />
                </div>
                <label className='playersForNextGamePreview versusLabel'>VS</label>
                <div className='playersForNextGamePreview player-team2'>
                    <PlayerContainer player={location.state.team2Player} />

                </div>
            </div>
        </BaseContainer>
    );
}
export default PlayersForNextGamePreview;
