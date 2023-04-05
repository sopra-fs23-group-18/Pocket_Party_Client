import 'styles/views/PlayersForNextGamePreview.scss';
import 'styles/views/GamePreview.scss';
import Player from 'components/ui/Player';

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
                <Player className='Player1' />
                <label className='PlayersForNextGamePreview VersusLabel'>VS</label>
                <Player className='Player2' />

            </div>
        </div>
    );
}
export default PlayersForNextGamePreview;
