import 'styles/views/PlayersForNextGamePreview.scss';
import 'styles/views/GamePreview.scss';
import PlayerDisplay from './PlayerDisplay';

const PlayersForNextGamePreview = () => {
    return (
        <div className="Preview Container">
            <div className="Preview MinigamelabelBox">
                <label className="Preview Minigamelabel">Minigame</label>
            </div>
            <div className="Preview MinigametitleBox">
                <label className="Preview Minigametitle">Pong</label>
                <label className="Preview MinigamePoints">500pt</label>
            </div>
            <div className='PlayersForNextGamePreview PlayerContainer'>
                <PlayerDisplay />
                <label className='PlayersForNextGamePreview VersusLabel'>VS</label>
                <PlayerDisplay />

            </div>
        </div>
    );
}
export default PlayersForNextGamePreview;
