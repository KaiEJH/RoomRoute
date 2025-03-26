import { Grid, Typography, Button, Box, Drawer, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState, useEffect } from 'react';
import Map from './components/Map';
import RoomList from './components/RoomList';
import './App.css'; 

function App() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [startRoom, setStartRoom] = useState(null);
  const [destinationRoom, setDestinationRoom] = useState(null);

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
    <div className="app-container">
      <header className="header">
        <Typography variant="h3" className="logo-text">
          ClassCoords
        </Typography>
        <IconButton
          className="menu-button"
          onClick={() => setDrawerOpen(true)}
          sx={{ position: 'absolute', right: '1rem' }}
        >
          <MenuIcon sx={{ fontSize: 32 }} />
        </IconButton>
      </header>

      <main className="map-section">
        <Box className="map-box">
        <Map
          selectedRoom={selectedRoom}
          onSquareSelect={handleSquareSelect}
          startRoom={startRoom}
          destinationRoom={destinationRoom}
        />
          <Box className="button-group">
            <Button
              variant="outlined"
              className="map-button"
              onClick={() => startRoom !== selectedRoom && setStartRoom(selectedRoom)}
            >
              Start
            </Button>
            <Button
              variant="outlined"
              className="map-button"
              onClick={() => destinationRoom !== selectedRoom && setDestinationRoom(selectedRoom)}
            >
              Destination
            </Button>
          </Box>
        </Box>
      </main>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box
          sx={{
            width: { xs: 280, sm: 320 }, // responsive drawer width
            padding: 2,
            height: "100vh",
            boxSizing: "border-box"
          }}
        >
          <Typography variant="h6" gutterBottom>
            Rooms List
          </Typography>
          <RoomList
            rooms={rooms}
            selectedRoom={selectedRoom}
            startRoom={startRoom}
            destinationRoom={destinationRoom}
            onSelectRoom={setSelectedRoom}
          />
        </Box>
      </Drawer>
    </div>
  );
}

export default App;
