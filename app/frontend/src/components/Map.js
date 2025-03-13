import {Grid2} from '@mui/material'
import Square from './Square'
const MAP_SIZE=10;//Cant be greater than 26 due to alphabet limitation
const ALPHABET="ABCDEFGHIJKLMNOPQRSTUVWXYZ"

const handleSquareClick = (id) => {
    console.log(`Square ${id} clicked`);
  };

function Map(){
    
    let grid = [];

    for (let i=0; i<=MAP_SIZE;i++){
        let row = [];

        for (let j=0; j<=MAP_SIZE;j++){
            let isLabel=i===0||j===0;//true or false since if i or j is 0 its a label square
            let content = "";
            if(i===0 &&j===0)
                content="";//empty cell in top-left corner
            else if (i===0)//column label
                content=ALPHABET[j-1];
            else if (j===0)//row label
                content=i;

            row.push(
                <Grid2 key={`cell-${i}-${j}`} >
                    <Square id={`${ALPHABET[j-1]},${i}`} isLabel={isLabel} onClick={handleSquareClick}>
                        {content}
                    </Square>
                </Grid2>
            );

        }
        grid.push(
            <Grid2 container key={`row-${i}`} spacing={1} wrap='nowrap'>
                {row}
            </Grid2>
        );
    }
    return(
        <Grid2 container spacing={1} direction='column'>
            {grid}
        </Grid2>
    );
}
export default Map;