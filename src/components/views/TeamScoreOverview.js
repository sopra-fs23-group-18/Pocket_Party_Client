import "styles/views/TeamScoreOverview.scss";
import BaseContainer from 'components/ui/BaseContainer';
import { useState, useEffect, useRef, useContext } from 'react';
import { api, handleError } from 'helpers/api';
import HeaderContainer from 'components/ui/HeaderContainer';
import { useHistory, useLocation } from 'react-router-dom';
import { GameContext, LobbyContext } from "components/routing/routers/AppRouter";

const TeamScoreOverview = () => {

    const lobbyContext = useContext(LobbyContext);
    const gameContext = useContext(GameContext);
    let location = useLocation();
    const history = useHistory();
    const [errorMessage, setErrorMessage] = useState('');

    const [hasWon, setHasWon] = useState(false);
    const timeout = useRef(null);

    // State for team scores
    // const [team1PtsOvr, setTeam1PtsOvr] = useState(0);
    // const [team2PtsOvr, setTeam2PtsOvr] = useState(0);
    const [team1Pts, setTeam1Pts] = useState(0);
    const [team2Pts, setTeam2Pts] = useState(0);
    const [data, setData] = useState(null);

    // Refs for triggering animations
    const team1BarRef = useRef(null);
    const team2BarRef = useRef(null);

    const getPoints = async () => {
        try {
            const response = await api.get(`/lobbies/${lobbyContext.lobby.id}/games/${gameContext.game.id}/scores`);
            setData(response.data);
            console.log(response.data)
        } catch (error) {
            alert(`Error!\n${handleError(error)}`)
        }
    }
    // Update team scores and trigger animations
    const updateScoreTeam1 = async () => {
        const score = data.teams[0].score;
        console.log(score);
        setTeam1Pts(Math.round(score / gameContext.game.winningScore * 100));
        team1BarRef.current.classList.add('mounted');
    };

    const updateScoreTeam2 = async () => {
        const score = data.teams[1].score;
        console.log(score);
        setTeam2Pts(Math.round(score / gameContext.game.winningScore * 100));
        team2BarRef.current.classList.add('mounted');
    };


    async function updateScores(winnerTeam) {
        const score = winnerTeam.score
        const color = winnerTeam.color
        const name = winnerTeam.name
        const requestbody = JSON.stringify({ score, color, name })
        try {
            await api.put(`/lobbies/${lobbyContext.lobby.id}/games/${gameContext.game.id}`, requestbody)
            const response = await api.get(`/lobbies/${lobbyContext.lobby.id}/games/${gameContext.game.id}/gameover`)
            setHasWon(response.data.isFinished)
            getPoints();

        }
        catch (error) {
            alert(`Error!\n${handleError(error)}`)
        }
    }

    useEffect(() => {
        updateScores(location.state.winner);
    }, []);

    // Wait for data to be updated
    useEffect(() => {
        if (data) {
            updateScoreTeam1();
            updateScoreTeam2();
        }
    }, [data]);

    // Automatically redirect after 10 seconds
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            history.push('/gamePreview');
        }, 10000);
        return () => clearTimeout(timeoutId);
    }, [history]);

    useEffect(() => {
        if (hasWon) {
            console.log("got called");
            clearTimeout(timeout.current);
            setTimeout(() => {
                try {
                    api.get(`/lobbies/${lobbyContext.lobby.id}/games/${gameContext.game.id}/winner`)
                        .then((response) => {
                            history.push("/winner", { winnerTeam: response.data });
                        })
                        .catch((error) => {
                            alert(`Error!\n${handleError(error)}`)
                        });
                } catch (error) {
                    alert(`Error!\n${handleError(error)}`)
                }
            }, 5000);
        }
    }, [hasWon]);

    return (
        <BaseContainer>
            <HeaderContainer title="Minigame Score" text="Progress" />
            <div className="tso maincontent">
                <div className="tso barbox">
                    <label className="tso team1">{lobbyContext.lobby.teams[0].name}</label>
                    <div
                        ref={team1BarRef}
                        className="tso team1-bar"
                        style={{ width: `${team1Pts}%` }}
                    >
                    </div>
                    <label className="tso team1">{team1Pts}%</label>

                    <label className="tso team2">{lobbyContext.lobby.teams[1].name}</label>
                    <div
                        ref={team2BarRef}
                        className="tso team2-bar"
                        style={{ width: `${team2Pts}%` }}
                    >
                    </div>
                    <label className="tso team2">{team2Pts}%</label>
                </div>
                <div className="tso line" />
            </div>
        </BaseContainer>
    );
};

export default TeamScoreOverview;
