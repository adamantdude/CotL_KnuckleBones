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
}

let writableBoard;

// game / DOM ready function
function main() {
    console.log('Start!');
    $('#startBtn').on('click', beginGame);
    $('#resetBtn').on('click', endGame);

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

    console.log(writableBoard['1']);
    console.log(writableBoard['2']);
    console.log($('.p2block'));
    return 0;
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

function endGame() {
    return;
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
            attacker[row][column] = roll;
            set = true;
        }
    }
    if(!set) return;
    attack(column);
    place(column, row);
    duringGame();
    return;
}

// set DOM function
function place(column, row) {
    writableBoard[player][row][column].append(Dice[roll]);
}

function attack(column) {
    let defender = activeBoard[player == 1 ? 2 : 1]
    for(let row=0; row<defender.length; ++row) {
        if(defender[row][column] == roll) {
            writableBoard[player == 1 ? 2 : 1][row+1][column].text('');
            defender[row][column] = 0;
        }
    }
}