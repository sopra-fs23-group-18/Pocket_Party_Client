import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Trail } from 'react-spring';
import '../../../styles/games/VibCircle.scss'
import '../../../styles/games/vibRect.scss'
import '../../../styles/games/VibTriangle.scss'
import { VibCircle } from './VibCircle';
import { VibRect } from './VibRect';
import { VibTriangle } from './VibTriangle';



export const VibMerge = forwardRef((props, ref) => {

    const rect = useRef();
    const triangle = useRef();
    const circle = useRef();

    useImperativeHandle(ref, () => ({
        play() {
            rect.current?.play();
            triangle.current?.play();
            circle.current?.play()
        }
    }));


    return (
        <div style={{display: "grid", position: "relative"}}>
            <VibRect style={{gridColumn: 1, gridRow: 1}} ref={rect}/>
            <VibCircle style={{gridColumn: 1, gridRow: 1}} ref={circle}/>
            <VibTriangle style={{gridColumn: 1, gridRow: 1 }} ref={triangle}/>
        </div>
    )

});