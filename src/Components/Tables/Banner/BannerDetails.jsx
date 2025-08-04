import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid
} from '@mui/material';

const BannerDetail = ({ open, onClose, data }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontSize: 22, fontWeight: 'medium', color: '#872d67' }}>
        Banner Details
      </DialogTitle>
      <DialogContent>
        {data ? (
          <Grid container spacing={2}>
            {/* Images */}
            <Grid item xs={12} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {data.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Banner ${idx + 1}`}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              ))}
            </Grid>

            {/* Banner Name */}
            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold" color="textSecondary">
                Name:
              </Typography>
              <Typography variant="body1">{data.BannerName}</Typography>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold" color="textSecondary">
                Description:
              </Typography>
              <Typography variant="body1">
                {data.description || 'No description'}
              </Typography>
            </Grid>

            {/* Position */}
            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold" color="textSecondary">
                Position:
              </Typography>
              <Typography variant="body1">
                {data.position || 'Not specified'}
              </Typography>
            </Grid>

            {/* Reference Website */}
            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold" color="textSecondary">
                Website:
              </Typography>
              <Typography variant="body1">
                {data.referenceWebsite?.name || data.referenceWebsite || 'N/A'}
              </Typography>
            </Grid>

            {/* Added By */}
            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold" color="textSecondary">
                Added By:
              </Typography>
              <Typography variant="body1">
                {data.addedBy?.name || 'Unknown'}
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <Typography variant="body1" color="textSecondary">
            No banner data available.
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BannerDetail;
