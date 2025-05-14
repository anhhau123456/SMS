import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth0 } from '@auth0/auth0-react';

import './App.css'
import Home from './pages/Home';
import Import from './pages/Import';
import LoadingOverlay from './components/LoadingOverlay';

function App() {
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    isLoading,
    error
  } = useAuth0();
  const [open, setOpen] = useState(false);
  const drawerWidth = 240;

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) return (
    	<LoadingOverlay open={true}/>
  );

  return (
    <div className="flex h-screen">
        <div className="flex-1 flex flex-col">
          <AppBar position="static" className="z-10">
            <Toolbar className="justify-between">
              {
                !isAuthenticated ? ( <div></div> ) : (
                  <IconButton
                    color="inherit"
                    edge="start"
                    onClick={() => setOpen(!open)}
                    sx={{ mr: 2 }}
                  >
                    <MenuIcon />
                  </IconButton>
                )
              }
              <Typography>
                Phone SMS
              </Typography>
              {!isAuthenticated ? (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#746bca',
                    '&:hover': {
                      backgroundColor: '#272168',
                    },
                  }}
                  className="ml-auto px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={() => loginWithRedirect()}>
                    Log In
                </Button>
              ) : (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#746bca',
                    '&:hover': {
                      backgroundColor: '#272168', // darker shade on hover
                    },
                  }}
                  className="ml-auto px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={() => logout()}>
                    Log Out
                </Button>
              )}
            </Toolbar>
          </AppBar>
          {
            !isAuthenticated ? (
              <div></div>
            ) : (
              <div className="flex flex-1">
                {/* Drawer inside the page */}
                <Drawer
                  variant="temporary"
                  anchor="left"
                  open={open}
                  onClose={() => setOpen(false)}
                  sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                      width: drawerWidth,
                      boxSizing: 'border-box',
                    },
                  }}
                >
                  <List>
                    <ListItem button onClick={() => setOpen(false)} component={Link} to="/">
                      <ListItemText primary="Home" />
                    </ListItem>
                    <ListItem button onClick={() => setOpen(false)} component={Link} to="/">
                      <ListItemText primary="History" />
                    </ListItem>
                    <ListItem button onClick={() => setOpen(false)} component={Link} to="/import">
                      <ListItemText primary="Import" />
                    </ListItem>
                  </List>
                </Drawer>

                {/* Main Content Area */}
                <main className="flex-1 bg-gray-100 p-6">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/import" element={<Import />} />
                  </Routes>
                </main>
              </div>
            )}
        </div>
    </div>
  )
}

export default App
