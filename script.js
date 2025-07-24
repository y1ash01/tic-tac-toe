function Gameboard(){
    const rows = 3;
    const columns = 3;
    let board = [];
    for (let i=0;i<rows;i++){
        board[i] = [];
        for (let j=0;j<columns;j++){
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const addMarker = function(player,row,column){
        if(board[row][column].getValue() !== 0){
            return;
        }
        board[row][column].addToken(player);
    }

    const reset=()=>{
        board = [];
        for (let i=0;i<rows;i++){
        board[i] = [];
        for (let j=0;j<columns;j++){
            board[i].push(Cell());
        }
    }
    }
    
    const printBoard = () => {
        board.forEach((row)=>{
            console.log(row.map((cell)=>cell.getValue()))
        })
    }

    return {getBoard,addMarker,printBoard,rows,columns,reset};
}

function Cell(){
    let value = 0;

    const addToken=(player)=>{value=player;}

    const getValue = ()=>value;

    return {addToken,getValue};
}

function Playgame(){
    let playerone = "Player One";
    let playertwo = "Player Two";
    const board = Gameboard();
    let players = [
        {
            name: playerone,
            token: 1
        },
        {
            name: playertwo,
            token: 2
        }
    ]

    let active = players[0];

    const switchPlayerTurn = () => {
        active = active === players[0]?players[1]:players[0];
    }

    const getActivePlayer = () => active;

    const getInactivePlayer = () => {
        return active === players[0]?players[1]:players[0];
    }

    const printCurr = () =>{
        console.log(`${getActivePlayer().name}'s turn`)
    }

    const playRound = (row,column) => {
        printCurr();
        curr = getActivePlayer();
        board.printBoard();
        board.addMarker(curr.token,row,column);
        board.printBoard();


        let flag = 0;
        const b = board.getBoard();
        for (let i=0;i<board.rows;i++){
            let count =0;
            for (let j = 0;j<board.columns;j++){
                if(b[i][j].getValue() === curr.token){
                    count++;
                    if(count === board.columns){
                        flag=1;
                        break;
                    }
                }
            }
            if(flag === 1){
                break;
            }
        }

        if(flag !== 1){
            for (let i=0;i<board.columns;i++){
                let count =0;
                for (let j = 0;j<board.rows;j++){
                    if(b[i][j].getValue() === curr.token){
                        count++;
                        if(count === board.rows){
                            flag=1;
                            break;
                        }
                    }
                }
                if(flag === 1){
                    break;
                }
            }
        }

        if(flag !== 1){
            let count1=0,count2=0;
            for (let i=0;i<board.rows;i++){
                for (let j = 0;j<board.columns;j++){
                    if(i === j && b[i][j].getValue() === curr.token){
                        count1++;
                        if(count1 === 3){
                            flag=1;
                            break;
                        }
                    }

                    if(i + j === 2 && b[i][j].getValue() === curr.token){
                        count2++;
                        if(count2 === 3){
                            flag=1;
                            break;
                        }
                    }
                }
                if(flag === 1){
                    break;
                }
            }
        }
        if(flag){
            return curr;
        }

        switchPlayerTurn();
    }
    
    return{playRound,getActivePlayer,playerone,playertwo,getInactivePlayer,active,players,board};
}

function domPlay(){
    let container = document.querySelector(".container")
    const generate = () => {
        for (let i=0;i<9;i++){
            let box = document.createElement('div');
            box.classList.add("box");
            box.setAttribute("row",Math.floor(i/3));
            box.setAttribute("column",Math.floor(i%3));
            box.addEventListener("click",eventDelegation);
            container.appendChild(box);
        }
    }

    const game = Playgame();
    let turn = document.querySelector("#turn");
    turn.textContent = `${game.playerone}'s turn`;
    function eventDelegation(e){
        if(e.target.textContent !== "")
            return;
        const player = game.getInactivePlayer();
        turn.textContent = `${player.name}'s turn`;
        e.target.textContent = player.token === 1 ? "◯" : "X";
        const row = e.target.getAttribute("row");
        const column = e.target.getAttribute("column");
        let winner = game.playRound(row,column);
        if(winner !== undefined){
            turn.textContent = `${winner.name} Wins!`;
        }
    }

    const changeNameReset = ()=>{
        let reset = document.querySelector(".reset");
        reset.addEventListener("click",(e)=>{
            container.textContent = "";
            generate();
            game.active = game.players[0];
            game.board.reset();
        })

        let change = document.querySelector(".change");
        dialog = document.querySelector("dialog");
        change.addEventListener("click",(e)=>{
            dialog.showModal();
        })

        let form = document.querySelector("form");
        form.addEventListener("submit",(e)=>{
            e.preventDefault();
            let formdata = new FormData(form);
            let p1 = formdata.get("player1");
            let p2 = formdata.get("player2");
            game.players[0].name = p1;
            game.players[1].name = p2;
            let turn = document.querySelector("#turn");
            turn.textContent = `${game.getActivePlayer().name}'s turn`
            form.reset();
            dialog.close();
        })
    }
    return{generate,changeNameReset};
}

let startGame = domPlay();
startGame.generate();
startGame.changeNameReset();