import React, { useEffect, useState } from 'react';
import { Button } from "components/ui/Button";
import 'styles/games/RPSGame.scss';
import { ActivationState } from "@stomp/stompjs";
import { WebSocketContext } from "App";
import { useContext } from "react";
import { LobbyContext, MinigameContext } from "components/routing/routers/AppRouter";
import { useHistory } from "react-router-dom";
import PlayerContainer from "components/ui/PlayerContainer";
import { Timer } from "components/ui/Timer";
export const RPSGame = () => {
  const [playerOneChoice, setPlayerOneChoice] = useState("hold");
  const [playerTwoChoice, setPlayerTwoChoice] = useState("hold");
  const [playerOneDecision, setPlayerOneDecision] = useState(null);
  const [playerTwoDecision, setPlayerTwoDecision] = useState(null);
  const [winnerEachRound, setWinnerEachRound] = useState(null);
  const [score, setScore] = useState({ playerOne: 0, playerTwo: 0 });

  const history = useHistory();

  const choices = ['rock', 'paper', 'scissors'];

  const connections = useContext(WebSocketContext);
  const lobbyContext = useContext(LobbyContext);
  const minigameContext = useContext(MinigameContext);

  //const WINNING_SCORE = 5;

  // determine winner for each round
  const determineWinner = (playerOneChoice, playerTwoChoice) => {
    if (playerOneChoice === playerTwoChoice) {
      setWinnerEachRound('tie');
    } else if (
      (playerOneChoice === 'rock' && playerTwoChoice === 'scissors') ||
      (playerOneChoice === 'paper' && playerTwoChoice === 'rock') ||
      (playerOneChoice === 'scissors' && playerTwoChoice === 'paper')
    ) {
      setScore({ playerOne: score.playerOne + 1, playerTwo: score.playerTwo });
      setWinnerEachRound('playerOne');
    } else {
      setScore({ playerOne: score.playerOne, playerTwo: score.playerTwo + 1 });
      setWinnerEachRound('playerTwo');
    }
  };

  const onPlayerOneInput = (msg) => {
    const data = JSON.parse(msg.body);
    if (data.inputType === 'RPS') {
      setPlayerOneDecision(choices[data.rawData.x]);
    }
  };

  const onPlayerTwoInput = (msg) => {
    const data = JSON.parse(msg.body);
    if (data.inputType === 'RPS') {
      setPlayerOneDecision(choices[data.rawData.x]);
    }
  };

  // store player score in local storage
  useEffect(() => {
    localStorage.setItem('score', JSON.stringify(score));
  }, [score]);

  // retrieve player score from local storage
  useEffect(() => {
    const score = JSON.parse(localStorage.getItem('score'));
    if (score) {
      setScore(score);
    }
  }, []);
    

  // determine winner after both players have made a choice
  useEffect(() => {
    if (playerOneDecision && playerTwoDecision) {
      setPlayerOneChoice(playerOneDecision);
      setPlayerTwoChoice(playerTwoDecision);
      setPlayerOneDecision(null);
      setPlayerTwoDecision(null);
      determineWinner(playerOneDecision, playerTwoDecision);
    }
  }, [playerOneDecision, playerTwoDecision]);

  // display winner
  useEffect(() => {
    if (winnerEachRound) {
      setTimeout(() => {
        setPlayerOneChoice("hold");
        setPlayerTwoChoice("hold");
        setWinnerEachRound(null);
      }, 2000);
    }
  }, [winnerEachRound]);

  // redircet to winning page when game is over
  // useEffect(() => {
  //   if (score.playerOne === WINNING_SCORE || score.playerTwo === WINNING_SCORE) {
  //     const scoreToGain = minigameContext.minigame.scoreToGain;
  //     const total = score.playerOne + score.playerTwo;
  //     const winnerScore = Math.round(WINNING_SCORE / total * scoreToGain); 
  //     const winningTeam = score.playerOne === WINNING_SCORE ? { color: "red", name: "Team Red" } : { color: "blue", name: "Team Blue" };
  //     const winner = { score: winnerScore, color: winningTeam.color, name: winningTeam.name }
  //     const loser = { score: scoreToGain - winnerScore}
  //     setTimeout(() => {
  //       history.push("/minigameWon", { winner, loser })
  //     }, 1000);
  //   }
  // }, [score]);

  // websocket connection
  useEffect(() => {
    if (connections.stompConnection.state === ActivationState.ACTIVE) {
        connections.stompConnection.publish({
            destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[0].id}/signal`,
            body: JSON.stringify({
                signal: "START",
                minigame: "RPS_GAME"
            })
        })
        connections.stompConnection.publish({
            destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[0].id}/signal`,
            body: JSON.stringify({
                signal: "START",
                minigame: "RPS_GAME"
            })
        })
    }
    return () => {
        if (connections.stompConnection.state === ActivationState.ACTIVE) {
            connections.stompConnection.publish({
                destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[0].id}/signal`,
                body: JSON.stringify({
                    signal: "STOP",
                    minigame: "RPS_GAME"
                })
            })
            connections.stompConnection.publish({
                destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[0].id}/signal`,
                body: JSON.stringify({
                    signal: "STOP",
                    minigame: "RPS_GAME"
                })
            })
        }
    }
}, [])

useEffect(() => {
    if (connections.stompConnection.state === ActivationState.ACTIVE) {
        connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[0].id}/input`, onPlayerOneInput);
        connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[0].id}/input`, onPlayerTwoInput);
        return;
    }
    console.log("Subscribing to input");
    connections.stompConnection.onConnect = (_) => {
        connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[0].id}/input`, onPlayerOneInput);
        connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[0].id}/input`, onPlayerTwoInput);

        connections.stompConnection.publish({
            destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[0].id}/signal`,
            body: JSON.stringify({
                signal: "START",
                minigame: "RPS_GAME"
            })
        })
        connections.stompConnection.publish({
            destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[0].id}/signal`,
            body: JSON.stringify({
                signal: "START",
                minigame: "RPS_GAME"
            })
        })
    };
}, [connections, lobbyContext, minigameContext])

  return (
    <div className="container">
      <h1>Rock Paper Scissors</h1>
      <div className="scoreboard">
      <div className="player-one-score">
        {score.playerOne}
      </div>
      <div className="player-two-score">
        {score.playerTwo}
      </div>
    </div>
     
      <div className="choices-container">
      <PlayerContainer team="team1" player={minigameContext.minigame.team1Players[0]} />
        <p className={`choice ${playerOneChoice ? 'player-one-choice' : ''}`}>
          {playerOneChoice && (
            <>
              {playerOneChoice === 'rock' && (
                <span role="img" aria-label="rock" style={{ fontSize: '10rem' }}>
                ✊
              </span>
              )}
              {playerOneChoice === 'paper' && (
                <span role="img" aria-label="paper" style={{ fontSize: '10rem' }}>
                🖐️
              </span>
              )}
              {playerOneChoice === 'scissors' && (
                <span role="img" aria-label="scissors" style={{ fontSize: '10rem' }}>
                ✌️
              </span>              
              )}
              {playerOneChoice === 'hold' && (
                <span role="img" aria-label="funny" style={{ fontSize: '10rem' }}>
                😜
              </span>
              
              )} 
            </>
          )}
        </p>
        <PlayerContainer team="team2" player={minigameContext.minigame.team2Players[0]} />
        <p className={`choice ${playerTwoChoice ? 'player-two-choice' : ''}`}>
          {playerTwoChoice && (
            <>
              {playerTwoChoice === 'rock' && (
                <span role="img" aria-label="rock" style={{ fontSize: '10rem' }}>
                ✊
              </span>
              )}
              {playerTwoChoice === 'paper' && (
                <span role="img" aria-label="paper" style={{ fontSize: '10rem' }}>
                🖐️
              </span>
              )}
              {playerTwoChoice === 'scissors' && (
                <span role="img" aria-label="scissors" style={{ fontSize: '10rem' }}>
                ✌️
              </span>
              )}
              {playerTwoChoice === 'hold' && (
                <span role="img" aria-label="funny" style={{ fontSize: '10rem' }}>
                😜
              </span>
              
              )}
            </>
          )}
        </p>
      </div>
      <div className="winner">
        {winnerEachRound && (
          <>
            {winnerEachRound === 'tie' && (
              <span role="img" aria-label="tie" style={{ fontSize: '5rem' }}>
                🤝 tie
              </span>
            )}
            {winnerEachRound === 'playerOne' && (
              <span role="img" aria-label="player one" style={{ fontSize: '6rem', color: 'red' }}>
                🎉 {minigameContext.minigame.team1Players[0].nickname} wins!
              </span>
            )}
            {winnerEachRound === 'playerTwo' && (
              <span role="img" aria-label="player two" style={{ fontSize: '6rem', color: 'blue' }}>
                🎉 {minigameContext.minigame.team2Players[0].nickname} wins!
              </span>
            )}
          </>
        )}
      </div>
      {/* <div className="buttons">
        <button className="rock" onClick={() => setPlayerOneDecision('rock')}>
          ✊
        </button>
        <button className="paper" onClick={() => setPlayerOneDecision('paper')}>
          🖐️
        </button>
        <button className="scissors" onClick={() => setPlayerOneDecision('scissors')}>
          ✌️
        </button>
        <button className="rock" onClick={() => setPlayerTwoDecision('rock')}>
          ✊
        </button>
        <button className="paper" onClick={() => setPlayerTwoDecision('paper')}>
          🖐️
        </button>
        <button className="scissors" onClick={() => setPlayerTwoDecision('scissors')}>
          ✌️
        </button>

        </div> */}

        <Timer onExpire={() => {
                const scoreToGain = minigameContext.minigame.scoreToGain;
                let winnerScore = score.playerOne > score.playerTwo ? score.playerOne : score.playerTwo;
                const winningTeam = score.playerOne > score.playerTwo ? { color: "RED", name: "Team Red" } : { color: "BLUE", name: "Team Blue" }
                const total = score.playerOne + score.playerTwo;
                winnerScore = Math.round(winnerScore / total * scoreToGain) || scoreToGain / 2;
                const winner = { score: winnerScore, color: winningTeam.color, name: winningTeam.name }
                const looser = { score: scoreToGain - winnerScore };
                history.push("/minigameWon", { winner, looser })
            }}>20</Timer>
          
    </div>
  );
};

    
