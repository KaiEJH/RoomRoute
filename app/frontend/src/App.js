import { Grid, Typography, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import Map from './components/Map';
import RoomList from './components/RoomList';

function App() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleClick = () => {
    alert("You clicked the button!");
  };

  const handleSquareSelect = (id) => {
    const matchedRoom = rooms.find(
      (room) => room.coordinates.toUpperCase() === id.toUpperCase()
    );
    if (matchedRoom) {
      setSelectedRoom(matchedRoom);
    }
  };

  useEffect(() => {
    fetch('/api/rooms')
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => console.error('Failed to fetch rooms:', err));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      {/* Top message and button */}
      <Typography variant="h4" gutterBottom>
        Still making this work.<br />
        Haven't used MaterialUI before so it's a learning curve.<br />
        This grid is custom so it should be the hardest part.
      </Typography>

      <Button variant="contained" onClick={handleClick}>
        Test button
      </Button>

      {/* Main layout: Map on left, Room list on right */}
      <Grid container spacing={4} sx={{ marginTop: '2rem' }}>
        <Grid item xs={8}>
          <Map
            selectedRoom={selectedRoom}
            onSquareSelect={handleSquareSelect}
          />
        </Grid>

        <Grid item xs={4}>
          <RoomList
            rooms={rooms}
            selectedRoom={selectedRoom}
            onSelectRoom={setSelectedRoom}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
