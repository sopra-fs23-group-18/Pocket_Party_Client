import 'styles/ui/TeamScoreOverview.scss'
import BaseContainer from './BaseContainer';
import { useState, useEffect } from 'react';
import { api } from 'helpers/api';
const TeamScoreOverview = ({ lobbyId }) => {
    /*const [info, setInfo] = useState({ type: 'Not Found', scoreToGain: 'Not Found' });
    useEffect(() => {
        const get_data = async () => {
            const data = await api.get(`lobbies/${lobbyId}/minigame`);
            setInfo(data);
        };

        get_data();
    }, [lobbyId]);*/
    const [Team1Pts, setTeam1Pts] = useState("100%");
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
    return (
        <BaseContainer>
            <div className="TSO Scorelabelcontainer">
                <label className='TSO Scorelabel'>Score</label>
            </div>
            <div className='TSO Progressbox'>
                <label className='TSO Progress'>Progress</label>
            </div>
            <div className='TSO Maincontent'>
                <div className='TSO Barbox'>
                    <label className='TSO Team1'>Team 1</label>
                    <div className='TSO bar'>
                        <div className='TSO Team1Progress' style={{ backgroundColor: "#458E6C", width: `${Team1Pts}`, height: "5em" }}></div>
                        <label className='TSO Team1Pts'>{Team1Pts}</label>

                    </div>
                    <label className='TSO Team2'>Team 2</label>
                    <div className='TSO bar'>
                        <div className='TSO Team2Progress' style={{ backgroundColor: "#87C1A5", width: `${Team2Pts}`, height: "5em" }}></div>
                        <label className='TSO Team2Pts'>{Team2Pts}</label>
                    </div>
                </div>
                <div className='TSO LineBox'>
                    <div className='TSO Line'></div>
                </div>
            </div>
        </BaseContainer>
    )
}
export default TeamScoreOverview;
