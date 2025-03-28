import { Typography, Button, Box, Drawer, IconButton, TextField } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState, useEffect } from 'react';
import Map from './components/Map';
import RoomList from './components/RoomList';
import './App.css';

const DBPORT = process.env.REACT_APP_DBPORT;

function App() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [startRoom, setStartRoom] = useState(null);
  const [destinationRoom, setDestinationRoom] = useState(null);

  // New state for the form inputs
  const [newRoom, setNewRoom] = useState({
    name: '',
    aliases: '',
    capacity: '',
    buildingName: '',
  });

  const buildingCells = new Set([
    "A3", "A4", "A8", "A9", "A10", "B1", "B3", "B4", "B6", "B8", "B9", "B10", "C1", "C3", "C4", "C6", "C8", "C9", "C10",
    "D1", "D3", "D4", "D6", "D8", "D9", "D10", "E1", "E6", "F1", "F3", "F10", "G1", "G3", "G10",
    "H7", 'H8', "I2", "I4", "I5", "I7", "I8", "J2", "J3", "J4", "J7", "J8"
  ]);

  const handleSquareSelect = (id) => {
    const matchedRoom = rooms.find(
      (room) => room.coordinates.toUpperCase() === id.toUpperCase()
    );
    if (matchedRoom) {
      setSelectedRoom(matchedRoom);
    }
  };

  // Fetch rooms from the backend
  useEffect(() => {
    fetch(`http://localhost:${DBPORT}/api/rooms`)
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => console.error('Failed to fetch rooms:', err));
  }, []);

  // Handle input changes for the new room form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom((prevRoom) => ({
      ...prevRoom,
      [name]: value,
    }));
  };

  // Submit the new room to the server
  const handleAddRoom = () => {
    fetch(`http://localhost:${DBPORT}/api/rooms/add-room`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...newRoom,
        aliases: newRoom.aliases.split(',').map((alias) => alias.trim()), // Split aliases by comma
        capacity: parseInt(newRoom.capacity, 10), // Convert capacity to a number
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert('Room added successfully!');
        setRooms((prevRooms) => [...prevRooms, data]); // Update the local rooms list
        setNewRoom({ name: '', aliases: '', capacity: '', buildingName: '' }); // Reset the form
      })
      .catch((err) => {
        console.error('Failed to add room:', err);
        alert('Failed to add room.');
      });
  };

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
            {/* Existing buttons for Start and Destination */}
            <Button
              variant="outlined"
              className="map-button"
              onClick={() => {
                if (!selectedRoom) return;
                const coord = selectedRoom.coordinates.toUpperCase();
                if (!buildingCells.has(coord)) {
                  alert("Only building cells can be set as Start.");
                  return;
                }

                // Handle collision with destination
                if (destinationRoom?.coordinates.toUpperCase() === coord) {
                  const confirmSwitch = window.confirm("This cell is already set as Destination. Switch it to Start?");
                  if (confirmSwitch) {
                    setDestinationRoom(null);
                    setStartRoom(selectedRoom);
                  }
                } else {
                  setStartRoom(selectedRoom);
                }
              }}
            >
              Start
            </Button>
            <Button
              variant="outlined"
              className="map-button"
              onClick={() => {
                if (!selectedRoom) return;
                const coord = selectedRoom.coordinates.toUpperCase();
                if (!buildingCells.has(coord)) {
                  alert("Only building cells can be set as Destination.");
                  return;
                }

                // Handle collision with start
                if (startRoom?.coordinates.toUpperCase() === coord) {
                  const confirmSwitch = window.confirm("This cell is already set as Start. Switch it to Destination?");
                  if (confirmSwitch) {
                    setStartRoom(null);
                    setDestinationRoom(selectedRoom);
                  }
                } else {
                  setDestinationRoom(selectedRoom);
                }
              }}
            >
              Destination
            </Button>
          </Box>
        </Box>

        {/* Add Room Form */}
        <Box className="add-room-form" sx={{ margin: 2 }}>
          <Typography variant="h6">Add a New Room</Typography>
          <TextField
            label="Name"
            name="name"
            value={newRoom.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Aliases (comma-separated)"
            name="aliases"
            value={newRoom.aliases}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Capacity"
            name="capacity"
            value={newRoom.capacity}
            onChange={handleInputChange}
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Building Name"
            name="buildingName"
            value={newRoom.buildingName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            onClick={handleAddRoom}
            sx={{ marginTop: 2 }}
          >
            Add Room
          </Button>
        </Box>
      </main>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box
          sx={{
            width: { xs: 280, sm: 320 },
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