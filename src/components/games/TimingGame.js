import { useLocation } from "react-router-dom"
import { TimingGamePlayerView } from "./timingGame/TimingGamePlayerView"

export const TimingGame = props => {
    const location = useLocation();
    
    return(
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
            <TimingGamePlayerView playerIndex={0}/>
            <TimingGamePlayerView playerIndex={1}/>
        </div>
    )
}