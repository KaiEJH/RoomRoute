import { Typography, Button, Box, Drawer, IconButton, List, ListItem, ListItemText, FormControlLabel, Switch, TextField } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState, useEffect } from 'react';
import Map from './components/Map';
import RoomList from './components/RoomList';
import './App.css';
import { coordToIndex } from './components/startDestination';


const DBPORT = process.env.REACT_APP_DBPORT;

function App() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [startRoom, setStartRoom] = useState(null);
  const [destinationRoom, setDestinationRoom] = useState(null);
  const [path, setPath] = useState([]);
  const [drawerView, setDrawerView] = useState("menu");
  const [menuOption, setMenuOption] = useState('rooms');
  const [accessibility, setAccessibility] = useState({
    highContrast: false,
    largeText: false
  });

  // New state for the form inputs
  const [newRoom, setNewRoom] = useState({
    name: '',
    aliases: '',
    capacity: '',
    buildingName: '',
  });

  const buildingCells = new Set([
    "A3", "A4", "A8", "A9", "A10", "B1", "B3", "B4", "B6", "B8", "B9", "B10",
    "C1", "C3", "C4", "C6", "C8", "C9", "C10", "D1", "D3", "D4", "D6", "D8", "D9", "D10",
    "E1", "E6", "F1", "F3", "F10", "G1", "G3", "G10", "H7", "H8", "I2", "I4", "I5", "I7", "I8", "J2", "J4", "J5", "J7", "J8"
  ]);

  const buildingOptions = [
    "Teaching Complex 1",
    "Faculty of Social Sciences",
    "Teaching Complex 2",
    "Campus IT Services",
    "Faculty of Law",
    "Administration Building",
    "Faculty of Medicine",
    "Faculty of Science and Technology",
    "Faculty of Humanities"
  ];

  const handleSquareSelect = (id) => {
    if (!buildingCells.has(id)) return; 
  
    const matchedRoom = rooms.find(
      (room) => room.coordinates && room.coordinates.toUpperCase() === id.toUpperCase()
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

  useEffect(() => {
    if (!startRoom || !destinationRoom) return;
  
    const startCoord = startRoom.coordinates.toUpperCase();
    const destCoord = destinationRoom.coordinates.toUpperCase();
  
    fetch(`http://localhost:${DBPORT}/api/path`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ start: startCoord, end: destCoord }),
    })
      .then(res => res.json())
      .then(data => {
        console.log('Path result:', data.route);
        if (!data || !data.route || data.route.length === 0) {
          alert("No path found.");
          setPath([]);
          return;
        }
  
        // Convert path to cell IDs (e.g. "B1")
        const pathAsCellIds = data.route.map(([col, row]) => {
          return `${String.fromCharCode(65 + col)}${row + 1}`;
        });
  
        setPath(pathAsCellIds);
      })
      .catch(err => console.error('Error:', err));
  }, [startRoom, destinationRoom]);

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
    <div className={`app-container ${accessibility.highContrast ? 'high-contrast' : ''} ${accessibility.largeText ? 'large-text' : ''}`}>
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
        <div className="map-grid">
          <div className="map-grid">
            <Map
              selectedRoom={selectedRoom}
              onSquareSelect={handleSquareSelect}
              startRoom={startRoom}
              destinationRoom={destinationRoom}
              path={path}
            />
          </div>
        </div>
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
        {/*<Box className="add-room-form" sx={{ margin: 2 }}>
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
        </Box>*/}
      </main>

      <Drawer
  anchor="right"
  open={drawerOpen}
  onClose={() => {
    setDrawerOpen(false);
    setDrawerView("menu");
  }}
>
  <Box sx={{ width: 280, p: 2 }}>
    {drawerView === "menu" && (
      <>
        <Typography variant="h6" gutterBottom>Menu</Typography>
        <List>
          <ListItem button onClick={() => setDrawerView("rooms")}>
            <ListItemText primary="Rooms List" />
          </ListItem>
          <ListItem button onClick={() => setDrawerView("addrooms")}>
            <ListItemText primary="Add Rooms" />
          </ListItem>
          <ListItem button onClick={() => setDrawerView("favorites")}>
            <ListItemText primary="Favorites" />
          </ListItem>
          <ListItem button onClick={() => setDrawerView("settings")}>
            <ListItemText primary="Settings" />
          </ListItem>
          <ListItem button onClick={() => setDrawerView("help")}>
            <ListItemText primary="Help & Info" />
          </ListItem>
          <ListItem button onClick={() => setDrawerView("genReport")}>
            <ListItemText primary="Generate Report" />
          </ListItem>
        </List>
      </>
    )}

    {drawerView === "rooms" && (
      <>
        <Typography variant="h6" gutterBottom>Rooms List</Typography>
        <RoomList
            rooms={rooms}
            selectedRoom={selectedRoom}
            startRoom={startRoom}
            destinationRoom={destinationRoom}
            onSelectRoom={setSelectedRoom}
          />
        <Button fullWidth onClick={() => setDrawerView("menu")} sx={{ mt: 2 }}>← Back to Menu</Button>
      </>
    )}

    {drawerView === "addrooms" && (
          <>
            <Typography variant="h6" gutterBottom>Add Rooms</Typography>
            <Box className="add-room-form" sx={{ margin: 2 }}>
          <Typography variant="h6">Add a New Room</Typography>
          <TextField
            select
            label="Room Cell"
            name="roomCell"
            value={newRoom.coordinates}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          >
            {[...buildingCells].map((cell) => (
              <ListItem key={cell} value={cell}>
                {cell}
              </ListItem>
            ))}
          </TextField>
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
            select
            label="Building Name"
            name="buildingName"
            value={newRoom.building}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          >
            {buildingOptions.map((option) => (
              <ListItem key={option} value={option}>
                {option}
              </ListItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            onClick={handleAddRoom}
            sx={{ marginTop: 2 }}
          >
            Add Room
          </Button>
        </Box>
            <Button fullWidth onClick={() => setDrawerView("menu")} sx={{ mt: 2 }}>← Back to Menu</Button>
          </>
        )}

    {drawerView === "favorites" && (
      <>
        <Typography variant="h6">Favorites</Typography>
        <Typography variant="body2" color="text.secondary">Feature coming soon...</Typography>
        <Button fullWidth onClick={() => setDrawerView("menu")} sx={{ mt: 2 }}>← Back to Menu</Button>
      </>
    )}

    {drawerView === "settings" && (
      <>
        <Typography variant="h6">Settings</Typography>
            <Box>
              <Typography variant="h6">Accessibility</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={accessibility.highContrast}
                    onChange={() =>
                      setAccessibility(prev => ({
                        ...prev,
                        highContrast: !prev.highContrast
                      }))
                    }
                  />
                }
                label="High Contrast Mode"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={accessibility.toggleMap}
                    onChange={() =>
                      setAccessibility(prev => ({
                        ...prev,
                        toggleMap: !prev.toggleMap
                      }))
                    }
                  />
                }
                label="Toggle Map"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={accessibility.toggleRoute}
                    onChange={() =>
                      setAccessibility(prev => ({
                        ...prev,
                        toggleRoute: !prev.toggleRoute
                      }))
                    }
                  />
                }
                label="Toggle Route"
              />
            </Box>
        <Typography variant="body2" color="text.secondary">More configuration options coming soon.</Typography>
        <Button fullWidth onClick={() => setDrawerView("menu")} sx={{ mt: 2 }}>← Back to Menu</Button>
      </>
    )}

    {drawerView === "help" && (
      <>
        <Typography variant="h6">Help & Info</Typography>
        <Typography variant="body2">Need help? This area will include quick tips.</Typography>
        <Button fullWidth onClick={() => setDrawerView("menu")} sx={{ mt: 2 }}>← Back to Menu</Button>
      </>
    )}
  </Box>
</Drawer>
    </div>
  );
}

export default App;