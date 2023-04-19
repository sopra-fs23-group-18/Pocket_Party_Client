import 'styles/ui/GameHeader.scss'
import BaseContainer from './BaseContainer';
const GameHeader = () => {
    return (
        <BaseContainer>
            <label className="GameHeader Minigamelabel">Minigame</label>
            <div className='GameHeader Minigametitlebox'>
                <label className='GameHeader title'>Pong</label>
            </div>
        </BaseContainer>
    )
}
export default GameHeader;
