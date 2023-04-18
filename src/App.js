import Header from "components/views/Header";
import AppRouter from "components/routing/routers/AppRouter";
import { createContext, useEffect, useRef } from "react";
import { WebSocketConnection } from "./helpers/webRTC";
import { getWsUrl } from "helpers/getDomain";
import { Client } from '@stomp/stompjs';

require("./helpers/webRTC");
/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 */
export const WebSocketContext = createContext(null);

const App = () => {

  return (
    <WebSocketContext.Provider value={{signalingConnection: new WebSocketConnection(getWsUrl() + "/socket"), stompConnection: new Client({
       brokerURL: getWsUrl() + "/game"
      })}}>
      <div>
        <AppRouter />
      </div>
    </WebSocketContext.Provider>
  );
};

export default App;
