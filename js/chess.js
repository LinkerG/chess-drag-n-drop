let board;
const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
const place = new Audio('sounds/move-self.mp3');
const capture = new Audio('sounds/capture.mp3');
window.addEventListener("load", function(){
    board = document.getElementById("board");
    initChessGame();
    draganddrop();
});

function draganddrop() {
    const cells = document.querySelectorAll('.cell');

    cells.forEach(cell => {
        // Agrega evento de arrastrar para las fichas
        cell.addEventListener('dragstart', function(event) {
            selectedPiece = event.target;
            checkPlacing(selectedPiece, selectedPiece.parentNode);
        });

        // Agrega evento de soltar para las casillas
        cell.addEventListener('drop', function(event) {
            event.preventDefault();
            if (event.target.classList.contains('capture')) {
                capture.play();
                event.target.innerHTML = '';
                event.target.appendChild(selectedPiece);
            } else if (event.target.classList.contains('available')) {
                place.play();
                event.target.appendChild(selectedPiece);
            }

            const cells = document.querySelectorAll('.available, .capture');
            cells.forEach(cell => {
                cell.classList.remove('available', 'capture');
            });
        });

        // Previene el comportamiento predeterminado de las casillas para permitir el soltar
        cell.addEventListener('dragover', function(event) {
            event.preventDefault();

            if (event.target.classList.contains('capture')) {
                event.dataTransfer.dropEffect = 'move'; // Cambiar el efecto del cursor al mover sobre una celda de captura
            } else if (event.target.classList.contains('available')) {
                event.dataTransfer.dropEffect = 'move'; // Cambiar el efecto del cursor al mover sobre una celda disponible
            } else {
                event.dataTransfer.dropEffect = 'none'; // No permitir el soltar en otras celdas
            }
        });
    });
}

function checkPlacing(selectedPiece, startingPoint){
    const clases = selectedPiece.classList;
    let [col, row] = startingPoint.dataset.coordinates.split("");
    const type = clases[1]
    const color = clases[2]
    let availableMoves = [];
    switch (type) {
        case "pawn":
            if (row == 2 && color == "white") {
                availableMoves.push(col + (parseInt(row)+1))
                availableMoves.push(col + (parseInt(row)+2))
            } else if (row != 2 && color == "white") {
                availableMoves.push(col + (parseInt(row)+1))
            } else if (row == 7 && color == "black") {
                availableMoves.push(col + (parseInt(row)-1))
                availableMoves.push(col + (parseInt(row)-2))
            } else if (row != 7 && color == "black") {
                availableMoves.push(col + (parseInt(row)-1))
            }
            let captureMoves = checkPawnCaptures(row, col, color, availableMoves);
            colorAvailableMoves(availableMoves);
            colorCaptureMoves(captureMoves);
            break;
        case "rook":
            break;
        case "bishop":
            break;
        case "knight":
            break;
        case "queen":
            break;
        case "king":
            break;
    }
}

function checkPawnCaptures(row, col, color, availableMoves) {
    let captureMoves = [];
    row = parseInt(row);

    if (col !== "A") {
        const leftCol = String.fromCharCode(col.charCodeAt(0) - 1);
        const targetCell = leftCol + (color === "white" ? row + 1 : row - 1);
        if (hasOpponentPiece(targetCell, color)) {
            captureMoves.push(targetCell);
        }
    }

    if (col !== "H") {
        const rightCol = String.fromCharCode(col.charCodeAt(0) + 1);
        const targetCell = rightCol + (color === "white" ? row + 1 : row - 1);
        if (hasOpponentPiece(targetCell, color)) {
            captureMoves.push(targetCell);
        }
    }

    return captureMoves;
}

function hasOpponentPiece(cell, color) {
    const targetCell = document.querySelector(`[data-coordinates="${cell}"]`);
    if (targetCell) {
        const piece = targetCell.querySelector(`.chessPiece.${color === "white" ? "black" : "white"}`);
        return piece !== null;
    }
    return false;
}


function colorAvailableMoves(availableMoves){
    availableMoves.forEach(cell => {
        let cellToColor = board.querySelector("[data-coordinates=" + cell + "]")
        cellToColor.classList.add("available")
    })
}

function colorCaptureMoves(captureMoves){
    captureMoves.forEach(cell => {
        let cellToColor = board.querySelector("[data-coordinates=" + cell + "]")
        cellToColor.classList.add("capture")
    })
}

function initChessGame() {
    const colors = ["black", "white"];
    const pieceOrder = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];

    colors.forEach(color => {
        const rank = (color === 'black') ? 8 : 1;
        const pawnRank = (color === 'black') ? 7 : 2;

        const startPoints = {
            pieces: board.querySelector(`[data-coordinates="A${rank}"]`).parentNode.children,
            pawns: board.querySelector(`[data-coordinates="A${pawnRank}"]`).parentNode.children
        };

        placePieces(startPoints.pieces, color, pieceOrder);
        placePieces(startPoints.pawns, color, ['pawn']);
    });
}

function placePieces(cells, color, types) {
    cells = Array.from(cells)
    cells.forEach((cell, index) => {
        const pieceType = types[index % types.length];
        const pieceImg = document.createElement("img");
        pieceImg.src = `pieces/${color}-${pieceType}.png`;
        pieceImg.alt = `${color} ${pieceType}`;
        pieceImg.classList.add("chessPiece");
        pieceImg.classList.add(pieceType);
        pieceImg.classList.add(color);
        cell.appendChild(pieceImg);
    });
}
