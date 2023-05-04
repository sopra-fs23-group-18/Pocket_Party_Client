import { forwardRef, useImperativeHandle, useState } from 'react';
import '../../../styles/games/VibCircle.scss'
import '../../../styles/games/vibRect.scss'
import '../../../styles/games/VibTriangle.scss'



export const VibMerge = forwardRef((props, ref) => {

    const [playing, setPlaying] = useState(false);

    useImperativeHandle(ref, () => ({
        play() {
            setPlaying(true)
        }
    }));


    return (
        <svg  xmlns="http://www.w3.org/2000/svg">

            <rect className={playing ? 'rect play' : 'rect'} />
            <circle className={playing ? 'circle play' : 'circle'} />
            <polygon points="460,250 675,600 275,600" fill="#70DB8E" className={playing ? 'triangle play' : 'triangle'} />


        </svg>
    )

});