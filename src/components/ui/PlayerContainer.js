import "styles/ui/PlayerContainer.scss";
import PropTypes from "prop-types";

function PlayerContainer(props) {
  const { player } = props;

  return (
    <div className={`player-container ${player.team}`}>
      <img className="player-avatar" src={`data:image/svg+xml;utf8,${encodeURIComponent(player.avatar)}`} />
      <div className="player-name">{player.nickname}</div>
    </div>
  );
}

PlayerContainer.propTypes = {
  player: PropTypes.object.isRequired,
};

export default PlayerContainer;
