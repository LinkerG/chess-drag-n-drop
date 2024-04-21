let board;
const place = new Audio('sounds/move-self.mp3');
const capture = new Audio('sounds/capture.mp3');
window.addEventListener("load", function(){
    board = document.getElementById("board");
    initChessGame();
    draganddrop();
});

function draganddrop(){
    const cells = document.querySelectorAll('.cell');

    let selectedPiece = null;

    cells.forEach(cell => {
        // Agrega evento de arrastrar para las fichas
        cell.addEventListener('dragstart', function (event) {
            selectedPiece = event.target;
            checkPlacing(selectedPiece, selectedPiece.parentNode);
        });

        // Agrega evento de soltar para las casillas
        cell.addEventListener('drop', function (event) {
            event.preventDefault();
            if (event.target.classList.contains('available')) {
                place.play();
                event.target.appendChild(selectedPiece);

            }
            const available = document.querySelectorAll('.available');
            available.forEach(element => {
                element.classList.remove('available');
            });
        });

        // Previene el comportamiento predeterminado de las casillas para permitir el soltar
        cell.addEventListener('dragover', function (event) {
            event.preventDefault();
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
            availableMoves = checkPawnCaptures(row, col, color, availableMoves);
            colorAvailableMoves(availableMoves);
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
    console.log(availableMoves);
}

function checkPawnCaptures(row, col, color, availableMoves) {
    

    return availableMoves;
}

function colorAvailableMoves(availableMoves){
    availableMoves.forEach(cell => {
        let cellToColor = board.querySelector("[data-coordinates=" + cell + "]")
        console.log(cellToColor);
        cellToColor.classList.add("available")
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
