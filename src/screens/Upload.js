import React from 'react';
import Cookies from 'js-cookie';
import imageCompression from 'browser-image-compression';
import { Redirect } from 'react-router-dom';

import Backdrop from '@material-ui/core/Backdrop';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { ThemeProvider } from '@material-ui/styles';
import theme from '../resources/theme';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';


import serverUrl from '../resources/config';



export default class Upload extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            redirect: false,
            error: false,
            errorMessage: '',
            user: null,
            encodedImage: '',
            title: ''
        }

        this.imageInput = null;
    }

    async getUser(token) {
        let rawResponse = await fetch(`${serverUrl}/user/login?accessToken=${token}`);
        let content = await rawResponse.json();

        console.log(content);

        if (content.error)
            throw Error(content.errorMessage);

        this.setState({ user: content.profile });

        return;
    }

    handleLogout() {
        Cookies.remove('TOKEN');

        this.props.history.push('/');
    }

    imageSelectHandler = event => {

        console.log(event.target.files[0]);

        imageCompression.getDataUrlFromFile(event.target.files[0])
            .then(encodedImage => {
                this.setState({ encodedImage });
            })
            .catch((error) => console.error(error));
    }

    async validateTitle() {
        if (this.state.title == '')
            throw Error('ERR_TITLE');
    }

    async uploadPicture() {
        const { encodedImage, title } = this.state;
        const accessToken = Cookies.get('TOKEN');
        
        const body = JSON.stringify({
            picture: encodedImage,
            title: title
        });

        let rawResponse = await fetch(`${serverUrl}/picture?accessToken=${accessToken}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: body
        });
        let content = await rawResponse.json();
        console.log(content);
        if (content.error)
            throw Error(content.errorMessage)
        
        return content;
    }

    handlePictureUpload() {

        this.setState({ loading: true, error: false });

        this.validateTitle()
            .then(() => this.uploadPicture())
            .then((content) => {
                console.log(content);
                this.setState({ loading: false, redirect: true, error: false });
            })
            .catch((error) => {
                console.error(error);
                if (error.message == 'ERR_TITLE') {
                    this.setState({ loading: false, error: true, errorMessage: 'Invalid Title' });
                }
                else {
                    this.setState({ loading: false, error: true, errorMessage: 'An error occurred' });
                }
        })
    }

    componentDidMount() {

        var token = Cookies.get('TOKEN');
        if (token != null) {
            
            this.getUser(token)
                .then(() => this.setState({ loading: false, error: false, redirect: false }))
                .catch((error) => {
                    console.error(error);
                    this.setState({ error: true, loading: false, redirect: false });
            })
        }
        else {
            this.setState({ loading: false, redirect: true });
        }
        
    }

    render() {
        if (this.state.loading)
            return (
                <Backdrop open={this.state.loading}/>
            )
        
        else if (this.state.redirect) 
            return (
                <Redirect to={{
                    pathname: '/',
                }}/>
            )
        
        return (
            <ThemeProvider theme={theme}>
                <div>

                    <AppBar position="sticky" style={{ backgroundColor: 'white' }}>
                        <Toolbar style={{ paddingLeft: 80, paddingRight: 80 }}>

                            <Typography variant="h5" style={{ flex: 1, color: 'black' }}>
                                <Link color='inherit' onClick={() => this.props.history.push('/')}>
                                    ReactStock
                            </Link>
                            </Typography>

                            <Avatar
                                src={this.state.user.imageUrl}
                                variant='circle'
                                style={{ height: '40px', width: '40px' }}
                                onClick={(event) => this.setState({ mainMenu: event.currentTarget })}
                            />

                        </Toolbar>
                    </AppBar>

                    <input
                        style={{ display: 'none' }}
                        type='file'
                        onChange={this.imageSelectHandler}
                        ref={imageInput => this.imageInput = imageInput}
                    />

                    {
                        this.state.encodedImage === '' ?
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: '80px'}}>

                                <Typography variant='body1' align='center'>
                                    No picture selected
                                </Typography>

                                <Button
                                    variant='contained'
                                    style={{
                                        textTransform: 'none',
                                        margin: '16px',
                                        fontSize: '20px',
                                        borderRadius: '20px'
                                    }}
                                    color='primary'
                                    onClick={() => this.imageInput.click()}>
                                    Select Image
                                </Button>

                            </div>

                            :

                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: '40px'}}>

                                <img
                                    src={this.state.encodedImage}
                                    style={{
                                        objectFit: 'cover',
                                        width: '80%',
                                        height: 'auto',
                                        boxShadow: '0px 6px 6px 6px rgb(0,0,0,0.4)',
                                        borderRadius: '16px'
                                    }}/>

                                <TextField
                                    id="standard-basic"
                                    label="A Catchy Title"
                                    size='medium'
                                    inputProps={{
                                        style: {
                                            fontSize: '28px'
                                        }
                                    }}
                                    style={{
                                        marginTop: '24px',
                                        marginBottom: '8px'
                                    }}
                                    onChange={(event) => this.setState({ title: event.target.value })}
                                />

                                <Button
                                    variant='contained'
                                    style={{
                                        marginTop: '4px',
                                        marginBottom: '32px',
                                        fontSize: '24px',
                                        textTransform: 'none',
                                        borderRadius: '32px',
                                        paddingLeft: '40px',
                                        paddingRight: '40px'
                                    }}
                                    color='primary'
                                    onClick={() => this.handlePictureUpload()}>
                                    Upload
                                </Button>

                                <Button
                                    variant='contained'
                                    style={{
                                        marginTop: '8px',
                                        marginBottom: '32px',
                                        textTransform: 'none',
                                        borderRadius: '20px'
                                    }}
                                    color='secondary'
                                    onClick={() => this.imageInput.click()}>
                                    Change Picture
                                </Button>
                                
                            </div>
                    }

                    <Menu
                        id='main-menu'
                        anchorEl={this.state.mainMenu}
                        keepMounted
                        open={Boolean(this.state.mainMenu)}
                        onClose={() => this.setState({ mainMenu: false })}>

                        <MenuItem>
                            <Grid container direction='row' spacing={4}>
                                <Grid item container justify='center' alignItems='center'>
                                    <Avatar
                                        src={this.state.user.imageUrl}
                                        variant='circle'
                                        style={{ height: '64px', width: '64px' }} />
                                </Grid>

                                <Grid container item justify='center' alignItems='center'>
                                    <Typography variant='body1' align='center' style={{ fontSize: 24 }}>
                                        {`${this.state.user.givenName} ${this.state.user.familyName}`}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </MenuItem>

                        <MenuItem
                            onClick={() => this.props.history.push('/upload')}
                            style={{ padding: 16, backgroundColor: '#af0404' }} >
                            <Typography variant='body1' align='center' style={{ color: 'white' }}>
                                New Picture
                            </Typography>
                        </MenuItem>

                        <MenuItem onClick={() => this.props.history.push('/dashboard')} style={{ padding: 16 }}>
                            <Typography variant='body1' align='center'>
                                Dashboard
                        </Typography>
                        </MenuItem>

                        <MenuItem onClick={() => this.props.history.push('/profile')} style={{ padding: 16 }}>
                            <Typography variant='body1' align='center'>
                                Profile
                        </Typography>
                        </MenuItem>

                        <MenuItem onClick={() => this.handleLogout()} style={{ padding: 16 }}>
                            <Typography variant='body1' align='center'>
                                Sign Out
                        </Typography>
                        </MenuItem>
                    </Menu>

                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        open={this.state.error}
                        autoHideDuration={4000}
                        onClose={() => this.setState({ error: false})}
                        message={this.state.errorMessage}
                        action={
                            <React.Fragment>
                                <IconButton size="small" aria-label="close" onClick={() => this.setState({ error: false})}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </React.Fragment>
                        }
                    />
                </div>
            </ThemeProvider>
    
        )
    }
}