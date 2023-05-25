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

    const [outcome, setOutcome] = useState(null);
    const timeout = useRef(null);

    // State for team scores
    const [team1Pts, setTeam1Pts] = useState(0);
    const [team2Pts, setTeam2Pts] = useState(0);
    const [team1Pct, setTeam1Pct] = useState(0);
    const [team2Pct, setTeam2Pct] = useState(0);
    const [data, setData] = useState(null);


    // State for animation of team scores
    const [animatedTeam1Pts, setAnimatedTeam1Pts] = useState(0);
    const [animatedTeam2Pts, setAnimatedTeam2Pts] = useState(0);

    const animateScores = () => {
        const animationDuration = 4000; // Animation duration in milliseconds
        const animationSteps = 60; // Number of animation steps
        const step = Math.ceil((team1Pts - animatedTeam1Pts) / animationSteps); // Increment value per step

        // Animate team 1 score
        const team1Animation = setInterval(() => {
            setAnimatedTeam1Pts((prevScore) => {
                const newScore = prevScore + step;
                return newScore <= team1Pts ? newScore : team1Pts;
            });
        }, animationDuration / animationSteps);

        // Animate team 2 score
        const team2Animation = setInterval(() => {
            setAnimatedTeam2Pts((prevScore) => {
                const newScore = prevScore + step;
                return newScore <= team2Pts ? newScore : team2Pts;
            });
        }, animationDuration / animationSteps);

        // Clear intervals after reaching the actual scores
        setTimeout(() => {
            clearInterval(team1Animation);
            clearInterval(team2Animation);
        }, animationDuration);
    };

    // Trigger the score animation when the component mounts or team scores change
    useEffect(() => {
        if (team1Pts !== animatedTeam1Pts || team2Pts !== animatedTeam2Pts) {
            animateScores();
        }
    }, [team1Pts, team2Pts]);

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
        setTeam1Pct(Math.round(score / gameContext.game.winningScore * 100));
        setTeam1Pts(score);
        team1BarRef.current.classList.add('mounted');
    };

    const updateScoreTeam2 = async () => {
        const score = data.teams[1].score;
        console.log(score);
        setTeam2Pct(Math.round(score / gameContext.game.winningScore * 100));
        setTeam2Pts(score);
        team2BarRef.current.classList.add('mounted');
    };


    async function updateScores(winnerTeam) {
        console.log(winnerTeam.name);
        const score = winnerTeam.score
        const name = winnerTeam.name
        const requestbody = JSON.stringify({ score, name })
        try {
            await api.put(`/lobbies/${lobbyContext.lobby.id}/games/${gameContext.game.id}`, requestbody)
            const response = await api.get(`/lobbies/${lobbyContext.lobby.id}/games/${gameContext.game.id}/gameover`)
            setOutcome(response.data.gameOutcome)
            getPoints();

        }
        catch (error) {
            alert(`Error!\n${handleError(error)}`)
        }
    }

    useEffect(() => {
        updateScores(location.state.winner);
    }, [location]);

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
        if (!outcome) { return; }
        if (outcome !== "NOT_FINISHED") {
            console.log("got called");
            clearTimeout(timeout.current);
            setTimeout(() => {
                if (outcome === "WINNER") {
                    try {
                        api.get(`/lobbies/${lobbyContext.lobby.id}/games/${gameContext.game.id}/winner`)
                            .then((response) => {
                                history.push("/winner", { winnerTeam: response.data, draw: false });
                            })
                            .catch((error) => {
                                alert(`Error!\n${handleError(error)}`)
                            });
                    } catch (error) {
                        alert(`Error!\n${handleError(error)}`)
                    }
                } else {
                    history.push("/winner", { draw: true });
                }
            }, 5000);
        }
    }, [outcome]);

    return (
        <BaseContainer>
            <HeaderContainer title="Minigame Score" text="Progress" />
            <div className="tso maincontent">
                <div className="tso barbox">
                    <label className="tso team1">{lobbyContext.lobby.teams[0].name}</label>
                    <div
                        ref={team1BarRef}
                        className="tso team1-bar"
                        style={{ width: `${team1Pct}%` }}
                    >
                    </div>
                    <label className="tso team1">{animatedTeam1Pts}pts</label>

                    <label className="tso team2">{lobbyContext.lobby.teams[1].name}</label>
                    <div
                        ref={team2BarRef}
                        className="tso team2-bar"
                        style={{ width: `${team2Pct}%` }}
                    >
                    </div>
                    <label className="tso team2">{animatedTeam2Pts}pts</label>
                </div>
                <div className="tso line" />
                <label className="tso goal-label">{gameContext.game.winningScore}pts</label>
            </div>
        </BaseContainer>
    );
};

export default TeamScoreOverview;
