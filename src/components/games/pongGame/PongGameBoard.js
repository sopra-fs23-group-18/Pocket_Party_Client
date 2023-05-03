import React, { forwardRef, useCallback, useContext, useMemo } from "react";
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
import "styles/games/pongGame.scss"

export const PongGameBoard = forwardRef((props, ref)=> {
    const gameContainer = useRef(null);
    const engine = useRef(Engine.create());
    const leftPaddleDirection = useRef(null);
    const rightPaddleDirection = useRef(null);

    useImperativeHandle(ref, () => ({
        moveRightPaddleUp() {
            rightPaddleDirection.current = "up";
        },
        moveRightPaddleDown() {
            rightPaddleDirection.current = "down";
        },
        moveLeftPaddleUp() {
            leftPaddleDirection.current = "up";
        },
        moveLeftPaddleDown() {
            leftPaddleDirection.current = "down";
        },
        stopRightPaddle() {
            rightPaddleDirection.current = null;
        },
        stopLeftPaddle() {
            leftPaddleDirection.current = null;
        }
        }));


    /// Ball and plank constants

    const BALL_SIZE = 20;
    const PLANK_HEIGHT = 100;
    const PLANK_WIDTH = 20;

    const GAME_WIDTH = 1000;
    const GAME_HEIGHT = 700;

    const BALL_START_POINT_X = GAME_WIDTH / 2 - BALL_SIZE;
    const BALL_START_POINT_Y = GAME_HEIGHT / 2;
    const BORDER = 30;

    const WINNING_SCORE = 5;

    const score = {
        playerOne: 0,
        playerTwo: 0
    }

    const ball = useRef(Bodies.circle(
        BALL_START_POINT_X,
        BALL_START_POINT_Y,
        BALL_SIZE, {
            inertia: 0,
            friction: 0,
            frictionStatic: 0,
            frictionAir: 0,
            restitution: 1.05,
            label: "ball"
        }
    ))

    const leftPaddle = useRef(Bodies.rectangle(
        BORDER,
        GAME_HEIGHT / 2,
        PLANK_WIDTH,
        PLANK_HEIGHT, {
            isStatic: false,
            friction: 100,
            inertia: Infinity,
            label: "plankOne"
        }   
    ));

    const rightPaddle = useRef(Bodies.rectangle(
        GAME_WIDTH - BORDER,
        GAME_HEIGHT / 2,
        PLANK_WIDTH,
        PLANK_HEIGHT, {
            isStatic: false,
            friction: 100,
            inertia: Infinity,
            label: "plankTwo"
        }
    ));

    const topWall = useRef(Bodies.rectangle(
        GAME_WIDTH / 2,
        BORDER,
        GAME_WIDTH,
        BORDER * 2, {
            isStatic: true,
            label: "topWall"
        }
    ));

    const bottomWall = useRef(Bodies.rectangle(
        GAME_WIDTH / 2,
        GAME_HEIGHT,
        GAME_WIDTH,
        BORDER * 2, {
            isStatic: true,
            label: "bottomWall"
        }
    ));

    /* ############################################################ */
    /* Enginge setup START*/
    /* ############################################################ */

    useEffect(() => {
        const render = Render.create({
            element: gameContainer.current,
            engine: engine.current,
            options: {
                width: GAME_WIDTH,
                height: GAME_HEIGHT,
                wireframes: false,
                background: "transparent"
            },
        })

        engine.current.world.y = 0;
        engine.current.timing.timeScale = 0.3;

        leftPaddle.current.render.fillStyle = "red";
        rightPaddle.current.render.fillStyle = "blue";

        /// Ball will start moving in a random direction
        const speed = 5;
        const angle = Math.random() * Math.PI * 2;
        const velocity = Matter.Vector.rotate({ x: speed, y: 0 }, angle); 
        
        Matter.Runner.run(engine.current)
        Render.run(render)
        Composite.add(engine.current.world, [leftPaddle.current, rightPaddle.current, ball.current, topWall.current, bottomWall.current])
        
        Body.setVelocity(ball.current, velocity);

        /// paddles should stop there initially
        Body.setVelocity(leftPaddle.current, {x: 0, y: 0});
        Body.setVelocity(rightPaddle.current, {x: 0, y: 0});

        
        Events.on(engine.current, "beforeUpdate", function (event) {
            /// move paddles up and down based on the direction
            if (leftPaddleDirection.current === null) {
                Body.setVelocity(leftPaddle.current, {x: 0, y: 0});
            }
            if (rightPaddleDirection.current === null) {
                Body.setVelocity(rightPaddle.current, {x: 0, y: 0});
            }
            if (leftPaddleDirection.current === "up") {
                Body.setVelocity(leftPaddle.current, {x: 0, y: -speed});
            }
            if (leftPaddleDirection.current === "down") {
                Body.setVelocity(leftPaddle.current, {x: 0, y: speed});
            }
            if (rightPaddleDirection.current === "up") {
                Body.setVelocity(rightPaddle.current, {x: 0, y: speed});
            }
            if (rightPaddleDirection.current === "down") {
                Body.setVelocity(rightPaddle.current, {x: 0, y: speed});
            }
            
        })

        /// paddles will keep moving until they hit the wall and then they will change direction
        Events.on(engine.current, "collisionStart", function (event) {
            var pairs = event.pairs;

            for (var i = 0, j = pairs.length; i != j; ++i) {
                var pair = pairs[i];
                /// if ball hits the wall, it will bounce off
                if (pair.bodyA.label === "ball" && pair.bodyB.label === "wall" || pair.bodyB.label === "ball" && pair.bodyA.label === "wall") {
                    var newAngle = Math.random() * Math.PI * 2;
                    Body.setVelocity(ball.current, Matter.Vector.rotate({x: speed, y:0}, newAngle));
                } 
                /// if ball hits the paddle, it will bounce off, but the paddle will not be affected

                if (pair.bodyA.label === "ball" && pair.bodyB.label === "plankOne" || pair.bodyB.label === "ball" && pair.bodyA.label === "plankOne") {
                    Body.setPosition(rightPaddle.current, rightPaddle.current.position)
                    Body.setVelocity(ball.current, Matter.Vector.reflect(ball.velocity, pair.collision.normal));
                }
                if (pair.bodyA.label === "ball" && pair.bodyB.label === "plankTwo" || pair.bodyB.label === "ball" && pair.bodyA.label === "plankTwo") {
                    Body.setPosition(leftPaddle.current, leftPaddle.current.position)
                    Body.setVelocity(ball.current, Matter.Vector.reflect(ball.velocity, pair.collision.normal));
                }
            }
        })  


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

    

    return (
        <div className="game-board" ref={gameContainer}></div>
    )
})
