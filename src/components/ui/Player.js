import "styles/ui/Player.scss";
import PropTypes from "prop-types";

function Player(props) {
  const { name, team } = props;

  return (
    <div className={`player-container ${team}`}>
      <div className="player-name">{name}</div>
    </div>
  );
}

Player.propTypes = {
  name: PropTypes.string.isRequired,
  team: PropTypes.string.isRequired
};

export default Player;
