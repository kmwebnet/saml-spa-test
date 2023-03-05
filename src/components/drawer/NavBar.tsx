/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

import {
  AppBar, MenuItem, Drawer, Toolbar,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom';

const url = window.location.origin;

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => createStyles({
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginRight: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  toolbarMargin: theme.mixins.toolbar,
}));

interface ISideDrawerWrapperProps {
    show: boolean;
}

interface IProps extends ISideDrawerWrapperProps {
    drawToggleClickHandler(): void;
}

function NavBar(props: IProps) {
  const clickHandler = () => {
    props.drawToggleClickHandler();
  };

  const classes = useStyles();
  const { show } = props;

  return (
    <>
      <div>
        <Drawer
          className={classes.drawer}
          classes={{
            paper: classes.drawerPaper,
          }}
          open={show}
          onClose={() => clickHandler()}
        >
          <MenuItem onClick={() => clickHandler()}>
            <Link to="/">HOME</Link>
          </MenuItem>
          <MenuItem onClick={() => clickHandler()}>
            <Link to="/profile">PROFILE</Link>
          </MenuItem>
          <MenuItem onClick={() => window.location.replace(url + "/slogout")}>
            LOGOUT
          </MenuItem>
        </Drawer>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => clickHandler()}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className={classes.toolbarMargin} />
      </div>
    </>
  );
}

export default NavBar;
