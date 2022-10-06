// &#9856; &#9857; &#9858; &#9859; &#9860; &#9861
//    1       2       3       4       5       6
$(main);

const MAX_ROW = 3;
const MAX_COL = 3;

const Dice = {
    1:'⚀',
    2:'⚁',
    3:'⚂',
    4:'⚃',
    5:'⚄',
    6:'⚅'
}

let player = 1;

let roll = 0;

let p1Board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];
let p2Board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];

function main() {
    console.log('Start!');
    $('#startBtn').on('click', beginGame);
    return 0;
}

function render() {
    $('#p1Roll').text('');
    $('#p2Roll').text('');
    player == 1 ? $('#p1Roll').text(Dice[roll]) : $('#p2Roll').text(Dice[roll]);
    
}

function randomize(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function beginGame() {
    console.log('Game Begin!');
    $('#startBtn').prop('disabled', true);
    $('#resetBtn').prop('disabled', false);
    turn(player = randomize(1, 2));
    return;
}

function duringGame() {
    turn(player = player == 1 ? 2 : 1);
    return;
}

function endGame() {
    return;
}

function turn() {
    console.log('Player %d\'s turn!', player);
    $('.p1block').off('click');
    $('.p2block').off('click');
    switch (player) {
        case 1:
            $('.p1block').on('click', set);
            break;
        case 2:
            $('.p2block').on('click', set);
            break;
    }
    roll = randomize(1, 6);
    render();
}

function set() {
    console.log($(this));
    $(this).text(Dice[roll]);
    duringGame();
    return;
}