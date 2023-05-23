import { useContext, useEffect, useState } from 'react';
import { api } from 'helpers/api';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Lobby.scss";
import PlayerContainer from 'components/ui/PlayerContainer';
import { WebSocketContext } from 'App';
import { ActivationState } from '@stomp/stompjs'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Player from 'models/Player';
import HeaderContainer from 'components/ui/HeaderContainer';
import LobbyModel from 'models/LobbyModel';
import { Button } from 'components/ui/Button';
import { GameContext, LobbyContext } from 'components/routing/routers/AppRouter';
import Info from '../ui/Info';

const Lobby = props => {
    let location = useLocation();
    const history = useHistory();
    const inviteCode = location.state.inviteCode;
    const connections = useContext(WebSocketContext);
    const lobbyContext = useContext(LobbyContext);
    const [errorMessage, setErrorMessage] = useState('');

    const [team1Name, setTeam1Name] = useState('Team 1');
    const [team2Name, setTeam2Name] = useState('Team 2');

    const onTeam1NameChange = (e) => {
        setTeam1Name(e.target.value);
    };

    const onTeam2NameChange = (e) => {
        setTeam2Name(e.target.value);
    };

    // Create a state variable to hold the list of players
    const [players, setPlayers] = useState([]);

    const getLobbyInfo = async () => {
        try {
            const response = await api.get(`/lobbies/${location.state.id}`);
            const lobby = new LobbyModel(response.data);
            lobbyContext.setLobby(lobby)
            localStorage.setItem("lobbyContext", JSON.stringify({ id: location.state.id, winningScore: location.state.winningScore }));
        } catch (error) {
            setErrorMessage(error.message);
            history.push({
                pathname: '/error',
                state: { msg: errorMessage }
            });

        }
        const playersToAdd = [];
        for (const player of lobby.unassignedPlayers) {
            const playerToAdd = new Player(player);
            playerToAdd.team = "unassigned"
            playersToAdd.push(playerToAdd)
        }
        for (const player of lobby.teams[0].players) {
            const playerToAdd = new Player(player);
            playerToAdd.team = "team1"
            playersToAdd.push(playerToAdd)
        }
        for (const player of lobby.teams[1].players) {
            const playerToAdd = new Player(player);
            playerToAdd.team = "team2"
            playersToAdd.push(playerToAdd)
        }
        setPlayers(playersToAdd);
    }

    useEffect(() => {
        if (location.state.id !== null) {

            getLobbyInfo()
        }

    }, [])

    useEffect(() => {
        lobbyContext.setLobby({ id: location.state.id, winningScore: location.state.winningScore })
        localStorage.setItem("lobbyContext", JSON.stringify({ id: location.state.id, winningScore: location.state.winningScore }));
    }, [location.state.id])

    const onPlayerJoin = (data) => {
        const playerJoined = new Player(JSON.parse(data.body));
        localStorage.setItem(`${playerJoined.id}`, `${playerJoined.avatar}`)
        playerJoined.team = 'unassigned'
        setPlayers((old) => [...old, playerJoined]);
    }

    const assignPlayerToTeam = (player, team, source) => {
        if (source !== null && team === "unassigned") {
            connections.stompConnection.publish({
                destination: `/lobbies/${location.state.id}/unassign`,
                body: JSON.stringify({
                    playerId: player.id,
                    team: source === "team1" ? "RED" : "BLUE"
                })
            })
            return;
        }
        if (source !== null && source !== "unassigned") {
            connections.stompConnection.publish({
                destination: `/lobbies/${location.state.id}/reassign`,
                body: JSON.stringify({
                    playerId: player.id,
                    from: source === "team1" ? "RED" : "BLUE",
                    to: team === "team1" ? "RED" : "BLUE",
                })
            })
        }
        connections.stompConnection.publish({
            destination: `/lobbies/${location.state.id}/assign`,
            body: JSON.stringify({
                playerId: player.id,
                team: team === "team1" ? "RED" : "BLUE"
            })
        })
    }

    useEffect(() => {
        if (connections.stompConnection.state === ActivationState.ACTIVE) {
            connections.stompConnection.subscribe(`/queue/lobbies/${location.state.id}`, onPlayerJoin);
            return;
        }
        connections.stompConnection.onConnect = (_) => {
            connections.stompConnection.subscribe(`/queue/lobbies/${location.state.id}`, onPlayerJoin);
        };
    }, [connections, location])

    const team1Count = players.filter(p => p.team === 'team1').length;
    const team2Count = players.filter(p => p.team === 'team2').length;
    // Create a function to handle drag and drop events
    const handleOnDragEnd = (result) => {
        // If the draggable item was dropped outside of a droppable container move it back to unassigned players
        if (!result.destination) {
            const newPlayers = Array.from(players);
            const player = newPlayers.find(p => p.id === parseInt(result.draggableId));
            player.team = 'unassigned';
            setPlayers(newPlayers);
            return;
        }

        if (result.destination.droppableId === 'team1' && team1Count >= 4) {
            return;
        } else if (result.destination.droppableId === 'team2' && team2Count >= 4) {
            return;
        }
        // Update the state with the new list of players
        const newPlayers = Array.from(players);
        const player = newPlayers.find(p => p.id === parseInt(result.draggableId));
        player.team = result.destination.droppableId;
        assignPlayerToTeam(player, result.destination.droppableId, result.source.droppableId)
        setPlayers(newPlayers);
    };

    const onGameStartClicked = async () => {
        const body = {
            teams: [
                {
                    "id": lobbyContext.lobby.teams[0].id,
                    "name": team1Name
                },
                {
                    "id": lobbyContext.lobby.teams[1].id,
                    "name": team2Name
                }
            ]
        }
        const response = await api.put(`lobbies/${location.state.id}`, body);
        const lobbyUpdated = await api.get(`/lobbies/${location.state.id}`);
        lobbyContext.setLobby(lobbyUpdated.data)
        localStorage.setItem("lobbyContext", JSON.stringify(lobbyUpdated.data))
        if (response.status === 204) {
            history.push("/settings", { lobbyId: location.state.id });
        }
        else {
            setErrorMessage(response.status);
            history.push({
                pathname: '/error',
                state: { msg: errorMessage }
            });

        }
    }

    const middleSection = () => {
        for (const player of players) {
            if (player.team === "unassigned") {
                return <Droppable droppableId="unassigned">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            <ul className='lobby user-list'>
                                {/* List of unassigned players */}
                                {players.filter(p => p.team === 'unassigned').map((player, index) => (
                                    <Draggable key={`unassigned-${player.id}`} draggableId={player.id.toString()} index={index}>
                                        {(provided) => (
                                            <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <PlayerContainer player={player}></PlayerContainer>                                                </li>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </ul>
                        </div>
                    )}
                </Droppable>
            }
        }
        return <Button disabled={(team1Count < 1) || (team2Count < 1) || (team1Name === '') || team2Name === ''} className='lobby button-container' onClick={onGameStartClicked}>Start Game</Button>
    }


    return (
        <BaseContainer>
            <div className='lobby div'>
                <HeaderContainer title='Invite code:' text={`${inviteCode}`}></HeaderContainer>
                <div className='lobby qr-container'>
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${inviteCode}&size=100x100&bgcolor=FBF7F4`} className='lobby image' />
                    <Info infotext={"In order to be able to play please download the android app from https://github.com/sopra-fs23-group-18/pocket-party-mobile/releases/tag/M3. After scanning the QR-code in the app you can choose your team by dragging your player. Click the button in the center whenever you are ready to play!"} />

                </div>
            </div>
            <div className="lobby container">
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <div className='lobby team-container color-team1'>
                        <input
                            className="lobby team-name-input team1 color-team1"
                            type="text"
                            value={team1Name}
                            onChange={onTeam1NameChange}
                        />
                        <Droppable droppableId="team1">
                            {(provided) => (
                                <div className="lobby form team1" {...provided.droppableProps} ref={provided.innerRef}>
                                    <ul className='lobby user-list'>
                                        {/* List of players in team 1 */}
                                        {players.filter(p => p.team === 'team1').map((player, index) => (
                                            <Draggable key={`team1-${player.id}`} draggableId={player.id.toString()} index={index}>
                                                {(provided) => (
                                                    <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                        <PlayerContainer team={player.team} player={player}></PlayerContainer>
                                                    </li>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </ul>
                                </div>
                            )}
                        </Droppable>
                    </div>
                    <div>
                        {middleSection()}
                    </div>

                    <div className='lobby team-container color-team2'>
                        <input
                            className="lobby team-name-input team2 color-team2"
                            type="text"
                            value={team2Name}
                            onChange={onTeam2NameChange}
                        />
                        <Droppable droppableId="team2">
                            {(provided) => (
                                <div className="lobby form team2" {...provided.droppableProps} ref={provided.innerRef}>
                                    <ul className='lobby user-list'>
                                        {/* List of players in team 2 */}
                                        {players.filter(p => p.team === 'team2').map((player, index) => (
                                            <Draggable key={`team2-${player.id}`} draggableId={player.id.toString()} index={index}>
                                                {(provided) => (
                                                    <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                        <PlayerContainer team={player.team} player={player}></PlayerContainer>                                                    </li>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </ul>
                                </div>
                            )}
                        </Droppable>
                    </div>
                </DragDropContext>
            </div>
        </BaseContainer >
    );
};
export default Lobby;
