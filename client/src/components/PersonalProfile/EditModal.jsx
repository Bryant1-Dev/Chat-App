import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import  {Edit as EditIcon, Close as CloseIcon} from '@material-ui/icons'; 

const styles = makeStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    }   ,
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 0,
    },
    input: {
        display: 'none'
    },
    footer: {
        margin: 0,
        padding: theme.spacing(1),
    }
  }));

const EditModal = () => {
    
    const classes = styles();
    const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton variant="outlined" color="primary" onClick={handleClickOpen}>
        <EditIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <div className={classes.header}>  
        <DialogTitle id="form-dialog-title">Edit Profile</DialogTitle>
        <IconButton variant="outlined" color="primary" onClick={handleClose}>
            <CloseIcon />
      </IconButton>
      </div>
        <DialogContent className={''}>
          <DialogContentText>
            Select a new username
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="New Username"
            type="text"
            fullWidth
          />
          <TextField
            margin="dense"
            id="name"
            label="Confirm Username"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogContent className={classes.root}>
            <DialogContentText>
                Select a new profile picture
            </DialogContentText>
            <input
                accept="image/*"
                className={classes.input}
                id="contained-button-file"
                type="file"
            />
            <label htmlFor="contained-button-file">
                <Button variant="contained" color="primary" component="span">
                    Upload
                </Button>
            </label>
        </DialogContent>
        <DialogActions className={classes.footer}>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EditModal;