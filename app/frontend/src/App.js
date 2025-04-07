import { Typography, Button, Box, Drawer, IconButton, List, ListItem, ListItemText, FormControlLabel, Switch, TextField, MenuItem,Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Optional for the expand icon
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
    toggleMap: false,
    toggleRoute: false,
  });

  
const [message, setMessage] = useState(""); // Message content
const [messageType, setMessageType] = useState(""); // "success" or "error"

  // New state for the form inputs
  const [newRoom, setNewRoom] = useState({
    coordinates: '',
    name: '',
    aliases: '',
    capacity: '',
    building: '',
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

  const coordinateMapping = {
    "Teaching Complex 1": ["A3", "A4", "B3", "B4", "C3", "C4", "D3", "D4" ],
    "Teaching Complex 2": ["B1", "C1", "D1", "E1", "F1", "G1"],
    "Faculty of Science and Technology": ["A8", "A9", "A10", "B8", "B9", "B10", "C8", "C9", "C10", "D8", "D9", "D10"],
    "Campus IT Services": ["F3", "G3"],
    "Faculty of Law": ["I2", "J2"],
    "Administration Building": ["I4", "I5", "J4", "J5"],
    "Faculty of Medicine": ["B6", "C6", "D6", "E6"],
    "Faculty of Social Sciences": ["H7", "H8", "I7", "I8", "J7", "J8"],
    "Faculty of Humanities": ["F10", "G10"]
    
  };

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
    if (!newRoom.name || !newRoom.capacity || !newRoom.buildingName || !newRoom.coordinates) {
        alert("Required fields are missing.");
        return;
    }

    fetch(`http://localhost:${DBPORT}/api/rooms/add-room`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...newRoom,
            aliases: newRoom.aliases.split(',').map(alias => alias.trim()),
            capacity: parseInt(newRoom.capacity, 10),
        }),
    })
        .then(async (res) => {
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error); // Capture specific error messages from the server
            }
            return res.json();
        })
        .then((data) => {
            alert("Room added successfully!");
            setRooms((prevRooms) => [...prevRooms, data]);
            setNewRoom({ name: '', aliases: '', capacity: '', buildingName: '', coordinates: '' });
        })
        .catch((err) => {
            alert(`Error: ${err.message}`); // Show errors as alerts
        });
};

  return (
    <div
  className={`app-container 
    ${accessibility.highContrast ? 'high-contrast' : ''} 
    ${accessibility.toggleMap ? 'hide-map' : ''} 
    ${accessibility.toggleRoute ? 'hide-route' : ''}`}
>
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
          <Typography  className="route-display" variant="body2"
    mt={2}
    textAlign="center"
    sx={{ wordBreak: 'break-word' }}>Route: {path.length > 0 ? path.join(' → ') : 'No path found'}</Typography>
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
            value={newRoom.buildingName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          >
            {buildingOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Coordinates"
            name="coordinates"
            value={newRoom.coordinates}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          >
              {(() => {
    // Filter coordinates based on selected building name
    const availableCells = coordinateMapping[newRoom.buildingName] || []; // Default to an empty array if no building is selected


    return availableCells.map((cell) => (
      <MenuItem key={cell} value={cell}>
        {cell} 
      </MenuItem>
    ));
  })()}

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

        <Accordion sx={{ mb: 1 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="menu-content"
        id="menu-header"
      >
        <Typography variant="h6" >How do you select a Start Destination?</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2">
        Click on a building cell on the map then click the start button.
        </Typography>
      </AccordionDetails>
    </Accordion>

    <Accordion sx={{ mb: 1 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="menu-content"
        id="menu-header"
      >
        <Typography variant="h6">How do you select an End Destination?</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2">
        Click on a building cell on the map then click the Destination button.
        </Typography>
      </AccordionDetails>
    </Accordion>

    <Accordion sx={{ mb: 1 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="menu-content"
        id="menu-header"
      >
        <Typography variant="h6">What does "Room List" do in the Menu?</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2">
        When a user selects a specific room its details are displayed Below the list of existing rooms meeting the search criteria. This provides comprehensive information pulled directly from the database regarding the selected room's record. 

        </Typography>
      </AccordionDetails>
    </Accordion>


    <Accordion sx={{ mb: 1 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="menu-content"
        id="menu-header"
      >
        <Typography variant="h6">What does "Add Rooms" do in the Menu?</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2">
        This feature allows users to register unlisted rooms into the database, associating them with the correct buildings and ensuring proper navigation and informational access. It is designed to maintain the integrity of data, prevent duplication, and provide comprehensive details about the room once it is successfully added to the database. 
        </Typography>
      </AccordionDetails>
    </Accordion>



    <Accordion sx={{ mb: 1 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="menu-content"
        id="menu-header"
      >
        <Typography variant="h6">What does "Favorites" do in the Menu?</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2">
        Users will have the access to save routes that they have navigated. This will allow them to reuse these routes quickly without having to manually enter them.
        </Typography>
      </AccordionDetails>
    </Accordion>

    <Accordion sx={{ mb: 1 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="menu-content"
        id="menu-header"
      >
        <Typography variant="h6">What does "Generate Report" do in the Menu?</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2">
        After planning or navigating different routes, users can generate a report of all rooms they travelled to and from. The route report will be displayed on screen
        </Typography>
      </AccordionDetails>
    </Accordion>


    <Accordion sx={{ mb: 1 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="menu-content"
        id="menu-header"
      >
        <Typography variant="h6">What does "High Contrast Mode" do in the Settings?</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2">
        High Contrast Mode: an accessibility feature that reduces and simplifies the colours of the UI elements to implement the use of a dark black background with white text for maximum contrast against the background to enhance readability for users with visual impairments. 
        </Typography>
      </AccordionDetails>
    </Accordion>

    <Accordion sx={{ mb: 1 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="menu-content"
        id="menu-header"
      >
        <Typography variant="h6">What does "Toggle Map" do in the Settings?</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2">
        An accessibility feature to allow for the map to be disabled on the home screen. This is expected to be especially useful for those with difficulty seeing, since the map feature may be more of a burden for them
        </Typography>
      </AccordionDetails>
    </Accordion>

    <Accordion sx={{ mb: 1 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="menu-content"
        id="menu-header"
      >
        <Typography variant="h6">What does "Toggle Route" do in the Settings?</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2">
        An accessibility feature to allow for the printed route sequence to be disabled on the home screen. This is expected to be useful for those with no difficulty seeing, since the route sequence has little use
        </Typography>
      </AccordionDetails>
    </Accordion>

        <Button fullWidth onClick={() => setDrawerView("menu")} sx={{ mt: 2 }}>← Back to Menu</Button>
      </>
    )}
  </Box>
</Drawer>
    </div>
  );
}

export default App;