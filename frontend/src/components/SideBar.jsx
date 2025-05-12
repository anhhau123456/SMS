// src/components/Sidebar.jsx
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import { Link } from 'react-router-dom';

const drawerWidth = 200;

const Sidebar = () => (
  <Drawer
    variant="permanent"
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      [`& .MuiDrawer-paper`]: {
        width: drawerWidth,
        top: '64px',
        boxSizing: 'border-box',
      },
    }}
  >
    <List>
      <ListItem button component={Link} to="/">
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button component={Link} to="/about">
        <ListItemText primary="About" />
      </ListItem>
    </List>
  </Drawer>
);

export default Sidebar;
