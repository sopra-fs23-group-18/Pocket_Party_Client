import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import CreateLobby from "components/views/CreateLobby";
import Lobby from "components/views/Lobby";
import GamePreview from "components/views/GamePreview";
import PlayersForNextGamePreview from "components/views/PlayersForNextGamePreview";
import { TimingGame } from "components/games/TimingGame";
import MinigameWon from "components/views/MinigameWon";
import TeamScoreOverview from "components/views/TeamScoreOverview";
import { TappingGame } from "components/games/TappingGame";
import { createContext, useState } from "react";
import { WinnerScreen } from "components/views/WinnerScreen";
import { VibrationGame } from "components/games/VibrationGame";
import HotPotato from "components/games/HotPotato";

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

const AppRouter = () => {
  const [minigame, setMinigame] = useState(JSON.parse(localStorage.getItem("minigameContext")));
  const [lobby, setLobby] = useState(JSON.parse(localStorage.getItem("lobbyContext")));

  const minigameRoute = () => {
    switch (minigame?.type) {
      case "TIMING_GAME":
        return <TimingGame />
      case "TAPPING_GAME":
        return  <TappingGame />
      case "VIBRATION_GAME":
        return <VibrationGame />
      case "HOT_POTATO":
        return <HotPotato />
      default:
        return null;
    }
  }

  return (
    <LobbyContext.Provider value={{ lobby, setLobby }}>
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
            <Route exact path="/gamePreview">
              <GamePreview />
            </Route>
            <Route exact path="/playerPreview">
              <PlayersForNextGamePreview />
            </Route>
            <Route exact path="/game">
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
          </Switch>
        </BrowserRouter>
      </MinigameContext.Provider>
    </LobbyContext.Provider>

  );
};

export default AppRouter;
