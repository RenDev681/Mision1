/*Lista de cosas que hacer:

-Que los enemigos se muevan de forma aleatoria a una de las casillas adyacentes en diagonal o a los lados, pero que si el personaje esta en una 
de ellas se muevan hacia la que estaba (Aunque a lo mejor podría investigar dos casillas a los lados)
-Hacer apartado visual de la pnatalla de inicio
-Apartado visual de los niveles
-Apartado visual de la pantalla de muerte
-Apartado visual de la pantalla final del juego
*/


//Variables
//Variables del tablero
let numColumns=0; //Variable que guardará el numero que meta el jugador
let numTile=0; //Variable de la cantidad total de casillas que habrá
let board = [[]]; //Tablero
let cuadricula; //La cuadricula es el espacio fisico del tablero en el html, mientras que la variable anterior es el estado que te dice que casilla es que
let levels=3; //Cantidad de niveles que va a haber, se puede poner los que quieras
let lettersCollected=0; //Numero de letras recolectadas por el jugador
let maxLetters=0; //Numero que guardara cuantas letras han aparecido en total, esta variable ira aumentando al pasar de niveles
let enemyNum=0; 
let letterNum=0;


//Variables del documento
const counter = document.getElementById("counter");
const mainMenu = document.getElementById("mainMenu");
const gameScreen = document.getElementById("game");
const deathScreen = document.getElementById("deathScreen");
const victoryScreen = document.getElementById("victoryScreen");
const finalLetterAmount = document.getElementsByClassName("finalCounter"); //En este caso, elegimos usar el getElementsByClassName porque a la diferencia de las lineas anteriores, tenemos dos contadores finales, por lo que se guarda como si fuera un array

let entetyNum; //Variable que va a controlar cuantas letras y enemigos hay, uso la misma porque quiero que haya el mismo número de ambas

//Variables de sonido
const mouseSound = new Audio("Media/Sound/squeak.mp3");
const victorySound = new Audio("Media/Sound/yay.mp3");

//Variables de Inputs
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

//Función para actualizar el tablero de juego despues de cada movimiento
function updateBoard(){
    
    counter.textContent = lettersCollected;

    searchEnemies();
    for (let i = 0; i < numColumns; i++) {
        for (let j = 0; j < numColumns; j++) {
            const tile = cuadricula.children[j+(i*numColumns)];

            if((tile.id==="player")||(tile.id==="door")){
                tile.removeAttribute("id");
            }else{
                tile.removeAttribute("class");
            }

            switch(board[[i, j]]){
                case(1):
                    tile.setAttribute("id", "player");
                    break;
                case(2):
                    tile.setAttribute("class", "floor");
                    break;
                case(3):
                    tile.setAttribute("class", "letter");
                    break;
                case(4):
                    tile.setAttribute("class", "enemy");
                    break;
                case(5):
                    tile.setAttribute("id", "door");
                default:
                    break;
            }
        }
    }
}


//Función que crea el tablero de juego dependiendo del número que le hayas puesto al inicio
function crearGrid(){
    mouseSound.play();
    //Inicializamos las variables dependiendo del numero que metio el usuario
    numColumns = document.getElementById("selector").value;
    cuadricula = document.getElementById("cuadricula");
    mainMenu.style.display = "none";
    gameScreen.style.display = "block";
    entetyNum = numColumns-1; //Esto controla cuantas letras y enemigos va a haber, si modificamos ese numero podemos hacer que haya más o menos
    letterNum = 0;
    enemyNum = 0;
    //Resetear la cuadricula 
    while(cuadricula.firstChild){

        cuadricula.removeChild(cuadricula.firstChild);
    }
    
    for (let i = 0; i < numColumns; i++) {
        for (let j = 0; j < numColumns; j++) {

            if(i==(numColumns-1) && j==0){

                board[[i, j]] = 1;
            }else if((i==0) && j==(numColumns-1)){

                board[[i, j]] = 5;
            }else if(((i==(numColumns-2))&&(j==0))||((i==(numColumns-2))&&(j==1))||((i==(numColumns-1))&&(j==(numColumns-2)))){ //Esto es para asegurarse de que ningun enemigo aparece al lado del personaje al principio
                
                let randNum = Math.floor(Math.random() * (4-2) +2); //En este caso elegimos un numero entre el 2 y 3, puesto que al no poder ser un enemigo, solo puede ser suelo o letra
                if((randNum==3)&&(letterNum<entetyNum)){
                    board[[i, j]] = randNum;
                    letterNum++;
                }else{
                    board[[i, j]] = 2;
                }
            }else{
                let randNum = Math.floor(Math.random() * (5-2) +2); //Elegimos un numero random que será que tipo de casilla es
                switch(randNum){
                    case(2):
                        board[[i, j]] = randNum;
                        break;
                    case(3):
                        if(letterNum<entetyNum){
                            board[[i, j]] = randNum;
                            letterNum++;
                        }else{
                            board[[i, j]] = 2;
                        }
                        break;
                    case(4):
                        if(enemyNum<entetyNum){
                            board[[i, j]] = randNum;
                            enemyNum++;
                        }else{
                            board[[i, j]] = 2;
                        }
                        break;
                    default:
                        break;
                }
            }  
        }
    }
    
    for (let i = 0; i < numColumns; i++) {
        for (let j = 0; j < numColumns; j++) {
            let p = document.createElement("div");
            switch(board[[i, j]]){
                case(1):
                    p.setAttribute("id", "player");
                    
                    break;
                case(2):
                    p.setAttribute("class", "floor");
                    break;
                case(3):
                    p.setAttribute("class", "letter");
                    break;
                case(4):
                    p.setAttribute("class", "enemy");
                    break;
                case(5):
                    p.setAttribute("id", "door");
                default:
                    break;
            }
            //var pTexto = document.createTextNode(board[[i,j]]);
            //p.appendChild(pTexto);
            cuadricula.appendChild(p);
        }
    }
    maxLetters+=letterNum;
    document.documentElement.style.setProperty("--taman-cuadricula", numColumns);
}

//Funcion para buscar el jugador 
function searchPlayer(){
    for(let i=0; i<numColumns; i++){
        for(let j=0; j<numColumns; j++){
            if(board[[i,j]]==1){
                const num=[i, j];
                return num;
            }
        }
    }
}

//Función que se ejecuta cuando te has chocado contra un enemigo
function death(){
    
    finalLetterAmount[0].textContent = lettersCollected; //Como se explico anteriormente, este es un array con los dos contadores que tenemos, y en este caso, como en el html la pantalla de muerte esta antes, pues eleigimos el primer objeto de este array
    deathScreen.style.display = "block";
    gameScreen.style.display = "none";
}

//Funcion que se ejecuta cuando ya te has pasado todos los niveles
function victory(){
    victorySound.play();
    const finalText = lettersCollected + " letras, es debido a esto que has conseguido escribir" + bookSelector(); //TODO template
    finalLetterAmount[1].textContent = finalText;
    victoryScreen.style.display = "block";
    gameScreen.style.display = "none";
}

//Funcion que te devuelve el libro que has escrito dependiendo de la cantidad de letras que has conseguido
function bookSelector(){

    if(lettersCollected==0){
        return " nada, lo lamento mucho... Pero no has conseguido ni una letra, y con eso no se pueden escribir libros.";
    }else if((lettersCollected>0)&&(lettersCollected<(maxLetters/4))){
        return " has conseguido menos de un cuarto de las letras";
    }else if((lettersCollected>=(maxLetters/4))&&(lettersCollected<(maxLetters/2))){
        return " has conseguido menos de la mitad de las letras";
    }else if((lettersCollected>=(maxLetters/2))&&(lettersCollected<(maxLetters-1))){
        return " has conseguido más de la mitad de las letras";
    }else if(lettersCollected==maxLetters){
        return " 'En busca del tiempo perdido', el libro más largo del mundo ENHORABUENA";
    }else{
        return " has roto el juego";
    }
}

//Funcion que se encarga de actulizar el movimiento del jugador, la hice para no tener que poner este código tres veces en la funcion checkTile y que quedara más limpio
function movePlayer(currentPlayerX, currentPlayerY, nextPlayerX, nextPlayerY){

    board[[currentPlayerX, currentPlayerY]]=2;
    board[[nextPlayerX, nextPlayerY]] = 1;
}

//Funcion que busca a todos los enemigos que hay en el tablero
function searchEnemies(){

    let enemies = [];
    for(let i=0; i<numColumns; i++){
        for(let j=0; j<numColumns; j++){
            if(board[[i,j]]==4){
                enemies.push({posX: i, posY: j}); //Si encuentra a uno lo mete en un array junto con su posicion X e Y
                
            }
        }
    }
    //Una vez a encontrado a todos, cada uno ejecuta la función de buscar en sus alrededores
    for(e=0; e<enemies.length; e++){
        checkSorroundings(enemies[e].posX, enemies[e].posY);
    }
}

//esta funcion lo que hace es ver lo que tiene en los alrededores el enemigo, y dependiendo de esto, se mueve a una u a otra
function checkSorroundings(X, Y){
    let posibleTiles = [];
    for(let i=X-1;i<=(X+1);i++){
        for(let j=Y-1;j<=(Y+1);j++){
            if((i>=0)&&(j>=0)&&(i<numColumns)&&(j<numColumns)){
                switch(board[[i, j]]){
                    case(1):
                        
                        break;
                    case(2):
                        posibleTiles.push({posX: i, posY: j});
                        break;
                    case(3):
                        break;
                    case(4):
                        break;
                    default:
                        break;
                  }
              }
        }
        
    }

    let randNum = Math.floor(Math.random() * (posibleTiles.length-0));


    if(posibleTiles.length>0){
        enemyMovement(X, Y, posibleTiles[randNum].posX, posibleTiles[randNum].posY);
    }
    console.log("Enemigo en la posicion " + X + Y + "se ha movido a la posicion " + posibleTiles[randNum].posX + posibleTiles[randNum].posY);
}

function enemyMovement(currentEnemyX, currentEnemyY, nextEnemyX, nextEnemyY){


    board[[currentEnemyX, currentEnemyY]]=2;
    board[[nextEnemyX, nextEnemyY]] = 4;
}




//Función que funciona para saber que hay en la tile a la que te vas a mover, a este le tienes que pasar la posicion por separado del jugador, asi como a la que se quiere mover
function checkTile(currentPlayerX, currentPlayerY, nextPlayerX, nextPlayerY){

    switch(board[[nextPlayerX, nextPlayerY]]){
        case(2):
            movePlayer(currentPlayerX, currentPlayerY, nextPlayerX, nextPlayerY);
            break;
        case(3):
            lettersCollected+=1;
            movePlayer(currentPlayerX, currentPlayerY, nextPlayerX, nextPlayerY);
            break;
        case(4):
            death(); //LLamamos a la funcion de muerte la cual nos mostrara como hemos terminado en terminos de letras, y nos dara la opcion de volver a jugar
            break;
        case(5):
            movePlayer(currentPlayerX, currentPlayerY, nextPlayerX, nextPlayerY);
            setTimeout(() => {
                if(levels>1){
                    levels-=1;
                    crearGrid();
                }else{
                    console.log("ganaste");
                    victory();
                }
            }, 500);
        default:
            break;
    }

}
//Lectura de las flechas

document.addEventListener("keydown", keyDownHandler, false); //Un eventListener que detecta cuando as pulsado una tecla
document.addEventListener("keyup", keyUpHandler, false); //Un eventListener que detecta cuando has dejado de pulsar una tecla

//Cuando pulsas una tecla
function keyDownHandler(keyPressed) {

    if(numColumns!=0){
        let num = searchPlayer();
        let playerX = num[0];
        let playerY = num[1];
        let validInput = false;
        switch(keyPressed.key){
            case "ArrowRight":
                if((playerY+1)>(numColumns-1))return;
                rightPressed = true;
                checkTile(playerX, playerY, playerX, playerY+1);
                validInput = true;
                break;
            case "ArrowLeft":
                if((playerY-1)<0)return;
                leftPressed = true;
                checkTile(playerX, playerY, playerX, playerY-1);
                validInput = true;
                break;
            case "ArrowUp":
                if((playerX-1)<0)return;
                upPressed = true;
                checkTile(playerX, playerY, playerX-1, playerY);
                validInput = true;
                break;
            case "ArrowDown":
                if((playerX+1)>(numColumns-1))return;
                downPressed = true;
                checkTile(playerX, playerY, playerX+1, playerY);
                validInput = true;
                break;
            default:
                break;
        }
    if(validInput) updateBoard();
    }
}


//Cuando sueltas una tecla
function keyUpHandler(keyPressed) {
    switch(keyPressed.key){
        case "ArrowRight":
            rightPressed = false;
            break;
        case "ArrowLeft":
            leftPressed = false;
            break;
        case "ArrowUp":
            upPressed = false;
            break;
        case "ArrowDown":
            downPressed = false;
            break;
        default:
            break;
    }
}


function reset(){
    location.reload();
}

function exit(){
    window.close();
}