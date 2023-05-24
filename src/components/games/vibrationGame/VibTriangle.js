import { forwardRef, useImperativeHandle, useState } from 'react';
import '../../../styles/games/VibTriangle.scss'
import triangle from '../../../images/triangle.png'


export const VibTriangle = forwardRef((props, ref) => {

    const [playing, setPlaying] = useState(false);

    useImperativeHandle(ref, () => ({
        play() {
            setPlaying(true)
        }
    }));


    return (
        <img style={props.style} className={playing ? 'triangle play' : 'triangle'} src={triangle} />


    )

});