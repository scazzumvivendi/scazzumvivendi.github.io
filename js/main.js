const MULTIPLIER = 1;
const CURSOR_PX = 32;
let currentPosX = 0;
let currentPosY = 0;
let screenOffset = 0;
let textMatrix = [];

function init() {
    //TODO Handle different resolution from 320*200 to 1280*800
    document.addEventListener("keydown", handleKey);
    writeStartupScreen();
}

function handleKey(event) {
    const keyCode = event.keyCode;
    const key = event.key;
    console.log(event);
    switch (keyCode) {
        case 37: //CRSRLEFT
            moveCursor(-1, 0);
            return;
        case 38: //CRSRUP
            moveCursor(0, -1);
            return;
        case 39: //CRSRRIGHT
            moveCursor(1, 0);
            return;
        case 40: //CRSRDOWN
            moveCursor(0, 1);
            return;
        case 13: //ENTER
            executeLine();
            return;
        case 8: //BACKSPACE    
            event.preventDefault();
            handleBackSpace();
        case 0: //VARS
        case 9: //TAB
        case 16: //SHIFT
        case 18: //ALT - AltGR WARNING IF USED CHECK!!!
        case 20: //CAPS
        case 27: //ESC -> RUN/STOP?
        case 91: //WIN
        case 93: //CONTEXT MENU
        case 112: //F1
        case 113: //...
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 119:
        case 120:
        case 121:
        case 122:
        case 123: //F12
        case 181: //Audio mute
            return;
        default:
            writeCharacter(key);
    }
}

function moveCursor(deltaX, deltaY) {
    const cursor = document.getElementById('cursor');
    const overlay = document.getElementById('overlay');
    const left = isNaN(parseInt(cursor.style.left.split('px')[0])) ? 0 : parseInt(cursor.style.left.split('px')[0]);
    const top = isNaN(parseInt(cursor.style.top.split('px')[0])) ? 0 : parseInt(cursor.style.top.split('px')[0]);

    cursor.style.left = (left + deltaX * CURSOR_PX) + 'px';
    cursor.style.top = (top + deltaY * CURSOR_PX) + 'px';

    currentPosX = Math.floor((left + deltaX * CURSOR_PX) / CURSOR_PX);
    currentPosY = Math.floor((top + deltaY * CURSOR_PX) / CURSOR_PX);

    if (currentPosX > 39) {
        moveCursor(-40, 1);
    }

    if (currentPosX < 0) {
        moveCursor(40, -1);
    }

    if (currentPosY < 0) {
        moveCursor(0, 1);
        moveScreen(-1);
    }
    if (currentPosY > 24) {
        moveCursor(0, -1);
        moveScreen(1);
    }

    if (!!textMatrix[currentPosY]) {
        overlay.textContent = textMatrix[currentPosY][currentPosX];
    } else {
        overlay.textContent = "";
    }
}

function writeCharacter(char) {
    if (!textMatrix[currentPosY]) {
        textMatrix[currentPosY] = [];
    }
    textMatrix[currentPosY][currentPosX] = char.toUpperCase();
    moveCursor(1, 0);
    printTextMatrix(screenOffset);
}

function writeStartupScreen() {
    const c64 = document.getElementById('c64-text');
    c64.textContent += "\n";
    c64.textContent += "       **** SCAZZUM VIVENDI ****\n";
    c64.textContent += "\n";
    c64.textContent += "    PROJECT LIST - 38911 BYTES FREE\n";
    c64.textContent += "\n";
    c64.textContent += "READY.\n";
    moveCursor(0, 6);
    updateTextMatrix();
}

function updateTextMatrix() {
    const c64 = document.getElementById('c64-text');
    const writtenText = c64.textContent;
    let textMatrixX = 0;
    let textMatrixY = 0;
    for (let char of writtenText) {
        if (char == "\n") {
            textMatrixX += 1;
            textMatrixY = 0;
            continue;
        }
        if (!textMatrix[textMatrixX]) {
            textMatrix[textMatrixX] = [];
        }
        textMatrix[textMatrixX][textMatrixY] = char;
        textMatrixY += 1;
    }
    console.log(textMatrix);
}

function printTextMatrix(inputX) {
    let startX = !!inputX ? inputX : 0;
    const c64 = document.getElementById('c64-text');
    let text = "";
    for (let x = startX; x < textMatrix.length; x++) {
        const xLength = textMatrix[x] ? textMatrix[x].length : 0;
        for (let y = 0; y < xLength; y++) {
            if (textMatrix[x][y] != null) {
                text += textMatrix[x][y];
            } else {
                text += " ";
            }
        }
        text += "\n"
    }
    c64.textContent = text;
}

function executeLine() {
    moveCursor(0, 2);
    handleError();
}

function moveScreen(delta) {
    screenOffset += delta;
    if (screenOffset > -1) {
        printTextMatrix(screenOffset);
    } else {
        screenOffset = 0;
    }
}

function handleBackSpace() {
    if (currentPosX > 0) {
        for (let x = currentPosX; x < 40; x++) {
            textMatrix[currentPosY][x-1] = textMatrix[currentPosY][x];
        }
    }
    printTextMatrix();
    moveCursor(-1, 0);
}

function handleError() {
    const err = "?SYNTAX ERROR";
    const msg = "READY.";
    for (let i in err) {
        if (!textMatrix[currentPosY]) {
            textMatrix[currentPosY] = [];
        }
        textMatrix[currentPosY][i] = err[i];
    }
    for (let i in msg) {
        if (!textMatrix[currentPosY + 1]) {
            textMatrix[currentPosY + 1] = [];
        }
        textMatrix[currentPosY + 1][i] = msg[i];
    }
    moveCursor(-currentPosX, 2);
    printTextMatrix(screenOffset);
}