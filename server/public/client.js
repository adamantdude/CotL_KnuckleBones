// &#9856; &#9857; &#9858; &#9859; &#9860; &#9861
//    1       2       3       4       5       6
$(main);

const MAX_ROW = 3;
const MAX_COL = 3;

const Dice = { // dice icons for rendering
    0:'',
    1:'⚀',
    2:'⚁',
    3:'⚂',
    4:'⚃',
    5:'⚄',
    6:'⚅'
}

let player = 1; // player turn ; alternates between 1 & 2

let roll = 0; // current roll ; starts at 0, randomized between 1 & 6 inclusive

let totalPoints = { // for keeping track of total score
    '1': 0,
    '2': 0
}

const activeBoard = { // object state of the board
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
    reset: function () { // reset state of the board
        this[1] = this[1].map(x => x = x.map(y => y = 0));
        this[2] = this[2].map(x => x = x.map(y => y = 0));
    }
}

// jq pointers for rendering to DOM
let writableBoard;
let boardPoints;
let boardTotal;

// game / DOM ready function
function main() {

    console.log('Start!');
    $('#startBtn').on('click', beginGame);
    $('#resetBtn').on('click', swalReset);
    $('#howPlayBtn').on('click', howPlay);
    $('#howScoreBtn').on('click', howScore);

    setJQPointers();

    // console.log(writableBoard['1']);
    // console.log(writableBoard['2']);
    // console.log($('.p2block'));

    return 0;
}

function setJQPointers() {

    writableBoard = { // player DOM boards
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

    boardPoints = { // player DOM column scores
        '1': [$('#1.p1colScore'), $('#2.p1colScore'), $('#3.p1colScore')],
        '2': [$('#1.p2colScore'), $('#2.p2colScore'), $('#3.p2colScore')]
    }

    boardTotal = { // player DOM total score
        '1': $('#p1Score'),
        '2': $('#p2Score')
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
    player == 2 ? $('#player1.turnText').text('Player 1 Starts!') : $('#player2.turnText').text('Player 2 Starts!');
    duringGame();
    return;
}

// middle of a game
function duringGame() {
    player = player == 1 ? 2 : 1; // change whose turn it is
    console.log('Player %d\'s turn!', player);
    // turn off event listeners
    $('.p1colScore').off('click');
    $('.p2colScore').off('click');
    // turn on only required event listeners for whose turn it is
    player == 1 ? $('.p1colScore').on('click', set) : $('.p2colScore').on('click', set);
    // randomize the roll and render it
    roll = randomize(1, 6);
    rollRender();
    return;
}

function swalReset() {
    swal.fire({
        icon: 'question',
        showDenyButton: true,
        title: 'Do you want to reset the game?',
        confirmButtonText: 'Reset'
    })
        .then(value => {
            if(value.isConfirmed) resetGame();
        })
}

// reset the game
function resetGame() {
    console.log('Game Reset!');
    // allow start to be pressed again after resetting
    $('#startBtn').prop('disabled', false);
    $('#resetBtn').prop('disabled', true);
    // clear text for new game
    $('.p1colScore').off('click'); $('.p2colScore').off('click');
    $('.p1block').text(''); $('.p2block').text('');
    $('.p1colScore').text('0'); $('.p2colScore').text('0');
    $('.score').text('0');
    // reset state of game
    activeBoard.reset();
}

// end of a game
function endGame() {
    console.log('game ended! there\'s a winner!');

    $('.turnText').text('');
    let winner = totalPoints[1] > totalPoints[2] ? $('#player1.turnText') : $('#player2.turnText');
    winner.text('YOU WIN!!');

    totalPoints[1] > totalPoints[2] ? console.log('Player 1 Wins!') : console.log('Player 2 Wins!');
}

// set state function
function set() {
    $('.turnText').text('');
    console.log($(this));
    let column = $(this).attr('id')-1; // set dice in column of button pressed
    let attacker = activeBoard[player]; // active player board ; whoever's turn it is
    let set = false; // if (set)
    let row=0;
    for(; !set && row<attacker.length; ++row) {
        if (!attacker[row][column]) { // if column is not full
            // set to the DOM
            writableBoard[player][row+1][column].append(Dice[roll]);
            // set to the STATE
            attacker[row][column] = roll;
            set = true; // if placed, set true
        }
    }
    if(!set) return; // if no dice placed, try again
    attack(column); // attack other player board
    calculateScore(); // calculate player scores
    return;
}

function attack(column) {
    let defender = activeBoard[player == 1 ? 2 : 1] // inactive player board ; whoever is waiting
    for(let row=0; row<defender.length; ++row) {
        if(defender[row][column] == roll) { // if the attacked column contains the current roll
            // reset the DOM
            writableBoard[player == 1 ? 2 : 1][row+1][column].text('');
            // reset the STATE
            defender[row][column] = 0;
        }
    }
}

function calculateScore() {
    let scoresObj = {
        scoresp1: [0, 0, 0],
        scoresp2: [0, 0, 0],
        boardFill1: [0, 0, 0],
        boardFill2: [0, 0, 0]
    };

    let endGameCheck = false;

    for(let i=0; i<MAX_COL; ++i) { // for each column
        let [newObj1, newObj2] = columnCount(i); // count the numbers and instances in a column for both boards
        for(let num in newObj1) {
            if(num > 0) { // for key is not '0'
                // set the column totals into object with algorithm
                scoresObj.scoresp1[i] += addTotal(num, newObj1[num]);
                scoresObj.scoresp2[i] += addTotal(num, newObj2[num]);
                // check for board spaces taken
                scoresObj.boardFill1[i] += newObj1[num];
                scoresObj.boardFill2[i] += newObj2[num];
            }
        }
        boardPoints[1][i].text(scoresObj.scoresp1[i]);
        boardPoints[2][i].text(scoresObj.scoresp2[i]);
    }

    // calculate total points for each player and render to DOM
    totalPoints[1] = scoresObj.scoresp1.reduce((x, y) => x + y);
    boardTotal[1].text(totalPoints[1]);
    totalPoints[2] = scoresObj.scoresp2.reduce((x, y) => x + y);
    boardTotal[2].text(totalPoints[2]);

    // check for a filled board
    let p1check = scoresObj.boardFill1.reduce((x, y) => x + y) == 9;
    let p2check = scoresObj.boardFill2.reduce((x, y) => x + y) == 9;

    if(p1check || p2check) endGameCheck = true;
    // if a board is filled, end the game and declare a winner
    endGameCheck ? endGame() : duringGame();
}

// count numbers and instances for both boards of a certain column i
function columnCount(i) {
    let count1 = {
        '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0
    };

    let count2 = {
        '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0
    };
    
    // counts instances of numbers through a certain column
    activeBoard[1].map(x => x[i]).map(y => count1[y] ? count1[y] += 1 : count1[y] = 1);
    activeBoard[2].map(x => x[i]).map(y => count2[y] ? count2[y] += 1 : count2[y] = 1);

    return [count1, count2];
}

// calculate score ; if 2 of same roll in one column: (roll + roll) * 2 ; etc
function addTotal(num, instance) {
    let sum = 0;
    for(let i=0; i<instance; ++i) {
        sum += Number(num);
    }
    return sum * instance;
}

function howPlay() {
    swal.fire({
        title: 'How to Play',
        html: `
            This is a game of risk vs. reward. <hr>
            Each player on their turn will receive a randomly generated dice roll. <hr>
            They may place their dice on any column of the board as long as the column is not already full. <hr>
            In doing so, the player attacks any matching dice on the opponent's side of the board e.g. a 4 will
            attack a 4, and remove it from their side. <hr>
            When one side of the board is filled, the game ends. </br>
            The player with the highest total score wins!
        `
    })
}

function howScore() {
    swal.fire({
        title: 'How Score Works',
        html: `
            Score is calculated by adding up the faces of the dice. Matching
            dice in a column are multiplied by the number of instances. <hr>
            For example, two dice showing 5 will equal 20. </br>
            (5 + 5) * 2 = 20 <hr>
            Another example, three dice showing 3 will equal 27. </br>
            (3 + 3 + 3) * 3 = 27 <hr>
            The dice do not need to be placed together to get the bonus.</br>
            A column showing 5-3-5 will still get the bonus of two 5 dice and equal 23. </br>
            ((5 + 5) * 2) + 3 = 23 <hr>
            Total score is the sum of all columns added together.
        `
    })
}