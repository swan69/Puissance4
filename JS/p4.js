class P4 {
    constructor(selector){
        this.COL = 7;
        this.LGN = 6;
        this.selector = selector;
        this.player = 'red';

        this.drawGame();
        this.ecoute();
        this.checkWin();
    }

    //Affichage du jeu 
    drawGame(){
        const $jeu = $(this.selector);  
        //jeu égale à ce qu'ont a passé en paramètre lors de l'apelle de la class

        for(let lgn =0; lgn < this.LGN; lgn++){
          const $lgn = $('<div>').addClass('lgn');  
          for(let col = 0; col < this.COL; col ++){
              const $col = $('<div>').addClass('col empty').attr("data-col", col).attr("data-lgn", lgn);
              $lgn.append($col);
          }
          $jeu.append($lgn);
        }
    }

    ecoute(){
        const $jeu = $(this.selector);
        const that = this;
        function lastCase(col){
            const $cells = $(`.col[data-col='${col}']`);
            for(let i = $cells.length-1; i>=0; i--){
                const $cell = $($cells[i]);
                if($cell.hasClass('empty')){
                    return $cell;
                }
            }
            return null;
        }

        $jeu.on('mouseenter', '.col.empty', function(){  //jeton qui s'affiche si je passe sur une colone
            const $col = $(this).data('col');
            const $last = lastCase($col);
            if($last != null){
                $last.addClass(`p${that.player}`);
            }
        });

        $jeu.on('mouseleave', '.col', function(){    //jeton qui s'enlève si je sors de la colone
            $('.col').removeClass(`p${that.player}`);
        });

        $jeu.on('click', '.col.empty', function(){  //inserer un jeton
            const col = $(this).data('col');
            const $last = lastCase(col);
            $last.addClass(`${that.player}`).removeClass(`empty p${that.player}`).data('player', `${that.player}`);
            
            const winner = that.checkWin($last.data('lgn'), $last.data('col'));

            that.player = (that.player === 'red') ? 'yellow' : 'red';   //changement de joueur

            if(winner){
                alert(`Les ${winner} ont gagné la partie`);
                $('#restart').css('visibility', "visible");
                return;
            }
        });
    }

    checkWin(lgn, col){
        const that = this;

        function $getCell(i, j){
            return $(`.col[data-lgn='${i}'][data-col='${j}']`);
        }

        function checkDirection(direction){
            let total = 0;
            let i = lgn + direction.i;
            let j = col + direction.j;
            let $next = $getCell(i, j);
            while(i >= 0 && i < that.LGN && j >= 0 && j < that.COL && $next.data('player') === that.player){
                total++;
                i += direction.i;
                j += direction.j;
                $next = $getCell(i,j);
            }
            return total;
        }

        function checkWin(directionA, directionB){
            const total = 1 + checkDirection(directionA) + checkDirection(directionB);
            if(total>=4){
                return that.player;
            }
            else{
                return null;
            }
        }

        function checkHori(){
            return checkWin({i: 0, j: -1}, {i: 0, j: 1})
        }

        function checkVerti(){
            return checkWin({i: -1, j: 0}, {i: 1, j: 0})
        }

        function checkDiag1(){
            return checkWin({i: 1, j: 1}, {i: -1, j: -1})
        }

        function checkDiag2(){
            return checkWin({i: 1, j: -1}, {i: -1, j: 1})
        }

        return checkHori() || checkVerti() || checkDiag1() || checkDiag2();
    }


}

