import { Typography, List, ListItem, Button, Box, TextField } from "@mui/material";
import { useState } from "react";
import "./RoomList.css"; 

function RoomList({ rooms, selectedRoom, startRoom, destinationRoom, onSelectRoom }) {
  const [search, setSearch] = useState("");

  const filteredRooms = rooms.filter((room) => {
    const term = search.toLowerCase();
    return (
      (room.name?.toLowerCase() || '').includes(term) ||
      (room.building?.toLowerCase() || '').includes(term) ||
      (room.aliases || []).some(alias => (alias?.toLowerCase() || '').includes(term))
    );
  });

  return (
    <Box>
      <TextField
        label="Search rooms"
        variant="outlined"
        size="small"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Box sx={{ maxHeight: 240, overflowY: "auto" }}>
        <List>
          {filteredRooms.map((room, index) => {
            let classes = "room-button";
            if (selectedRoom?.name === room.name) {
              classes += " selected";
            } else if (startRoom?.name === room.name) {
              classes += " start-square";
            } else if (destinationRoom?.name === room.name) {
              classes += " destination-square";
            }

            return (
              <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                <Button
                  fullWidth
                  onClick={() => onSelectRoom(room)}
                  className={classes}
                >
                  {room.name}
                </Button>
              </ListItem>
            );
          })}

          {filteredRooms.length === 0 && (
            <Typography variant="body2" sx={{ p: 1, color: "text.secondary" }}>
              No rooms found.
            </Typography>
          )}
        </List>
      </Box>

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
