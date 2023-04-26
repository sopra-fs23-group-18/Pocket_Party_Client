import { withRouter } from "react-router-dom";

export const WinnerScreen = withRouter(({ location }) => {
    const { winnerTeam } = location.state;
    return (
        <label>{winnerTeam} has won!</label>
    )
});
