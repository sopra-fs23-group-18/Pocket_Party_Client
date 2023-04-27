import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import '../../styles/views/WinnerScreen.scss';


export const WinnerScreen = () => {
    const location = useLocation();
    const [winnerTeam, setWinnerTeam] = useState();

    useEffect(() => {
        const {winnerTeam} = location.state;
        setWinnerTeam(winnerTeam);
    }, [location])

    return (<div className="container">
           <h1 className="winnerTitle">Winner</h1>
                {winnerTeam && <h1 className={`winnerName ${winnerTeam.color === "RED" ? "team1" : "team2"}`}>{winnerTeam.name}</h1>}
            </div>
    )
};
