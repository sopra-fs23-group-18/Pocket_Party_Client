class Input {
    constructor(data = {}) {
      this.inputType = null;
      this.rawData = null;
      Object.assign(this, data);
    }
  }
  
export default Input;