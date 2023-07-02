import { setupInput } from './input.js';
import { setupHistory } from './history.js';
import {setupButtons} from './buttons.js';

const inputField = document.getElementById('input');
const highlighted = document.getElementById('highlighted');
const caret = document.getElementById('caret');
const calcForm = document.getElementById('calcForm');
const historyDiv = document.getElementById('history');
const resultDiv = document.getElementById('result');

setupInput(inputField, caret, highlighted);
setupHistory(calcForm, inputField, historyDiv, resultDiv);
setupButtons(inputField);
