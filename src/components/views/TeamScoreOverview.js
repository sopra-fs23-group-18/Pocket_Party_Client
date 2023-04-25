import 'styles/views/TeamScoreOverview.scss'
import BaseContainer from 'components/ui/BaseContainer'
import { useState, useEffect } from 'react';
import { api } from 'helpers/api';
import HeaderContainer from 'components/ui/HeaderContainer';
import { useHistory } from 'react-router-dom';
const TeamScoreOverview = () => {
    /*const [info, setInfo] = useState({ type: 'Not Found', scoreToGain: 'Not Found' });
    useEffect(() => {
        const get_data = async () => {
            const data = await api.get(`lobbies/${lobbyId}/minigame`);
            setInfo(data);
        };

        get_data();
    }, [lobbyId]);*/
    const [Team1Pts, setTeam1Pts] = useState("80%");
    const [Team2Pts, setTeam2Pts] = useState("20%");
    const updateScoreTeam1 = () => {
        //TODO: API call
        const result = 80;
        setTeam1Pts(result)

    };
    const updateScoreTeam2 = () => {
        //TODO: API call
        const result = 80;
        setTeam2Pts(result)

    }
    const navigation = useHistory();
    useEffect(() => {
        setTimeout(() => {
            navigation.push("/gamePreview")
        }, 10000);
    }, [])
    return (
        <BaseContainer>
            <HeaderContainer title='Minigame Score' text='Progress'></HeaderContainer>
            <div className='tso maincontent'>
                <div className='tso barbox'>
                    <label className='tso team1'>Team 1</label>
                    <div className='tso team1Progress' style={{ backgroundColor: '#FF5733', width: `${Team1Pts}`, height: "5em" }}></div>
                    <label className='tso team1Pts'>{Team1Pts}</label>

                    <label className='tso team2'>Team 2</label>

                    <div className='tso team2Progress' style={{ backgroundColor: "#00BFFF", width: `${Team2Pts}`, height: "5em" }}></div>
                    <label className='tso team2Pts'>{Team2Pts}</label>
                </div>
                <div className='tso line'></div>
            </div>
        </BaseContainer>
    )
}
export default TeamScoreOverview;
