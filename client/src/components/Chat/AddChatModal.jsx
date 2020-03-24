import React, {useState} from 'react';
import axios from 'axios';

import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import  {Edit as EditIcon, Close as CloseIcon, AddComment as AddCommentIcon, SettingsInputAntenna} from '@material-ui/icons'; 


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

const AddChatModal = () => {
    
    const classes = styles();
    const [open, setOpen] = useState(false);

    const [loading, setLoading] = useState(false);
    const [chatName, setChatName] = useState('');
    const [chatPicture, setChatPicture] = useState(null)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleFileUpload = (event) => {
        event.preventDefault();
        setChatPicture(event.target.files[0]);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData();
        console.log(`chatPicture: ${chatPicture}`)
        if(chatPicture) formData.append('chatPicture', chatPicture, chatPicture.name);
        console.log(`chatName: ${chatName}`)
        if(chatName) formData.append('chatName', chatName);
        
        axios.post('/chats/create', formData).then(response => {
            setLoading(false);
            if(response.data.success) {
                console.log('Created a new chat!')
            }

        })
    }

    return (
        
        <div>
            <IconButton variant="outlined" color="primary" onClick={handleClickOpen}>
                <AddCommentIcon />
            </IconButton>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <div className={classes.header}>  
                    <DialogTitle id="form-dialog-title">Create A New Chat Room</DialogTitle>
                    <IconButton variant="outlined" color="primary" onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </div>
                
                 {
                     loading ?
                        (
                            <DialogContent className={''}><DialogContentText>Creating...</DialogContentText></DialogContent>
                        ) 
                        :
                        (
                            <>
                                <DialogContent className={''}>
                                    <DialogContentText>
                                        Select a name for your chat room
                                    </DialogContentText>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        label="Chat Room Name"
                                        type="text"
                                        onChange={e => setChatName(e.target.value)}
                                        fullWidth
                                    />
                                </DialogContent>
                                <DialogContent className={classes.root}>
                                    <DialogContentText>
                                        Select a profile picture for your chat room
                                    </DialogContentText>
                                    <input
                                        accept="image/*"
                                        className={classes.input}
                                        id="contained-button-file"
                                        type="file"
                                        onChange={handleFileUpload}
                                    />
                                    <label htmlFor="contained-button-file">
                                        <Button variant="contained" color="primary" component="span">
                                            Upload
                                        </Button>
                                    </label>
                                </DialogContent>
                            </>
                        )

                 }   
                
                <DialogActions className={classes.footer}>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button type="submit" onClick={handleSubmit} color="primary">
                    Create
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddChatModal;