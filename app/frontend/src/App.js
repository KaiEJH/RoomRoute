import { Button,Typography } from '@mui/material';
import Map from './components/Map';
function App(){
  const handleClick = () =>{
    alert("You clicked the button!");
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Still making this work.<br/> Haven't used MaterialUI before so it's a learning curve.<br/>This grid is custom so it should be the hardest part.
      </Typography>
      <Button variant="contained" onClick={handleClick}>
        Test button
      </Button>
      <Map></Map>
    </div>
  );
}

export default App;