import { forwardRef, useImperativeHandle, useState } from 'react';
import '../../../styles/games/VibTriangle.scss'


export const VibTriangle = forwardRef((props, ref) => {

    const [playing, setPlaying] = useState(false);

    useImperativeHandle(ref, () => ({
        play() {
            setPlaying(true)
        }
    }));


    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg">
                <polygon points="460,250 700,600 225,600" fill="#70DB8E" className={playing ? 'triangle play' : 'triangle'} />
            </svg>
        </div>
    )

});