const CLR_WHITE = '#fff';
const CLR_BLACK = '#000';
const SIZE = 8;

module.exports = class Barcoder {
  constructor(selector = '#brcd') {
    this.init(selector);
  }

  /**
   * @param {string} selector
  */
  init(selector) {
    this.canvas = document.querySelector(selector);
    this.ctx = this.canvas.getContext('2d', { antialias: false, depth: false });
  }

  clear() {
    this.fillBackground('#ffffff');
  }

  /**
   * @param {string} color
  */
  fillBackground(color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  /**
   * @param {string} dbg
   * @return {string}
  */

  static formDebugInfo(dbg) {
    function formatCode(code) {
      if (!code) return console.error('Empty code');
      const str = code.toString();
      return str + ('0').repeat(3 - str.length);
    }
    const info = JSON.parse(dbg);
    if (!info) return console.error('Invalid debug info');
    if (info.id.length !== 10) return console.error('Invalid ID');
    if (info.message.length > 34) return console.error('Message is too long');
    return `${info.id}${formatCode(info.code)}${info.message}${(' ').repeat(34 - info.message.length)}`;
  }

  drawStartEnd() {
    const border = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1];
    let margin = 0;
    for (let i = 0; i <= border.length; i += 1) {
      this.ctx.fillStyle = border[i] === 1 ? CLR_BLACK : CLR_WHITE;
      this.ctx.fillRect(margin, 0, border[i] === 1 ? 4 : 5, this.canvas.height);
      margin += (-border[i] + 5);
      if (i === 4) { margin = this.canvas.width - 22; }
    }
  }

  /**
   * @param {string} debugInfo
   * @return {void}
   */
  renderBarcode(debugInfo) {
    this.clear();
    this.drawStartEnd();

    function stringToCode(string) {
      const result = [];
      for (let i = 0; i < string.length; i += 1) {
        result.push(string[i].charCodeAt(0));
      }
      return result;
    }

    function mapToBinary(array) {
      const result = [];
      for (let i = 0; i < array.length; i += 1) {
        result.push(('00000000').substr(0, 8 - array[i].toString(2).length) + array[i].toString(2));
      }
      return result.join('');
    }

    function controlSumm(arr) {
      let xor = 0;
      for (let i = 0; i < arr.length; i += 1) {
        xor ^= arr[i];
      }
      return mapToBinary([xor]);
    }

    const map = stringToCode(Barcoder.formDebugInfo(debugInfo));
    map.push(controlSumm(map));
    const rows = mapToBinary(map).match(/.{1,32}/g);
    for (let row = 0; row < rows.length; row += 1) {
      for (let char = 0; char < rows[row].length; char += 1) {
        this.ctx.fillStyle = parseInt(rows[row][char], 10) === 1 ? CLR_BLACK : CLR_WHITE;
        this.ctx.fillRect(
          22 + char * SIZE,
          row * SIZE,
          SIZE,
          SIZE,
        );
      }
    }
  }
};
