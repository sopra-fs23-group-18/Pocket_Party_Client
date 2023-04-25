import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { GameGuard } from "components/routing/routeProtectors/GameGuard";
import GameRouter from "components/routing/routers/GameRouter";
import { LoginGuard } from "components/routing/routeProtectors/LoginGuard";
import CreateLobby from "components/views/CreateLobby";
import Lobby from "components/views/Lobby";
import GamePreview from "components/views/GamePreview";
import PlayersForNextGamePreview from "components/views/PlayersForNextGamePreview";
import { TimingGame } from "components/games/TimingGame";
import MinigameWon from "components/views/MinigameWon";
import TeamScoreOverview from "components/views/TeamScoreOverview";
import { TappingGame } from "components/games/TappingGame";
import { createContext, useState } from "react";

export const MinigameContext = createContext(null);
const AppRouter = () => {
  const [minigame, setMinigame] = useState();

  const minigameRoute = () => {
    switch (minigame) {
      case "TIMING_GAME":
        return <TimingGame />

      case "TAPPING_GAME":
        return <TappingGame />

      default:
        break;
    }
  }

  return (
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
          <Route exact path="/tappingGame">
            <TappingGame />
          </Route>
        </Switch>
      </BrowserRouter>
    </MinigameContext.Provider>
  );
};

export default AppRouter;
