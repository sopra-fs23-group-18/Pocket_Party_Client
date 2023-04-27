import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const WinnerScreen = () => {
    const location = useLocation();
    useEffect(() => {
        console.log("HEllo world");
        console.log(location.state);

    }, [])
    return (
        <h1>{location.state && location.state.winnerTeam && location.state.winnerTeam.name} has won!</h1>    )
};
