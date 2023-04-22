class LobbyModel {
    constructor(data = {}) {
      this.id = null;
      this.inviteCode = null;
      this.winningScore = null;
      this.teams = null;
      this.unassignedPlayers = null;
      Object.assign(this, data);
    }
  }
  export default LobbyModel;