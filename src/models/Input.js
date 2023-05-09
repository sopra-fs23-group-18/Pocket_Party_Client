class Input {
    constructor(data = {}) {
      this.inputType = null;
      this.rawData = null;
      this.count = null;
      this.degree = null;
      Object.assign(this, data);
    }
  }
  
export default Input;