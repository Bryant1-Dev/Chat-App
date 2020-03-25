import React, {useState, useContext} from 'react';
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
import {Close as CloseIcon, PersonAdd as PersonAddIcon} from '@material-ui/icons'; 

import {socket} from '../../../utils/socket';

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

const InviteChatMemberModal = (props) => {
    const {chat} = props;
    const classes = styles();

    const [open, setOpen] = useState(false);

    const [loading, setLoading] = useState(false);
    const [errorList, setErrorList] = useState([]);
    const [name, setName] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setErrorList([]);
        setLoading(true);
        const errors = [];
        if(name.length === 0) {
            //handle error
            errors.push({message: `You must have enter a user's name`})
        }
        //verify name is not one of the users already in the chat
        const alreadyInChat = chat.participants.some(participant => participant.name().trim().toLowerCase === name.name().trim().toLowerCase()); 
        if(alreadyInChat) {
            //handle error
            errors.push({message: `That user is already a member of this chat`})
        }

        if(errors.length > 0) {
            setErrorList(errors);
            return;
        }

        // Note: the senderId comes from the server [req.user.id]
        // (sender's picture) ${sender} invited you to join: chat_name <- notification message
        const data = {recipientName: name, chatId: chat.id, type: 'chat-invite' };
        axios.post('/chats/invite', data).then(response => {
            setLoading(false);
            if(response.data.success) {
                console.log('Sent invitation for user!')
                const payload = response.data.payload;
                socket.emit('sendNotification', payload, () => {
                    console.log(`Emitted notification to the server`);
                });
            }

            else {
                errors.push({message: response.data.error});
                setErrorList(errors);
            }
        })
    }

    return (
        
        <div>
            <IconButton variant="outlined" color="primary" onClick={handleClickOpen}>
                <PersonAddIcon />
            </IconButton>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <div className={classes.header}>  
                    <DialogTitle id="form-dialog-title">{`Send an invitation to ${chat.name}`}</DialogTitle>
                    <IconButton variant="outlined" color="primary" onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </div>
                
                 {
                     loading ?
                        (
                            <DialogContent className={''}><DialogContentText>Inviting...</DialogContentText></DialogContent>
                        ) 
                        :
                        (
                            <>
                                <DialogContent className={''}>
                                    <DialogContentText>
                                        Enter user you want to invite
                                    </DialogContentText>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        label="Username"
                                        type="text"
                                        onChange={e => setName(e.target.value)}
                                        fullWidth
                                    />
                                </DialogContent>
                            </>
                        )

                 }   
                
                <DialogActions className={classes.footer}>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button type="submit" onClick={handleSubmit} color="primary">
                    Invite
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default InviteChatMemberModal;