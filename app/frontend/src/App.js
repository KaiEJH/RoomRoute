import { Typography, Button, Box, Drawer, IconButton, List, ListItem, ListItemText, FormControlLabel, Switch } from '@mui/material';
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

  const buildingCells = new Set([
    "A3", "A4", "A8", "A9", "A10", "B1", "B3", "B4", "B6", "B8", "B9", "B10",
    "C1", "C3", "C4", "C6", "C8", "C9", "C10", "D1", "D3", "D4", "D6", "D8", "D9", "D10",
    "E1", "E6", "F1", "F3", "F10", "G1", "G3", "G10", "H7", "H8", "I2", "I4", "I5", "I7", "I8", "J2", "J4", "J5", "J7", "J8"
  ]);

  const handleSquareSelect = (id) => {
    if (!buildingCells.has(id)) return; 
  
    const matchedRoom = rooms.find(
      (room) => room.coordinates.toUpperCase() === id.toUpperCase()
    );
    if (matchedRoom) {
      setSelectedRoom(matchedRoom);
    }
  };

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
          <ListItem button onClick={() => setDrawerView("favorites")}>
            <ListItemText primary="Favorites" />
          </ListItem>
          <ListItem button onClick={() => setDrawerView("settings")}>
            <ListItemText primary="Settings" />
          </ListItem>
          <ListItem button onClick={() => setDrawerView("help")}>
            <ListItemText primary="Help & Info" />
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
                    checked={accessibility.largeText}
                    onChange={() =>
                      setAccessibility(prev => ({
                        ...prev,
                        largeText: !prev.largeText
                      }))
                    }
                  />
                }
                label="Large Text"
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
