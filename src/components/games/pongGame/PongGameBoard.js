import React, { forwardRef,  useContext } from "react";
import { useEffect, useRef, useState } from 'react';
import Matter, { Bodies, Body, Composite, Engine, Events, Render, World } from 'matter-js';
import { Timer } from "components/ui/Timer";
import { useHistory} from "react-router-dom";
import Input from "models/Input";
import { MinigameContext } from "components/routing/routers/AppRouter";
import PropTypes from "prop-types";
import { useImperativeHandle } from "react";
import "styles/games/PongGame.scss"
import PlayerContainer from "components/ui/PlayerContainer";

export const PongGameBoard = forwardRef((props, ref) => {
    const gameContainer = useRef(null);
    const engine = useRef(Engine.create());
    const history = useHistory();
    const leftPaddleDirection = useRef(null);
    const rightPaddleDirection = useRef(null);
    const [score, setScore] = useState({
        left: 0,
        right: 0
    });
    const [winner, setWinner] = useState(null);
    const timeScale = useRef(1);

    const minigameContext = useContext(MinigameContext);

    


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

    // keep track of the score
    useEffect(() => {
        localStorage.setItem("score", JSON.stringify(score));
    }, [score]);

    // Load score from local storage on mount
    useEffect(() => {
        const storedScore = localStorage.getItem("score");
        if (storedScore) {
            setScore(JSON.parse(storedScore));
        }
    }, []);

    // display winner
    useEffect(() => {
        if (winner) {
            setTimeout(() => {
                setWinner(null);
            }, 1000);
        }
    }, [winner]);

    // redircet to winning page when game is over
    useEffect(() => {
        // check if a winner exists, if so, redirect to the winner page
        if (score.left === WINNING_SCORE || score.right === WINNING_SCORE) {
            const scoreToGain = minigameContext.minigame.scoreToGain;
            const total = score.left + score.right;
            const winnerScore = Math.round(WINNING_SCORE / total * scoreToGain);
            const winningTeam = score.left === WINNING_SCORE ? { color: "red", name: "Team Red" } : { color: "blue", name: "Team Blue" };
            const winner = { score: winnerScore, color: winningTeam.color, name: winningTeam.name }
            const loser = { score: scoreToGain - winnerScore }
            setTimeout(() => {
                history.push("/minigameWon", { winner, loser })
            }, 1000);
        }
    }, [score]);




    /// Ball and plank constants

    const BALL_SIZE = 30;
    const PLANK_HEIGHT = 150;
    const PLANK_WIDTH = 20;

    const GAME_WIDTH = 1000;
    const GAME_HEIGHT = 700;

    const BALL_START_POINT_X = GAME_WIDTH / 2 - BALL_SIZE;
    const BALL_START_POINT_Y = GAME_HEIGHT / 2;
    const BORDER = 30;

    const WINNING_SCORE = 5;

    const ball = useRef(Bodies.circle(
        BALL_START_POINT_X,
        BALL_START_POINT_Y,
        BALL_SIZE, {
        inertia: 0,
        friction: 0,
        frictionStatic: 0,
        frictionAir: 0,
        restitution: 1.05,
        collisionFilter: {
            category: 0x0001,
        },
        render: {
            fillStyle: 'rgb(144, 238, 144)'
        },
        maxspeed: 15,
        label: "ball"
    }
    ))

    const leftPaddle = useRef(Bodies.rectangle(
        BORDER,
        GAME_HEIGHT / 2,
        PLANK_WIDTH,
        PLANK_HEIGHT, {
        isStatic: false,
        inertia: Infinity,
        render: {
            fillStyle: "red"
        },
        label: "plankOne"
    }
    ));

    const rightPaddle = useRef(Bodies.rectangle(
        GAME_WIDTH - BORDER,
        GAME_HEIGHT / 2,
        PLANK_WIDTH,
        PLANK_HEIGHT, {
        isStatic: false,
        inertia: Infinity,
        render: {
            fillStyle: "blue"
        },
        label: "plankTwo"
    }
    ));

    const leftWall = useRef(Bodies.rectangle(
        0,
        GAME_HEIGHT / 2,
        BORDER * 1.5,
        GAME_HEIGHT, {
        isStatic: true,
        render: {
            fillStyle: 'rgb(221, 106, 89)'
        },
        label: "leftGoalWall"
    }
    ));

    const rightWall = useRef(Bodies.rectangle(
        GAME_WIDTH,
        GAME_HEIGHT / 2,
        BORDER * 1.5,
        GAME_HEIGHT, {
        isStatic: true,
        render: {
            fillStyle: "lightblue"
        },
        label: "rightGoalWall"
    }
    ));

    const topWall = useRef(Bodies.rectangle(
        GAME_WIDTH / 2,
        0,
        GAME_WIDTH,
        BORDER, {
        isStatic: true,
        render: {
            fillStyle: 'rgb(144, 238, 144)'
        },
        label: "wall"
    }
    ));

    const bottomWall = useRef(Bodies.rectangle(
        GAME_WIDTH / 2,
        GAME_HEIGHT,
        GAME_WIDTH,
        BORDER, {
        isStatic: true,
        render: {
            fillStyle: 'rgb(144, 238, 144)'
        },
        label: "wall"
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
                background: 'rgb(1, 50, 32)'
            },
        })

        engine.current.gravity.y = 0;
        engine.current.timing.timeScale = timeScale.current;

        /// Ball will start moving in a random direction
        const speed = 5;
        const angle = Math.random() * Math.PI * 2;
        const velocity = Matter.Vector.rotate({ x: speed, y: 0 }, angle);

        Matter.Runner.run(engine.current)
        Render.run(render)
        Composite.add(engine.current.world, [leftPaddle.current, rightPaddle.current, ball.current, topWall.current, bottomWall.current, leftWall.current, rightWall.current])

        Body.setVelocity(ball.current, velocity);

        /// paddles should stop there initially
        Body.setVelocity(leftPaddle.current, { x: 0, y: 0 });
        Body.setVelocity(rightPaddle.current, { x: 0, y: 0 });

        const isGoal = () => {
            leftPaddleDirection.current = null;
            rightPaddleDirection.current = null;
            Body.setPosition(ball.current, { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
            let newAngle = Math.random() * Math.PI * 2;
            Body.setVelocity(ball.current, Matter.Vector.rotate({ x: speed, y: 0 }, newAngle));
            //pause the game for 1 second
            engine.current.timing.timeScale = 0;
            setTimeout(() => {
                engine.current.timing.timeScale = timeScale.current;
            }
                , 1000)
        }


        Events.on(engine.current, "beforeUpdate", function (event) {
            /// move paddles up and down based on the direction
            if (leftPaddleDirection.current === null) {
                Body.setVelocity(leftPaddle.current, { x: 0, y: 0 });
            }
            if (rightPaddleDirection.current === null) {
                Body.setVelocity(rightPaddle.current, { x: 0, y: 0 });
            }
            if (leftPaddleDirection.current === "up") {
                Body.setVelocity(leftPaddle.current, { x: 0, y: -speed });
            }
            if (leftPaddleDirection.current === "down") {
                Body.setVelocity(leftPaddle.current, { x: 0, y: speed });
            }
            if (rightPaddleDirection.current === "up") {
                Body.setVelocity(rightPaddle.current, { x: 0, y: -speed });
            }
            if (rightPaddleDirection.current === "down") {
                Body.setVelocity(rightPaddle.current, { x: 0, y: speed });
            }

        })

        /// paddles will keep moving until they hit the wall and then they will change direction
        Events.on(engine.current, "collisionStart", function (event) {
            var pairs = event.pairs;

            for (var i = 0, j = pairs.length; i != j; ++i) {
                var pair = pairs[i];
                /// if ball hits the wall, it will bounce off
                if (pair.bodyA.label === "ball" && pair.bodyB.label === "wall" || pair.bodyB.label === "ball" && pair.bodyA.label === "wall") {
                    Body.setVelocity(ball.current, { x: ball.current.velocity.x * 2, y: -ball.current.velocity.y });
                }
                /// if ball hits the paddle, it will bounce off, but the paddle will not be affected

                if (pair.bodyA.label === "ball" && pair.bodyB.label === "plankOne" || pair.bodyB.label === "ball" && pair.bodyA.label === "plankOne") {
                    Body.setVelocity(ball.current, { x: -ball.current.velocity.x * 2, y: ball.current.velocity.y * Math.random() });
                }
                if (pair.bodyA.label === "ball" && pair.bodyB.label === "plankTwo" || pair.bodyB.label === "ball" && pair.bodyA.label === "plankTwo") {
                    Body.setVelocity(ball.current, { x: -ball.current.velocity.x * 2, y: ball.current.velocity.y * Math.random() });
                }

                /// if ball hits the goal wall, it will be reset to the middle and update the score, and pause the game for 1 second
                if (pair.bodyA.label === "ball" && pair.bodyB.label === "leftGoalWall" || pair.bodyB.label === "ball" && pair.bodyA.label === "leftGoalWall") {
                    /// update the score
                    setScore((prev) => {
                        return {
                            ...prev,
                            right: prev.right + 1
                        }
                    })
                    setWinner("Point for Blue!");
                    isGoal();
                }
                if (pair.bodyA.label === "ball" && pair.bodyB.label === "rightGoalWall" || pair.bodyB.label === "ball" && pair.bodyA.label === "rightGoalWall") {
                    /// update the score
                    setScore((prev) => {
                        return {
                            ...prev,
                            left: prev.left + 1
                        }
                    })
                    setWinner("Point for Red!");
                    isGoal();
                }

                /// if paddle hits the wall, it will stop
                if (pair.bodyA.label === "plankOne" && pair.bodyB.label === "wall" || pair.bodyB.label === "plankOne" && pair.bodyA.label === "wall") {
                    Body.setVelocity(leftPaddle.current, { x: 0, y: 0 });
                }
                if (pair.bodyA.label === "plankTwo" && pair.bodyB.label === "wall" || pair.bodyB.label === "plankTwo" && pair.bodyA.label === "wall") {
                    Body.setVelocity(rightPaddle.current, { x: 0, y: 0 });
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
        <div>
            <div className="game-board" ref={gameContainer}></div>
            <h1 className={'left-score'}>{score.left}</h1>
            <h1 className={'right-score'}>{score.right}</h1>
            <h1 className={winner === "Point for Red!" ? 'red-winner' : 'blue-winner'}>{winner}</h1>
        </div>
    )
})
