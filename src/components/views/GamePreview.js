import 'styles/views/GamePreview.scss';
const GamePreview = () => {
    return (
        <div className="Preview Container">
            <div className="Preview MinigamelabelBox">
                <label className="Preview Minigamelabel">Minigame</label>
            </div>
            <div className="Preview MinigametitleBox">
                <label className="Preview Minigametitle">Pong</label>
                <label className="Preview MinigamePoints">500pt</label>
            </div>
            <div>
                <label className="Preview HTP">How to play</label>
            </div>
            <div className='Preview DescBox'>
                <label className='Preview Description'>Description goes here</label>
            </div>
        </div>
    );
}
export default GamePreview;
