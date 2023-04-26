import "styles/ui/PlayerContainer.scss";
import PropTypes from "prop-types";

function PlayerContainer(props) {
  const { player, team } = props;
  //smelly code because of team but it works!
  return (
    <div className={`player-container ${team}`}>
      <img className="player-avatar" src={`data:image/svg+xml;utf8,${encodeURIComponent(localStorage.getItem(`${player.id}`))}`} />
      <div className="player-name">{player.nickname}</div>
    </div>
  );
}

PlayerContainer.propTypes = {
  player: PropTypes.object.isRequired,
};

export default PlayerContainer;
