import { forwardRef, useImperativeHandle, useState } from 'react';
import '../../../styles/games/VibCircle.scss'
import circle from '../../../images/circle.png'

export const VibCircle = forwardRef((props, ref) => {

    const [playing, setPlaying] = useState(false);

    useImperativeHandle(ref, () => ({
        play() {
            setPlaying(true)
        }
    }));


    return (
        <img style={props.style} className={playing ? 'vibCircle play' : 'vibCircle'} src={circle} />
        // <div style={{ display: 'flex', justifyContent: 'center' }}>
        //     <svg>
        //         <circle className={playing ? 'circle play' : 'circle'}>

        //         </circle>
        //     </svg>
        // </div>
    )

});