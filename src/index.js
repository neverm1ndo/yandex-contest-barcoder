import Barcoder from './lib/barcoder';
import './assets/css/style.css';

function component() {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 96;
  canvas.id = 'brcd';
  return canvas;
}
document.body.appendChild(component());

const barcoder = new Barcoder();
const input = document.querySelector('#input');

barcoder.clear();
barcoder.renderBarcode(input.value);

input.addEventListener('input', () => {
  barcoder.clear();
  if (!input.value.length) {
    return;
  }
  barcoder.renderBarcode(input.value);
});
