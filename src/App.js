import AppRouter from "components/routing/routers/AppRouter";
import { createContext, useEffect, useState } from "react";
import { getWsUrl } from "helpers/getDomain";
import { Client } from '@stomp/stompjs';
import StandardErrorBoundary from "helpers/ErrorBoundary";

require("./helpers/webRTC");
export const WebSocketContext = createContext(null);

const App = () => {
  const [connections, setConnections] = useState({
    stompConnection: new Client({
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
