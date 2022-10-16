// &#9856; &#9857; &#9858; &#9859; &#9860; &#9861
//    1       2       3       4       5       6
$(main);

const MAX_ROW = 3;
const MAX_COL = 3;

const Dice = {
    0:'',
    1:'⚀',
    2:'⚁',
    3:'⚂',
    4:'⚃',
    5:'⚄',
    6:'⚅'
}

let player = 1;

let roll = 0;

let totalPoints = {
    '1': 0,
    '2': 0
}

const activeBoard = {
    '1': [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ],
    '2': [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ],
    reset: function () {
        this[1] = this[1].map(x => x = x.map(y => y = 0));
        this[2] = this[2].map(x => x = x.map(y => y = 0));
    }
}

let writableBoard;

let boardPoints;

// game / DOM ready function
function main() {

    console.log('Start!');
    $('#startBtn').on('click', beginGame);
    $('#resetBtn').on('click', resetGame);

    setJQPointers();

    console.log(writableBoard['1']);
    console.log(writableBoard['2']);
    console.log($('.p2block'));
    return 0;
}

function setJQPointers() {

    writableBoard = {
        '1': {
            '1': [$('.p1block#1-1'), $('.p1block#1-2'), $('.p1block#1-3')],
            '2': [$('.p1block#2-1'), $('.p1block#2-2'), $('.p1block#2-3')],
            '3': [$('.p1block#3-1'), $('.p1block#3-2'), $('.p1block#3-3')]
        },
        '2': {
            '1': [$('#1-1.p2block'), $('#1-2.p2block'), $('#1-3.p2block')],
            '2': [$('#2-1.p2block'), $('#2-2.p2block'), $('#2-3.p2block')],
            '3': [$('#3-1.p2block'), $('#3-2.p2block'), $('#3-3.p2block')]
        }
    }

    boardPoints = {
        '1': [$('#1.p1colScore'), $('#2.p1colScore'), $('#3.p1colScore')],
        '2': [$('#1.p2colScore'), $('#2.p2colScore'), $('#3.p2colScore')]
    }

}

// render the dice roll
function rollRender() {
    $('#p1Roll').text('');
    $('#p2Roll').text('');
    player == 1 ? $('#p1Roll').text(Dice[roll]) : $('#p2Roll').text(Dice[roll]);
}

// randomize number
function randomize(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

// beginning of a new game
function beginGame() {
    console.log('Game Begin!');
    $('#startBtn').prop('disabled', true);
    $('#resetBtn').prop('disabled', false);
    player = randomize(1, 2);
    duringGame();
    return;
}

// middle of a game
function duringGame() {
    player = player == 1 ? 2 : 1; // change whose turn it is
    console.log('Player %d\'s turn!', player);
    $('.p1colScore').off('click');
    $('.p2colScore').off('click');
    player == 1 ? $('.p1colScore').on('click', set) : $('.p2colScore').on('click', set);
    roll = randomize(1, 6);
    rollRender();
    return;
}

function resetGame() {
    console.log('Game Reset!');
    $('#startBtn').prop('disabled', false);
    $('#resetBtn').prop('disabled', true);
    $('.p1block').text(''); $('.p2block').text('');
    $('.p1colScore').text('0'); $('.p2colScore').text('0');
    activeBoard.reset();
}

function endGame() {
    console.log('game ended! there\'s a winner!');

    totalPoints[1] > totalPoints[2] ? console.log('Player 1 Wins!') : console.log('Player 2 Wins!');
}

// set state function
function set() {
    console.log($(this));
    let column = $(this).attr('id')-1;
    let attacker = activeBoard[player];
    let set = false;
    let row=0;
    for(; !set && row<attacker.length; ++row) {
        if (!attacker[row][column]) {
            // set to the DOM
            writableBoard[player][row+1][column].append(Dice[roll]);
            // set to the STATE
            attacker[row][column] = roll;
            set = true;
        }
    }
    if(!set) return;
    attack(column);
    calculateScore();
    return;
}

function attack(column) {
    let defender = activeBoard[player == 1 ? 2 : 1]
    for(let row=0; row<defender.length; ++row) {
        if(defender[row][column] == roll) {
            // reset the DOM
            writableBoard[player == 1 ? 2 : 1][row+1][column].text('');
            // reset the STATE
            defender[row][column] = 0;
        }
    }
}

function calculateScore() {
    let activePlayer = {
        scores: [0, 0, 0],
        boardFill: [0, 0, 0]
    };

    let endGameCheck = false;

    for(let i=0; i<MAX_ROW; ++i) {
        let newObj = columnCount(i);
        for(let num in newObj) {
            if(num > 0 && newObj[num] > 0) {
                activePlayer.scores[i] += Math.pow(num, newObj[num]);
                activePlayer.boardFill[i] += newObj[num];
            }
        }
        boardPoints[player][i].text(activePlayer.scores[i]);
    }

    totalPoints[player] = activePlayer.scores.reduce((x, y) => x + y);

    if(activePlayer.boardFill.reduce((x, y) => x + y) == 9) endGameCheck = true;

    endGameCheck ? endGame() : duringGame();
}

function columnCount(i) {
    let count = {
        '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0
    };
    
    activeBoard[player].map(x => x[i]).map(y => count[y] ? count[y] += 1 : count[y] = 1);

    return count;
}