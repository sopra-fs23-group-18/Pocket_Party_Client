import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { GameGuard } from "components/routing/routeProtectors/GameGuard";
import GameRouter from "components/routing/routers/GameRouter";
import { LoginGuard } from "components/routing/routeProtectors/LoginGuard";
import CreateLobby from "components/views/CreateLobby";
import Lobby from "components/views/Lobby";
import GamePreview from "components/views/GamePreview";
import PlayersForNextGamePreview from "components/views/PlayersForNextGamePreview";
import { TimingGame } from "components/games/TimingGame";
import { TappingGame } from "components/games/TappingGame";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/game">
          <GameGuard>
            <GameRouter base="/game" />
          </GameGuard>
        </Route>
        <Route exact path="/createlobby">
          <LoginGuard>
            <CreateLobby />
          </LoginGuard>
        </Route>
        <Route exact path="/">
          <Redirect to="/game" />
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
        <Route exact path="/timingGame">
          <TimingGame />
        </Route>
        <Route exact path="/tappingGame">
          <TappingGame />
        </Route>
        
      </Switch>
    </BrowserRouter >
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
