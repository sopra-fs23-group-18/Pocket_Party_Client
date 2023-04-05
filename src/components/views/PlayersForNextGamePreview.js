import 'styles/views/PlayersForNextGamePreview.scss';
import 'styles/views/GamePreview.scss';
import Player from 'components/ui/Player';
//TODO implement api call for player names once the endpoint has been implemented in the backend
const PlayersForNextGamePreview = ({ id }) => {
    const [pointsToGain, setPointsToGain] = useState('');
    const [name, setName] = useState('');
    async function getData() {
        const response = await api.get(`/lobbies/${id}/minigame`);
        const name = response.type;
        const pointsToGain = response.scoreToGain;
        pointsToGain += "pt";
        setPointsToGain(pointsToGain || 'NA')
        setName(name || 'NA');
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
                <label className="Preview Minigametitle">{name}</label>
                <label className="Preview MinigamePoints">{pointsToGain}</label>
            </div>
            <div className='PlayersForNextGamePreview PlayerContainer'>
                <Player className='Player1' name='Player 1' />
                <label className='PlayersForNextGamePreview VersusLabel'>VS</label>
                <Player className='Player2' name='Player 2' />

            </div>
        </div>
    );
}
export default PlayersForNextGamePreview;
