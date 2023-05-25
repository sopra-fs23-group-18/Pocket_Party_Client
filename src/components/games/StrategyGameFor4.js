import React, { useEffect, useState } from 'react';
import 'styles/games/RPSGame.scss';
import { ActivationState } from "@stomp/stompjs";
import { WebSocketContext } from "App";
import { useContext } from "react";
import { LobbyContext, MinigameContext } from "components/routing/routers/AppRouter";
import { useHistory } from "react-router-dom";
import PlayerContainer from "components/ui/PlayerContainer";


export const StrategyGameFor4 = () => {
  const [playerChoice, setPlayerChoice] = useState({
  player1: "hold",
  player2: "hold",
  player3: "hold",
  player4: "hold",
});
  const [player1Decision, setPlayer1Decision] = useState(null);
  const [player2Decision, setPlayer2Decision] = useState(null);
  const [player3Decision, setPlayer3Decision] = useState(null);
  const [player4Decision, setPlayer4Decision] = useState(null);
  const [onRoundFinished, setOnRoundFinished] = useState(false);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [score3, setScore3] = useState(0);
  const [score4, setScore4] = useState(0);
  const [roundPlayed, setRoundPlayed] = useState(0);

  const [players, setPlayers] = useState([]);
  const [lobbyId, setLobbyId] = useState(null);

  const history = useHistory();

  const connections = useContext(WebSocketContext);
  const lobbyContext = useContext(LobbyContext);
  const minigameContext = useContext(MinigameContext);

  const roundToPLay = 5;

  const buttonValues = [5, 3, 1];

  const getChoiceEmoji = (choice) => {
    switch (choice) {
      case "hold":
        return "🤑";
      case 5:
        return "5💎";
      case 3:
        return "3💰";
      case 1:
        return "1💵";
      default:
        return "🤑";
    }
  };


  // assign score for each round
  // the player can only gain score if he is different from all other player
  const assignScore = (playerOne, playerTwo, playerThree, playerFour ) => {
    if (playerOne !== playerTwo && playerOne !== playerThree && playerOne !== playerFour) {
      setScore1(score1 + playerOne);
    }
    if (playerTwo !== playerOne && playerTwo !== playerThree && playerTwo !== playerFour) {
      setScore2(score2 + playerTwo);
    }
    if (playerThree !== playerOne && playerThree !== playerTwo && playerThree !== playerFour) {
      setScore3(score3 + playerThree);
    }
    if (playerFour !== playerOne && playerFour !== playerTwo && playerFour !== playerThree) {
      setScore4(score4 + playerFour);
    }
  };

  const onPlayerOneInput = (msg) => {
    const data = JSON.parse(msg.body);
    if (data.inputType === 'STRATEGY') {
      setPlayer1Decision(data.rawData.x);
    }
  };

  const onPlayerTwoInput = (msg) => {
    const data = JSON.parse(msg.body);
    if (data.inputType === 'STRATEGY') {
      setPlayer2Decision(data.rawData.x);
    }
  };

  const onPlayerThreeInput = (msg) => {
    const data = JSON.parse(msg.body);
    if (data.inputType === 'STRATEGY') {
      setPlayer3Decision(data.rawData.x);
    }
  };

  const onPlayerFourInput = (msg) => {
    const data = JSON.parse(msg.body);
    if (data.inputType === 'STRATEGY') {
      setPlayer4Decision(data.rawData.x);
    }
  };

  const sendToPlayers = (body, lobbyId, players) => {
    for (const player of players) {
        console.log(connections.stompConnection.connected);
        if (connections.stompConnection.connected) {
            connections.stompConnection.publish({
                destination: `/lobbies/${lobbyId}/players/${player}/signal`,
                body: JSON.stringify(body)
            })
        }
    }
}

  // store player score in local storage
  useEffect(() => {
    localStorage.setItem('score', JSON.stringify({ score1, score2, score3, score4 }));
  }, [score1, score2, score3, score4]);

  // retrieve player score from local storage
  useEffect(() => {
    const score = JSON.parse(localStorage.getItem('score'));
    if (score) {
      setScore1(score.score1);
      setScore2(score.score2);
      setScore3(score.score3);
      setScore4(score.score4);
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
    console.log(player1Decision, player2Decision, player3Decision, player4Decision);
    // if all players have made a choice
    if (player1Decision && player2Decision && player3Decision && player4Decision) {
      // determine winner
      setPlayerChoice({ player1: player1Decision, player2: player2Decision, player3: player3Decision, player4: player4Decision });
      assignScore(player1Decision, player2Decision, player3Decision, player4Decision);
      setOnRoundFinished(true);
      setRoundPlayed(roundPlayed + 1);
      setPlayer1Decision(null);
      setPlayer2Decision(null);
      setPlayer3Decision(null);
      setPlayer4Decision(null);
    }
  }, [player1Decision, player2Decision, player3Decision, player4Decision]);


  // display winner
  useEffect(() => {
    if (onRoundFinished) {
      setTimeout(() => {
        console.log(playerChoice);
        // reset choices
        setPlayerChoice({ player1: "hold", player2: "hold", player3: "hold", player4: "hold" });

        // reset round
        setOnRoundFinished(false);
      }, 2000);
    }
  }, [onRoundFinished]);

  // redircet to winning page when game is over
  useEffect(() => {
    if (roundPlayed === roundToPLay) {
      const scoreToGain = minigameContext.minigame.scoreToGain;
      const team1Score = score1 + score2;
      const team2Score = score3 + score4;
      const total = team1Score + team2Score;
      let winnerScore = team1Score > team2Score ? team1Score : team2Score;
      winnerScore = Math.round(winnerScore / total * scoreToGain); 
      const winningTeam = team1Score > team2Score ? { type: "TEAM_ONE", name: lobbyContext.lobby.teams[0].name } : { type: "TEAM_TWO", name: lobbyContext.lobby.teams[1].name };
      const winner = { score: winnerScore, type: winningTeam.type, name: winningTeam.name }
      const loser = { score: scoreToGain - winnerScore}
      const isDraw = team1Score === team2Score;
      setTimeout(() => {
        history.push("/minigameWon", { winner, loser, isDraw })
      }, 1000);
    }
  }, [roundPlayed]);

  // set lobby id and players
  useEffect(() => {
    if (lobbyContext.lobby) {
        setLobbyId(lobbyContext.lobby.id)
    }

    if (minigameContext.minigame) {
        setPlayers([minigameContext?.minigame.team1Players[0].id, minigameContext?.minigame.team1Players[1].id,  minigameContext?.minigame.team2Players[0].id, minigameContext?.minigame.team2Players[1].id])
    }

}, [lobbyContext, minigameContext])

  // websocket connection
  useEffect(() => {
    if (players.length > 0 && lobbyId !== null) {
        sendToPlayers({
            signal: "START",
            minigame: "STRATEGY_GAME",
            data: null
        }, lobbyId, players);
    }

}, [players, lobbyId])

useEffect(() => {
  return () => {
      sendToPlayers({
          signal: "STOP",
          minigame: "STRATEGY_GAME"
      }, lobbyId, players)
  }
}, [])

  useEffect(() => {
    if (connections.stompConnection.state === ActivationState.ACTIVE) {
      connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[0].id}/input`, onPlayerOneInput);
      connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[1].id}/input`, onPlayerTwoInput);
      connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[0].id}/input`, onPlayerThreeInput);
      connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[1].id}/input`, onPlayerFourInput);

      return;
    }
    console.log("Subscribing to input");
    connections.stompConnection.onConnect = (_) => {
      connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[0].id}/input`, onPlayerOneInput);
      connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team1Players[1].id}/input`, onPlayerTwoInput);
      connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[0].id}/input`, onPlayerThreeInput);
      connections.stompConnection.subscribe(`/topic/lobbies/${lobbyContext.lobby.id}/players/${minigameContext?.minigame.team2Players[1].id}/input`, onPlayerFourInput);

      sendToPlayers({
        signal: "START",
        minigame: "STRATEGY_GAME",
        data: null
      }, lobbyId, players);
    };
  }, [connections, lobbyContext, minigameContext])


  return (
    <div className="container">
      <h1>Greedy Choice</h1>
      <div className="choice-container-4">
      <div className='play-container-4'>
        {minigameContext.minigame.team1Players.map((player, index) => (
          <>
          <PlayerContainer key={index} team="team1" player={player} />
          {index === 0 ? <p className='score-4'>
            Score: {score1}
          </p> : <p className='score-4'>
            Score: {score2}
          </p>}
          <p className='choice-4'>
          <span key={index} role='img' style={{ fontSize: '10rem' }}>
            {getChoiceEmoji(playerChoice[`player${index + 1}`])}
          </span>
          </p>
          </>
        ))}
      </div>
      <div className='play-container-4'>
        {minigameContext.minigame.team2Players.map((player, index) => (
          <>
          <PlayerContainer key={index} team="team2" player={player} />
          {index === 0 ? <p className='score-4'>
            Score: {score3}
          </p> : <p className='score-4'>
            Score: {score4}
          </p>}

          <p className='choice-4'>
          <span key={index} role='img' style={{ fontSize: '10rem'}}>
            {getChoiceEmoji(playerChoice[`player${index + 3}`])} 
          </span>
          </p>
          </>
        ))}  
      </div>
      </div>

      <div className="button">
        {buttonValues.map((value) => (
          <>
            <button onClick={() => setPlayer1Decision(value)}>
              {value}
            </button>
            <button onClick={() => setPlayer2Decision(value)}>
              {value}
            </button>
            <button onClick={() => setPlayer3Decision(value)}>
              {value}
            </button>
            <button onClick={() => setPlayer4Decision(value)}>
              {value}
            </button>
          </>
        ))}
      </div>
      <div className="round-left">
        Round left: {5 - roundPlayed}
      </div>
    </div>
  );
  };

