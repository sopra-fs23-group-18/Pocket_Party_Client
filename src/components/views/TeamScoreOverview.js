import "styles/views/TeamScoreOverview.scss";
import BaseContainer from 'components/ui/BaseContainer';
import { useState, useEffect, useRef, useContext } from 'react';
import { api } from 'helpers/api';
import HeaderContainer from 'components/ui/HeaderContainer';
import { useHistory, useLocation } from 'react-router-dom';
import { GameContext, LobbyContext } from "components/routing/routers/AppRouter";

const TeamScoreOverview = () => {

    const lobbyContext = useContext(LobbyContext);
    const gameContext = useContext(GameContext);
    let location = useLocation();
    const navigation = useHistory();

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
        const response = await api.get(`/lobbies/${lobbyContext.lobby.id}}/games/${gameContext.game.id}/scores`);
        setData(response.data);
        console.log(response.data)
    }
    // Update team scores and trigger animations
    const updateScoreTeam1 = async () => {
        const score = data.teams[0].score;
        console.log(score);
        setTeam1Pts(Math.round(score / lobbyContext.lobby.winningScore * 100));
        team1BarRef.current.classList.add('mounted');
    };

    const updateScoreTeam2 = async () => {
        const score = data.teams[1].score;
        console.log(score);
        setTeam2Pts(Math.round(score / lobbyContext.lobby.winningScore * 100));
        team2BarRef.current.classList.add('mounted');
    };


    async function updateScores(winnerTeam) {
        const score = winnerTeam.score
        const color = winnerTeam.color
        const name = winnerTeam.name
        const requestbody = JSON.stringify({ score, color, name })
        await api.put(`/lobbies/${lobbyContext.lobby.id}/games/${gameContext.game.id}`, requestbody)
        const response = await api.get(`/lobbies/${lobbyContext.lobby.id}/games/${gameContext.game.id}/gameover`)
        console.log();
        setHasWon(response.data.isFinished)
        getPoints();
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
            navigation.push('/gamePreview');
        }, 10000);
        return () => clearTimeout(timeoutId);
    }, [navigation]);

    useEffect(() => {
        if (hasWon) {
            console.log("got calleds");
            clearTimeout(timeout.current);
            setTimeout(() => {
                api.get(`/lobbies/${lobbyContext.lobby.id}/games/${gameContext.game.id}/winner`).then((response) => {
                    navigation.push("/winner", { winnerTeam: response.data }
                    );
                })
            }, 5000)
        }
    }, [hasWon]);

    return (
        <BaseContainer>
            <HeaderContainer title="Minigame Score" text="Progress" />
            <div className="tso maincontent">
                <div className="tso barbox">
                    <label className="tso team1">Team 1</label>
                    <div
                        ref={team1BarRef}
                        className="tso team1-bar"
                        style={{ width: `${team1Pts}%` }}
                    >
                    </div>
                    <label className="tso team1">{team1Pts}%</label>

                    <label className="tso team2">Team 2</label>
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
