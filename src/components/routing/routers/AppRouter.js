import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import CreateLobby from "components/views/CreateLobby";
import Lobby from "components/views/Lobby";
import GamePreview from "components/views/GamePreview";
import PlayersForNextGamePreview from "components/views/PlayersForNextGamePreview";
import MinigameWon from "components/views/MinigameWon";
import TeamScoreOverview from "components/views/TeamScoreOverview";
import { createContext, useState } from "react";
import { WinnerScreen } from "components/views/WinnerScreen";
import { VibrationGame } from "components/games/VibrationGame";
import ErrorScreen from "components/views/ErrorScreen";
import Settings from "components/views/Settings";
import { RPSGame } from "components/games/RPSGame";
import { StrategyGame } from "components/games/StrategyGame";
import { PongGame } from "components/games/PongGame";
import { TimingGame } from "components/games/TimingGame";
import { TappingGame } from "components/games/TappingGame";
import { StrategyGameFor4 } from "components/games/StrategyGameFor4";
import { TappingGameFor4 } from "components/games/TappingGameFor4";
import MinigameChoiceSettings from "components/views/MinigameChoiceSettings";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */

export const MinigameContext = createContext();
export const LobbyContext = createContext();
export const GameContext = createContext();

const AppRouter = () => {
  const [minigame, setMinigame] = useState(JSON.parse(localStorage.getItem("minigameContext")));
  const [lobby, setLobby] = useState(JSON.parse(localStorage.getItem("lobbyContext")));
  const [game, setGame] = useState(JSON.parse(localStorage.getItem("gameContext")));

  const minigameRoute = () => {
    switch (minigame?.type) {
      case "TIMING_TUMBLE":
        return <TimingGame />
      case "QUICK_FINGERS":
        if (minigame?.amountOfPlayers === 'TWO') {
          return <TappingGameFor4 />
        }
        return <TappingGame />
      case "VIBRATION_VOYAGE":
        return <VibrationGame />
      case "POCKET_PONG":
        return <PongGame />
      case "ROCK_PAPER_SCISSORS":
        return <RPSGame />
      case "GREEDY_GAMBIT":
        if (minigame?.amountOfPlayers === 'TWO') {
          return <StrategyGameFor4 />
        }
        return <StrategyGame />
      default:
        return null;
    }
  }

  return (
    <LobbyContext.Provider value={{ lobby, setLobby }}>
      <GameContext.Provider value={{ game, setGame }}>
        <MinigameContext.Provider value={{ minigame, setMinigame }}>
          <BrowserRouter>
            <Switch>
              <Redirect exact from="/" to="/createLobby" />
              <Route exact path="/createLobby">
                <CreateLobby />
              </Route>
              <Route exact path="/lobby">
                <Lobby />
              </Route>
              <Route exact path="/error">
                <ErrorScreen />
              </Route>
              <Route exact path="/gamePreview">
                <GamePreview />
              </Route>
              <Route exact path="/playerPreview">
                <PlayersForNextGamePreview />
              </Route>
              <Route exact path="/minigame">
                {minigameRoute()}
              </Route>
              <Route exact path="/minigameWon">
                <MinigameWon />
              </Route>
              <Route exact path="/teamScoreOverview">
                <TeamScoreOverview />
              </Route>
              <Route exact path="/winner">
                <WinnerScreen />
              </Route>
              <Route exact path="/settings">
                <Settings />
              </Route>
              <Route exact path="/minigameChoiceSettings">
                <MinigameChoiceSettings />
              </Route>
            </Switch>
          </BrowserRouter>
        </MinigameContext.Provider>
      </GameContext.Provider>
    </LobbyContext.Provider>

  );
};

export default AppRouter;
