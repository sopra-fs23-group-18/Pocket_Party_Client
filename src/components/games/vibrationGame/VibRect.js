import { forwardRef, useImperativeHandle, useState } from 'react';
import '../../../styles/games/vibRect.scss'
import rect from '../../../images/rect.png'


export const VibRect = forwardRef((props, ref) => {

    const [playing, setPlaying] = useState(false);

    useImperativeHandle(ref, () => ({
        play() {
            setPlaying(true)
        }
    }));


    return (
        <img style={props.style} className={playing ? 'rect play' : 'rect'} src={rect} />
    )

});