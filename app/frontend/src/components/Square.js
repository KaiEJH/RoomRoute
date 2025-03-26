import {Box} from "@mui/material";
import "./Square.css"
function Square({ id, children, isLabel, onClick, className }) {
    return (
      <Box
        id={id}
        className={className}
        sx={
          !isLabel
            ? {
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(255,255,0,0.5)",
                },
              }
            : {}
        }
        onClick={!isLabel ? () => onClick && onClick(id) : undefined}
      >
        {children}
      </Box>
    );
  }
export default Square;