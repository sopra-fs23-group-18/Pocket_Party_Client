/**
 * Game model
 */

class Game {
    constructor(data = {}) {
        this.id = null;
        this.winningScore = null;
        Object.assign(this, data);
    }
}
export default Game;
