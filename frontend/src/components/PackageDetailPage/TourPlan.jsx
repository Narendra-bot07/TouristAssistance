import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const TourPlan = () => {
  const itinerary = [
    { day: 1, description: 'Arrival and welcome dinner' },
    { day: 2, description: 'Explore Ubud and visit temples' },
    { day: 3, description: 'Day trip to Nusa Penida' },
    { day: 4, description: 'Relax at Seminyak Beach' },
    { day: 5, description: 'Snorkeling at Gili Islands' },
    { day: 6, description: 'Shopping and cultural tour' },
    { day: 7, description: 'Departure' },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tour Plan
      </Typography>
      <List>
        {itinerary.map((item, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`Day ${item.day}`}
              secondary={item.description}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TourPlan;