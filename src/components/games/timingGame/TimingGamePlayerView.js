import React, { forwardRef, useCallback, useContext, useMemo } from "react";
import 'styles/games/timingGame.scss';
import { useEffect, useRef, useState } from 'react';
import Matter, { Bodies, Body, Composite, Engine, Events, Render, World } from 'matter-js';
import { WebSocketContext } from "App";
import { Timer } from "components/ui/Timer";
import { useLocation, useParams } from "react-router-dom";
import { PeerConnection, PeerConnectionConfig } from "helpers/webRTC";
import Input from "models/Input";
import { LobbyContext, MinigameContext } from "components/routing/routers/AppRouter";
import PropTypes from "prop-types";
import { ActivationState } from "@stomp/stompjs";
import { useImperativeHandle } from "react";

export const TimingGamePlayerView = forwardRef((props, ref)=> {

    const connections = useContext(WebSocketContext);
    const lobbyContext = useContext(LobbyContext);
    const minigameContext = useContext(MinigameContext);

    const location = useLocation();
    const [feedback, setFeedback] = useState({
        show: false,
        text: ''
    })
    const [score, setScore] = useState(0);
    const [peerConnection, setPeerConnection] = useState(null);
    const gameContainer = useRef(null);
    const isMoving = useRef(false);
    const offset = useRef(0);
    const handledCollision = useRef(null);
    const frameCounter = useRef(0);
    const spawnOn = useRef(Math.floor(Math.random() * (500 - 200 + 1)) + 200)
    const circles = useRef([]);
    const engine = useRef(Engine.create());
    const rect = useRef(Bodies.rectangle(100, 250, 50, 50, { isStatic: true, isSensor: true, render: { fillStyle: '#ff7979' } }));

    const onConnected = (pc) => {
        pc.send(JSON.stringify({signal: "START", minigame: "TIMING_GAME"})); 
    }
    

    useImperativeHandle(ref, () => ({
        move() {
            moveRect();
        }
      }));
    
    // const onReceive = (data) => {
    //     console.log(data);
    //     const input = new Input(JSON.parse(data));
    //     if(input.inputType === 0){
    //         moveRect();
    //     }
    // }

    // useEffect(() => {
    //     const player = props.playerIndex === 0 ? minigameContext?.minigame.team1Player : minigameContext?.minigame.team2Player;
    //     if(connections.stompConnection.state === ActivationState.ACTIVE){
    //         connections.stompConnection.publish({
    //             destination: `lobbies/${lobbyContext.lobby.id}/players/${player.id}/signal`,
    //             body: JSON.stringify({
    //                 signal: "START",
    //                 minigame: "TIMING_GAME"
    //             })
    //         })
    //     }
    // }, [])
    // useEffect(() => {
    //     const player = props.playerIndex === 0 ? minigameContext?.minigame.team1Player : minigameContext?.minigame.team2Player;
    //     if(peerConnection === null){
    //         console.log("Created new peer connection class");
    //         const pc = new PeerConnection(new PeerConnectionConfig(
    //             connections.signalingConnection, onReceive, onConnected, lobbyContext?.lobby.id || -1, player?.id || -1 
    //         ))
    //         pc.connect()
           
    //         setPeerConnection(pc)
    //     }

    //     window.addEventListener('beforeunload', () => {console.log("Reloaded"); peerConnection?.close();});

    //     return () => {
    //         console.log("COmponent unmounted");
    //         if(peerConnection){
    //             console.log("Dispatch");
    //             peerConnection.close();
    //         }
    //     }
    // }, [minigameContext, lobbyContext])

    useEffect(() => {
        if (feedback.show) {
            setTimeout(() => {
                setFeedback({ show: false, text: '' })
            }, 500);
        }
    }, [feedback.show])



    /* ############################################################ */
    /* Enginge setup START*/
    /* ############################################################ */
    useEffect(() => {
        const render = Render.create({
            element: gameContainer.current,
            engine: engine.current,
            options: {
                width: 400,
                height: 500,
                wireframes: false,
                background: 'transparent',
                showDebug: false,
                isFixed: true
            },
        })

        engine.current.gravity.y = 0.0;
        engine.current.timing.timeScale = 2;

        Matter.Runner.run(engine.current)
        Matter.Common._seed = 12345678
        Render.run(render)
        Composite.add(engine.current.world, rect.current)

        const handleTimingFeedback = (body) => {
            if (body.position.y > 260) {
                setFeedback({ show: true, text: "To late" })
                setScore((old) => old + 1)
                Body.scale(body, 1, 0.5)
            } else if (body.position.y < 240) {
                setFeedback({ show: true, text: "To early" })
                setScore((old) => old + 1)
                Body.scale(body, 1, 0.5)
            } else {
                setFeedback({ show: true, text: "Perfect" })
                setScore((old) => old + 3)
                Composite.remove(engine.current.world, body);
            }
        };

        Events.on(engine.current, "beforeUpdate", function (event) {
            if (isMoving.current) {
                offset.current += 0.10;

                if (offset.current < 0) {
                    return;
                }

                if (offset.current > 3.14) {
                    Body.setVelocity(rect.current, { x: 0, y: 0 });
                    isMoving.current = false;
                    offset.current = 0;
                    return;
                }

                var px = 100 + 100 * Math.sin(offset.current);

                // body is static so must manually update velocity for friction to work
                // Body.setVelocity(rect.current, { x: px - rect.current.position.x, y: 0 });
                Body.setPosition(rect.current, { x: px, y: rect.current.position.y });
            }

            for (const circle of circles.current) {
                Body.setPosition(circle, { x: circle.position.x, y: circle.position.y + (50 * 0.13) })
            }
            if (frameCounter.current % spawnOn.current === 0) {
                addCircle();
                frameCounter.current = 0;
                spawnOn.current = 120;
            }
            frameCounter.current = frameCounter.current + 1;

        });

        Events.on(engine.current, 'collisionStart', (event) => {
            var pairs = event.pairs;
            var objA = pairs[0].bodyA;
            var objB = pairs[0].bodyB;
            if (handledCollision.current === objB.id) return;
            handleTimingFeedback(objB);
            handledCollision.current = objB.id;
        })
        // unmount
        return () => {
            // destroy Matter
            Render.stop(render)
            World.clear(engine.current.world)
            Engine.clear(engine.current)
            render.canvas.remove()
            render.canvas = null
            render.context = null
            render.textures = {}
        }
    }, [])

    /* ############################################################ */
    /* Enginge setup STOP*/
    /* ############################################################ */

    const addCircle = () => {
        const circle = Bodies.rectangle(200, 0, 50, 50, { label: 'obstacle', isStatic: false, render: { fillStyle: '#f6e58d' } });
        Composite.add(engine.current.world, circle);
        circles.current.push(circle);
    }

    const moveRect = () => {
        isMoving.current = true
    }

    return (
        <div style={{border: 'solid', width: "401px", height: "501px"}}>
            <h1>Score: {score}</h1>
            <h1 className={feedback.show ? 'overCanvas Feedback': 'overCanvas'}>{feedback.text}</h1>
            <div ref={gameContainer}></div>
        </div>
        

    )
})

TimingGamePlayerView.propTypes = {
    playerIndex: PropTypes.number.isRequired,
};
