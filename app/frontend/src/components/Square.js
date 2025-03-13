import {Box} from "@mui/material";
import "./Square.css"
function Square({id,children, isLabel, onClick}){
    return (
        <Box
            id={id}
            className={`square ${isLabel ? "label-square" : ""}`}
            sx={
                !isLabel
                ? {
                    cursor:"pointer",
                    "&:hover": {
                        backgroundColor: "rgba(255,255,0,0.5)"
                    }
                }
                : {}
            }
            onClick={!isLabel?()=> onClick && onClick(id):undefined}
        >
            {children}
        </Box>
    );
}
export default Square;