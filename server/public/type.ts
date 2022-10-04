// &#9856; &#9857; &#9858; &#9859; &#9860; &#9861
//    1       2       3       4       5       6

$(main);

const MAX_ROW : number = 3;
const MAX_COL : number = 3;

let p1Board : number[][] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
]

let p2Board : number[][] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
]

function main() : number {

    $('startBtn').on('click', beginGame);

    return 0;
}

function render() : void {

}

function randomize() : number {
    return Math.round(Math.random() * (6 - 1) + 1);
}

function beginGame() : void {

    $('startBtn').prop('disabled', true);
    $('resetBtn').prop('disabled', false);
    
    turn(Math.round(Math.random() * (2 - 1) + 1));

    return;
}

function endGame() : void {


    return;
}

function turn(player : number) : void {

    switch(player){
        case 1:
            $('#p1 .block').on('click', set);
            $('#p2 .block').off('click');
            break;
        case 2:
            $('#p2 .block').on('click', set);
            $('#p1 .block').off('click');
            break;
    }

}

function set() : void {

}