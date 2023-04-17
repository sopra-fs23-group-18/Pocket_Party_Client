import { api } from 'helpers/api';
import 'styles/views/GamePreview.scss';
import { useEffect, useState } from 'react';
import BaseContainer from 'components/ui/BaseContainer';

const GamePreview = ({ id }) => {
    const [description, setDescription] = useState('');
    const [pointsToGain, setPointsToGain] = useState('');
    const [name, setName] = useState('');
    async function getData() {
        const response = await api.get(`/lobbies/${id}/minigame`);
        const description = response.description;
        const name = response.type;
        const pointsToGain = response.scoreToGain;
        pointsToGain += "pt";
        setPointsToGain(pointsToGain || 'NA')
        setDescription(description || 'The description could not be loaded!');
        setName(name || 'NA');
    }
    useEffect(() => {
        getData();
    }, []);

    return (
        <BaseContainer>
            <div className="preview minigamelabelBox">Minigame
            </div>
            <div className='preview container'>
                {/* <div className="Preview MinigametitleBox">
                <label className="Preview Minigametitle">{name}</label>
                <label className="Preview MinigamePoints">{pointsToGain}</label>
            </div> */}
                <div>
                    <label className="preview label">How to play</label>
                    <div className='preview descBox'>
                        {/* <label className='preview description'>{description}</label> */}
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
}

export default GamePreview;
