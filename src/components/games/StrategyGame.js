import React, { useEffect, useState } from 'react';
import 'styles/games/RPSGame.scss';
import { ActivationState } from "@stomp/stompjs";
import { WebSocketContext } from "App";
import { useContext } from "react";
import { LobbyContext, MinigameContext } from "components/routing/routers/AppRouter";
import { useHistory } from "react-router-dom";
import PlayerContainer from "components/ui/PlayerContainer";
import { Timer } from "components/ui/Timer";

export const StrategyGame = () => {
  const [playerOneChoice, setPlayerOneChoice] = useState("hold");
  const [playerTwoChoice, setPlayerTwoChoice] = useState("hold");
  const [playerOneDecision, setPlayerOneDecision] = useState(null);
  const [playerTwoDecision, setPlayerTwoDecision] = useState(null);
  const [onRoundFinished, setOnRoundFinished] = useState(false);
  const [score, setScore] = useState({ playerOne: 0, playerTwo: 0 });
  const [roundPlayed, setRoundPlayed] = useState(0);
  const [nextRoundInfo, setNextRoundInfo] = useState(null);

  const history = useHistory();

  const connections = useContext(WebSocketContext);
  const lobbyContext = useContext(LobbyContext);
  const minigameContext = useContext(MinigameContext);

  const roundToPLay = 5;

  // assign score for each round
  const assignScore = (playerOneChoice, playerTwoChoice) => {
    if (playerOneChoice !== playerTwoChoice) {
      setScore({
        playerOne: score.playerOne + playerOneChoice,
        playerTwo: score.playerTwo + playerTwoChoice,
      });

      setNextRoundInfo({
        playerOne: minigameContext.minigame.team1Players[0].nickname + " won " + playerOneChoice + " points   ",
        playerTwo: minigameContext.minigame.team2Players[0].nickname + " won " + playerTwoChoice + " points",
      }
      );
    }
    else {
      setNextRoundInfo({ tie: "Zero points for both" });
    }
  };

  const onPlayerOneInput = (msg) => {
    const data = JSON.parse(msg.body);
    if (data.inputType === 'STRATEGY') {
      setPlayerOneDecision(data.rawData.x);
    }
  };

  const onPlayerTwoInput = (msg) => {
    const data = JSON.parse(msg.body);
    if (data.inputType === 'STRATEGY') {
      setPlayerTwoDecision(data.rawData.x);
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

  // store round played in local storage
  useEffect(() => {
    localStorage.setItem('roundPlayed', JSON.stringify(roundPlayed));
  }, [roundPlayed]);

  // retrieve round played from local storage
  useEffect(() => {
    const roundPlayed = JSON.parse(localStorage.getItem('roundPlayed'));
    if (roundPlayed) {
      setRoundPlayed(roundPlayed);
    }
  }, []);


  // determine winner after both players have made a choice
  useEffect(() => {
    if (playerOneDecision && playerTwoDecision) {
      setPlayerOneChoice(playerOneDecision);
      setPlayerTwoChoice(playerTwoDecision);
      setPlayerOneDecision(null);
      setPlayerTwoDecision(null);
      assignScore(playerOneDecision, playerTwoDecision);
      setOnRoundFinished(true);
      setRoundPlayed(roundPlayed + 1);
    }
  }, [playerOneDecision, playerTwoDecision]);

  // display winner
  useEffect(() => {
    if (onRoundFinished) {
      setTimeout(() => {
        // reset choices
        setPlayerOneChoice("hold");
        setPlayerTwoChoice("hold");

        // reset round
        setOnRoundFinished(false);

        // reset next round info
        setNextRoundInfo(null);
      }, 2000);
    }
  }, [onRoundFinished]);

  // redircet to winning page when game is over
  useEffect(() => {
    if (roundPlayed === roundToPLay) {
      const scoreToGain = minigameContext.minigame.scoreToGain;
      const total = score.playerOne + score.playerTwo;
      let winnerScore = score.playerOne > score.playerTwo ? score.playerOne : score.playerTwo;
      winnerScore = Math.round(winnerScore / total * scoreToGain); 
      const winningTeam = score.playerOne > score.playerTwo ? { type: "TEAM_ONE", name: lobbyContext.lobby.teams[0].name } : { type: "TEAM_TWO", name: lobbyContext.lobby.teams[1].name };
      const winner = { score: winnerScore, type: winningTeam.type, name: winningTeam.name }
      const loser = { score: scoreToGain - winnerScore}
      const isDraw = score.playerOne === score.playerTwo;
      setTimeout(() => {
        history.push("/minigameWon", { winner, loser, isDraw })
      }, 1000);
    }
  }, [roundPlayed]);

  // websocket connection
  useEffect(() => {
    if (connections.stompConnection.state === ActivationState.ACTIVE) {
      connections.stompConnection.publish({
        destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[0].id}/signal`,
        body: JSON.stringify({
          signal: "START",
          minigame: "GREEDY_GAMBIT"
        })
      })
      connections.stompConnection.publish({
        destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[0].id}/signal`,
        body: JSON.stringify({
          signal: "START",
          minigame: "GREEDY_GAMBIT"
        })
      })
    }
    return () => {
      if (connections.stompConnection.state === ActivationState.ACTIVE) {
        connections.stompConnection.publish({
          destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[0].id}/signal`,
          body: JSON.stringify({
            signal: "STOP",
            minigame: "GREEDY_GAMBIT"
          })
        })
        connections.stompConnection.publish({
          destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[0].id}/signal`,
          body: JSON.stringify({
            signal: "STOP",
            minigame: "GREEDY_GAMBIT"
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
          minigame: "GREEDY_GAMBIT"
        })
      })
      connections.stompConnection.publish({
        destination: `/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[0].id}/signal`,
        body: JSON.stringify({
          signal: "START",
          minigame: "GREEDY_GAMBIT"
        })
      })
    };
  }, [connections, lobbyContext, minigameContext])

  return (
    <div className="container">
      <h1>Greedy Choice</h1>
      <div className="scoreboard">
        <div className="player-one-score">
          {score.playerOne}
        </div>
        <div className="player-two-score">
          {score.playerTwo}
        </div>
      </div>
      <div className="choices-container">
      <div className='play-container'>
        <PlayerContainer team="team1" player={minigameContext.minigame.team1Players[0]} />
        <p className={`choice ${playerOneChoice ? 'player-one-choice' : ''}`}>
          {playerOneChoice && (
            <>
              {playerOneChoice === 5 && (
                <span role="img" aria-label="rock" style={{ fontSize: '6rem' }}>
                  5💎
                </span>
              )}
              {playerOneChoice === 3 && (
                <span role="img" aria-label="paper" style={{ fontSize: '6rem' }}>
                  3💰
                </span>
              )}
              {playerOneChoice === 1 && (
                <span role="img" aria-label="scissors" style={{ fontSize: '6rem' }}>
                  1💵
                </span>
              )}
              {playerOneChoice === 'hold' && (
                <span role="img" aria-label="funny" style={{ fontSize: '10rem' }}>
                  🤑
                </span>
              )}

            </>
          )}
        </p>
      </div>
      <div className='play-container'>
        <PlayerContainer team="team2" player={minigameContext.minigame.team2Players[0]} />
        <p className={`choice ${playerTwoChoice ? 'player-two-choice' : ''}`}>
          {playerTwoChoice && (
            <>
              {playerTwoChoice === 5 && (
                <span role="img" aria-label="rock" style={{ fontSize: '6rem' }}>
                  5💎
                </span>
              )}
              {playerTwoChoice === 3 && (
                <span role="img" aria-label="paper" style={{ fontSize: '6rem' }}>
                  3💰
                </span>
              )}
              {playerTwoChoice === 1 && (
                <span role="img" aria-label="scissors" style={{ fontSize: '6rem' }}>
                  1💵
                </span>
              )}
              {playerTwoChoice === 'hold' && (
                <span role="img" aria-label="funny" style={{ fontSize: '10rem' }}>
                  🤑
                </span>
              )}
            </>
          )}
        </p>
        </div>
      </div>
      <div className='next-round-container'>
        {nextRoundInfo && (
          <>
            {nextRoundInfo.playerOne && (
              <span role="img" style={{ fontSize: '3rem', color: 'red' }}>
                {nextRoundInfo.playerOne}
              </span>
            )}
            {nextRoundInfo.playerTwo && (
              <span role="img" style={{ fontSize: '3rem', color: 'blue' }}>
                🎉🎉🎉 {nextRoundInfo.playerTwo}
              </span>
            )}
            {nextRoundInfo.tie && (
              <span role="img" aria-label="funny" style={{ fontSize: '4rem', color: 'green' }}>
                😞 {nextRoundInfo.tie}
              </span>
            )}
          </>
        )}
      </div>
      <div className="button">
      <button onClick={() => setPlayerOneDecision(5)}>
          5
      </button>
      <button onClick={() => setPlayerOneDecision(3)}>
          3
      </button>
      <button onClick={() => setPlayerOneDecision(1)}>
          1
      </button>
      <button onClick={() => setPlayerTwoDecision(5)}>
          5
      </button>
      <button onClick={() => setPlayerTwoDecision(3)}>
          3
      </button>
      <button onClick={() => setPlayerTwoDecision(1)}>
          1
      </button>
      </div>
      <div className="round-left">
        Round left: {5 - roundPlayed}
      </div>
    </div>
  );
};
