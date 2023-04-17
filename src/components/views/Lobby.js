import { useEffect, useState } from 'react';
import { api, handleError } from 'helpers/api';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import { Button } from 'components/ui/Button';
import "styles/views/Lobby.scss";
import Player from 'components/ui/Player';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Lobby = props => {
    let location = useLocation();
    console.log(location);
    const inviteCode = location.state.inviteCode;
    const history = useHistory();

    // Create a state variable to hold the list of players
    const [players, setPlayers] = useState([
        { id: 1, name: 'Sven', team: 'unassigned' },
        { id: 2, name: 'Nils', team: 'unassigned' },
        { id: 3, name: 'Stefan', team: 'unassigned' },
        { id: 4, name: 'Guojun', team: 'unassigned' },
        { id: 5, name: 'Isabella', team: 'unassigned' },
        { id: 6, name: 'Naseem', team: 'unassigned' },
    ]);

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
        // Update the state with the new list of players
        const newPlayers = Array.from(players);
        const player = newPlayers.find(p => p.id === parseInt(result.draggableId));
        player.team = result.destination.droppableId;
        setPlayers(newPlayers);
    };

    return (
        <BaseContainer>
            <div className='lobby field'>Invite Code: {inviteCode}
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
                                                        <Player name={player.name} team={player.team}></Player>
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
                    <Droppable droppableId="unassigned">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                <ul className='lobby user-list'>
                                    {/* List of unassigned players */}
                                    {players.filter(p => p.team === 'unassigned').map((player, index) => (
                                        <Draggable key={`unassigned-${player.id}`} draggableId={player.id.toString()} index={index}>
                                            {(provided) => (
                                                <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    <Player name={player.name} team={player.team}></Player>
                                                </li>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </ul>
                            </div>
                        )}
                    </Droppable>
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
                                                        <Player name={player.name} team={player.team}></Player>
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
                </DragDropContext>
            </div>
        </BaseContainer >
    );
};
export default Lobby;
