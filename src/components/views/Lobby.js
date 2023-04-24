import { useContext, useEffect, useState } from 'react';
import { api, handleError } from 'helpers/api';
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

const Lobby = props => {
    let location = useLocation();
    const history = useHistory();
    const inviteCode = location.state.inviteCode;
    const connections = useContext(WebSocketContext);


    // Create a state variable to hold the list of players
    const [players, setPlayers] = useState([]);

    const getLobbyInfo = async () => {
        const response = await api.get(`/lobbies/${location.state.id}`);
        const lobby = new LobbyModel(response.data);
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

    const onPlayerJoin = (data) => {
        const playerJoined = new Player(JSON.parse(data.body));
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
        const response = await api.put(`lobbies/${location.state.id}`);
        if (response.status === 204) {
            history.push("/timingGame", { players, lobbyId: location.state.id });
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
        return <Button disabled={(team1Count < 1) || (team2Count < 1)} className='lobby button-container' onClick={onGameStartClicked}>Start Game</Button>
    }


    return (
        <BaseContainer>
            <HeaderContainer title='Invite code:' text={`${inviteCode}`}></HeaderContainer>
            <div className='lobby qr-container'>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${inviteCode}&size=100x100&bgcolor=FBF7F4`} />
            </div>
            <div className="lobby container">
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <div className='lobby label color-team1'>
                        Team 1
                        <Droppable droppableId="team1">
                            {(provided) => (
                                <div className="lobby form team1" {...provided.droppableProps} ref={provided.innerRef}>
                                    <ul className='lobby user-list'>
                                        {/* List of players in team 1 */}
                                        {players.filter(p => p.team === 'team1').map((player, index) => (
                                            <Draggable key={`team1-${player.id}`} draggableId={player.id.toString()} index={index}>
                                                {(provided) => (
                                                    <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                        <PlayerContainer player={player}></PlayerContainer>
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

                    <div className='lobby label color-team2'>
                        Team 2
                        <Droppable droppableId="team2">
                            {(provided) => (
                                <div className="lobby form team2" {...provided.droppableProps} ref={provided.innerRef}>
                                    <ul className='lobby user-list'>
                                        {/* List of players in team 2 */}
                                        {players.filter(p => p.team === 'team2').map((player, index) => (
                                            <Draggable key={`team2-${player.id}`} draggableId={player.id.toString()} index={index}>
                                                {(provided) => (
                                                    <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                        <PlayerContainer player={player}></PlayerContainer>                                                    </li>
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
