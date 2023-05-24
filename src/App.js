import Header from "components/views/Header";
import AppRouter from "components/routing/routers/AppRouter";
import { createContext, useEffect, useRef, useState } from "react";
import { WebSocketConnection } from "./helpers/webRTC";
import { getWsUrl } from "helpers/getDomain";
import { Client } from '@stomp/stompjs';
import StandardErrorBoundary from "helpers/ErrorBoundary";

require("./helpers/webRTC");
/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 */
export const WebSocketContext = createContext(null);

const App = () => {
  const [connections, setConnections] = useState({stompConnection: new Client({
      brokerURL: getWsUrl() + "/game"
    })
  })


  useEffect(() => {
    //Here we activate the stomp connection only needed to call once.
    connections.stompConnection.activate();
  }, [connections.stompConnection])

  return (
    <WebSocketContext.Provider value={connections}>
      <div>
        <StandardErrorBoundary>
          <AppRouter />
        </StandardErrorBoundary>
      </div>
    </WebSocketContext.Provider>
  );
};

export default App;
