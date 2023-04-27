
import 'styles/views/PlayersForNextGamePreview.scss'
import 'styles/views/GamePreview.scss';
import { useContext, useEffect, useState } from 'react';
import PlayerContainer from 'components/ui/PlayerContainer';
import BaseContainer from 'components/ui/BaseContainer';
import HeaderContainer from 'components/ui/HeaderContainer';
import { useHistory } from 'react-router-dom';
import { MinigameContext } from 'components/routing/routers/AppRouter';

//TODO implement api call for player names once the endpoint has been implemented in the backend
const PlayersForNextGamePreview = ({ id }) => {
    const minigameContext = useContext(MinigameContext);
    const [pointsToGain, setPointsToGain] = useState(0);
    const [name, setName] = useState('NA');
    const navigation = useHistory();
    useEffect(() => {
        setPointsToGain(Number.parseInt(minigameContext.minigame.scoreToGain))
        setName(formatMinigameTypeString(minigameContext.minigame.type));
    }, [])
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
            <div className='playersForNextGamePreview container'>
                <div className='playersForNextGamePreview player-team1'>
                    <PlayerContainer team='team1' player={minigameContext.minigame.team1Player} />
                </div>
                <label className='playersForNextGamePreview versusLabel'>VS</label>
                <div className='playersForNextGamePreview player-team2'>
                    <PlayerContainer team='team2' player={minigameContext.minigame.team2Player} />

                </div>
            </div>
        </BaseContainer>
    );
}
export default PlayersForNextGamePreview;
