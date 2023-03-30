import Header from "components/views/Header";
import AppRouter from "components/routing/routers/AppRouter";
import { createContext, useEffect, useRef } from "react";
import { WebSocketConnection } from "./helpers/webRTC";
import { getWsUrl } from "helpers/getDomain";
require("./helpers/webRTC");
/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 */
export const WebSocketContext = createContext(null);

const App = () => {

  return (
    <WebSocketContext.Provider value={new WebSocketConnection(getWsUrl())}>
      <div>
        <Header height="100" />
        <AppRouter />
      </div>
    </WebSocketContext.Provider>
  );
};

export default App;
