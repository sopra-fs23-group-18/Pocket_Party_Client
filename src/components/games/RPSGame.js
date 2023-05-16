import React, { useEffect, useState } from 'react';
import { Button } from "components/ui/Button";
import 'styles/games/rpsGame.scss';
import { ActivationState } from "@stomp/stompjs";
import { WebSocketContext } from "App";
import { useContext } from "react";
import { LobbyContext, MinigameContext } from "components/routing/routers/AppRouter";
import { useHistory } from "react-router-dom";

export const RPSGame = () => {
  const [playerOneChoice, setPlayerOneChoice] = useState("hold");
  const [playerTwoChoice, setPlayerTwoChoice] = useState("hold");
  const [playerOneDecision, setPlayerOneDecision] = useState(null);
  const [playerTwoDecision, setPlayerTwoDecision] = useState(null);
  const [winner, setWinner] = useState(null); // ['playerOne', 'playerTwo', 'tie']
  const [score, setScore] = useState({ playerOne: 0, playerTwo: 0 });

  const history = useHistory();

  const choices = ['rock', 'paper', 'scissors'];

  const connections = useContext(WebSocketContext);
  const lobbyContext = useContext(LobbyContext);
  const minigameContext = useContext(MinigameContext);

  const WINNING_SCORE = 5;

  // determine winner for each round
  const determineWinner = (playerOneChoice, playerTwoChoice) => {
    if (playerOneChoice === playerTwoChoice) {
      setWinner('tie');
    } else if (
      (playerOneChoice === 'rock' && playerTwoChoice === 'scissors') ||
      (playerOneChoice === 'paper' && playerTwoChoice === 'rock') ||
      (playerOneChoice === 'scissors' && playerTwoChoice === 'paper')
    ) {
      setScore({ playerOne: score.playerOne + 1, playerTwo: score.playerTwo });
      setWinner('playerOne');
    } else {
      setScore({ playerOne: score.playerOne, playerTwo: score.playerTwo + 1 });
      setWinner('playerTwo');
    }
  };

  const onPlayerOneInput = (msg) => {
    const data = JSON.parse(msg.body);
    if (data.inputType === 'RPS') {
      playerOneInput(choices[data.rawData.x]);
    }
  };

  const onPlayerTwoInput = (msg) => {
    const data = JSON.parse(msg.body);
    if (data.inputType === 'RPS') {
      playerTwoInput(choices[data.rawData.x]);
    }
  };

  const playerOneInput = (choice) => {
    setPlayerOneDecision(choice);
  };

  const playerTwoInput = (choice) => {
    setPlayerTwoDecision(choice);
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
    if (winner) {
      setTimeout(() => {
        setPlayerOneChoice("hold");
        setPlayerTwoChoice("hold");
        setWinner(null);
      }, 2000);
    }
  }, [winner]);

  // redircet to winning page when game is over
  useEffect(() => {
    if (score.playerOne === WINNING_SCORE || score.playerTwo === WINNING_SCORE) {
      const scoreToGain = minigameContext.minigame.scoreToGain;
      const total = score.playerOne + score.playerTwo;
      const winnerScore = Math.round(WINNING_SCORE / total * scoreToGain); 
      const winningTeam = score.playerOne === WINNING_SCORE ? { color: "red", name: "Team Red" } : { color: "blue", name: "Team Blue" };
      const winner = { score: winnerScore, color: winningTeam.color, name: winningTeam.name }
      const loser = { score: scoreToGain - winnerScore}
      setTimeout(() => {
        history.push("/minigameWon", { winner, loser })
      }, 1000);
    }
  }, [score]);

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
        {winner === 'playerOne' && (
          <>
            <p className='red-wins'>Red Wins!</p>
          </>
        )}
        {winner === 'playerTwo' && (
          <>
            <p className='blue-wins'>Blue Wins!</p>
          </>
        )}
        {winner === 'tie' && <p>Tie!</p>}
      </div>
      <div className="buttons-container">
      {choices.map((choice) => (
        <Button
          key={choice}
          className="choice-button"
          onClick={() => playerOneInput(choice)}
        >
          {choice}
        </Button>
      ))}
    </div>
    <div className="buttons-container">
    {choices.map((choice) => (
      <Button
        key={choice}
        className="choice-button"
        onClick={() => playerTwoInput(choice)}
      >
        {choice}
      </Button>
    ))}
    </div>
    </div>
  );
};

    
