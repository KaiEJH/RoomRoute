import { Typography, List, ListItem, Button, Box, TextField } from "@mui/material";
import { useState } from "react";

function RoomList({ rooms, selectedRoom, onSelectRoom }) {
  const [search, setSearch] = useState("");

  const filteredRooms = rooms.filter((room) => {
    const term = search.toLowerCase();
    return (
      room.name.toLowerCase().includes(term) ||
      room.building.toLowerCase().includes(term) ||
      room.aliases.some(alias => alias.toLowerCase().includes(term))
    );
  });

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Rooms List
      </Typography>

      {/* Search Input */}
      <TextField
        label="Search rooms"
        variant="outlined"
        size="small"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* Scrollable list */}
      <Box sx={{ maxHeight: 240, overflowY: "auto" }}>
        <List>
          {filteredRooms.map((room, index) => (
            <ListItem key={index} disablePadding sx={{ mb: 1 }}>
              <Button
                variant={selectedRoom?.name === room.name ? "contained" : "outlined"}
                onClick={() => onSelectRoom(room)}
                fullWidth
                sx={{ justifyContent: "flex-start", textTransform: "none" }}
              >
                {room.name}
              </Button>
            </ListItem>
          ))}

          {filteredRooms.length === 0 && (
            <Typography variant="body2" sx={{ p: 1, color: "text.secondary" }}>
              No rooms found.
            </Typography>
          )}
        </List>
      </Box>

      {/* Selected room details */}
      {selectedRoom && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Aliases:</strong> {selectedRoom.aliases?.join(", ") || "None"}<br />
            <strong>Building:</strong> {selectedRoom.building}<br />
            <strong>Coordinates:</strong> {selectedRoom.coordinates}<br />
            <strong>Capacity:</strong> {selectedRoom.capacity}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default RoomList;
