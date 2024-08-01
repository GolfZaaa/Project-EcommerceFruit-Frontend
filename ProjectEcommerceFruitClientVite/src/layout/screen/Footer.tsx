import React from 'react'
import { Container, Typography, Box, Link } from '@mui/material';

export default function Footer() {
  return (
    <>
       <Box
    component="footer"
    sx={{
      py: 3,
      px: 2,
      mt: 'auto',
      backgroundColor: (theme) =>
        theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
    }}
  >
    <Container maxWidth="lg">
      <Typography variant="body1" align="center">
        © 2024 Kanchanaburi Rajabhat University.
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center">
        <Link href="#" color="inherit">
          Privacy Policy
        </Link>{' '}
        |{' '}
        <Link href="#" color="inherit">
          Terms of Service
        </Link>
      </Typography>
    </Container>
  </Box>
    </>
  )
}
