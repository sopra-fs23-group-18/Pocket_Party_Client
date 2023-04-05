import { api } from 'helpers/api';
import 'styles/views/GamePreview.scss';

const GamePreview = ({ id }) => {
    const [description, setDescription] = useState('');
    const [pointsToGain, setPointsToGain] = useState('');
    async function getData() {
        const response = await api.get(`'/lobbies/${id}/minigame'`);
        const description = response.description;
        const pointsToGain = response.scoreToGain;
        pointsToGain += " pt";
        setPointsToGain(pointsToGain || 'Points could not be loaded!')
        setDescription(description || 'The description could not be loaded!');
    }
    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="Preview Container">
            <div className="Preview MinigamelabelBox">
                <label className="Preview Minigamelabel">Minigame</label>
            </div>
            <div className="Preview MinigametitleBox">
                <label className="Preview Minigametitle">Pong</label>
                <label className="Preview MinigamePoints">{pointsToGain}</label>
            </div>
            <div>
                <label className="Preview HTP">How to play</label>
            </div>
            <div className='Preview DescBox'>
                <label className='Preview Description'>{description}</label>
            </div>
        </div>
    );
}

export default GamePreview;
