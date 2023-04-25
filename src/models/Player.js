/**
 * Player model
 */

class Player {
  constructor(data = {}) {
    this.id = null;
    this.nickname = null;
    this.team = null;
    this.avatar = null;
    this.roundsPlayed = null;
    Object.assign(this, data);
  }
}
export default Player;
