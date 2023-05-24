class LobbyModel {
    constructor(data = {}) {
      this.id = null;
      this.inviteCode = null;
      this.teams = null;
      this.unassignedPlayers = null;
      Object.assign(this, data);
    }
  }
  export default LobbyModel;