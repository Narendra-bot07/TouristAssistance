import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Container } from '@mui/material';
import TourInformation from './TourInformation';
import TourPlan from './TourPlan';
import TourLocation from './TourLocation';
import TourGallery from './TourGallery';

const PackageDetailPage = () => {
  const { id } = useParams();

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Package Details
      </Typography>
      <TourInformation />
      <TourPlan />
      <TourLocation />
      <TourGallery />
    </Container>
  );
};

export default PackageDetailPage;