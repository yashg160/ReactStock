import React from 'react';
import Cookies from 'js-cookie';
import { Redirect } from 'react-router-dom';


import Backdrop from '@material-ui/core/Backdrop';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import serverUrl from '../resources/config';


export default class Profile extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            error: false,
            user: null,
            pictures: null,
            mainMenu: null
        }
    }

    handleLogout() {
        Cookies.remove('TOKEN');

        this.props.history.push('/');
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

    async getPicturesForUser(token) {
        
        let rawResponse = await fetch(`${serverUrl}/user/pictures?accessToken=${token}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        let content = await rawResponse.json();
        console.log(content);
        if (content.error)
            throw Error(content.errorMessage);
        
        return content;
    }

    componentDidMount() {

        var token = Cookies.get('TOKEN');
        if (token != null) {

            this.getUser(token)
                .then(() => this.getPicturesForUser(token))
                .then((content) => this.setState({ pictures: content.pictures, loading: false, error: false }))
                .catch((error) => {
                    console.error(error);
                    this.setState({ loading: false, error: true });
                });
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
                    pathname: '/'
                }} />
            )
        
        return (
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

                <div style={{
                    marginTop: 80,
                    marginLeft: 280,
                    marginRight: 280,
                    marginBottom: 40,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>

                    <Grid container direction='row' spacing={10}>
                        <Grid
                            item
                            container
                            xs={6}
                            direction='row'
                            alignItems='center'
                            justify='flex-end'>

                            <Avatar
                                src={this.state.user.imageUrl}
                                variant='circle'
                                style={{ height: '160px', width: '160px' }}
                            />

                        </Grid>

                        <Grid
                            item
                            container
                            xs={6}
                            direction='row'
                            alignItems='center'
                            justify='flex-start'
                        >

                            <Typography
                                variant='h5'
                                align='center'
                                style={{
                                    color: 'black'
                                }}
                            >
                                {`${this.state.user.givenName} ${this.state.user.familyName}`}
                            </Typography>    

                        </Grid>
                    </Grid>

                </div>

                <div style={{
                    marginTop: 40,
                    marginLeft: 80,
                    marginRight: 80,
                    marginBottom: 40,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'}}>
                    <Typography variant='h5' align='center'>
                        Pictures
                    </Typography>

                    {
                        this.state.pictures.length == 0 ? 
                            <div>

                                <Typography variant='h5' align='center' style={{
                                    marginTop: '40px'
                                }}>
                                    Gallery
                                </Typography>

                                <Typography variant='body1' align='center' style={{
                                    marginTop: '40px'
                                }}>
                                    No picture uploaded
                                </Typography>
                                
                                <Button
                                    variant='contained'
                                    onClick={() => this.props.history.push({
                                        pathname: '/upload',
                                        state: {user: this.state.user}
                                    })}
                                >
                                    Upload Now
                                </Button>
                            </div>
                            
                            :
                            <div>

                                <Typography variant='h5' align='center' style={{
                                    marginTop: '40px'
                                }}>
                                    Gallery
                                </Typography>

                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'space-around',
                                    overflow: 'hidden'
                                }}>
                                    <GridList
                                        cellHeight={300}
                                        style={{
                                            width: '75%',
                                            height: '100%'
                                        }}
                                    >

                                        {
                                            this.state.pictures.map((picture) => (
                                                <GridListTile key={picture.id}>
                                                    <img src={picture.content} alt={picture.title} />
                                                    <GridListTileBar
                                                        title={picture.title}
                                                        subtitle={<span>by: {`${this.state.user.givenName} ${this.state.user.familyName}`}</span>}
                                                        actionIcon={
                                                            <IconButton aria-label={`info about ${picture.title}`} >
                                                                <InfoIcon />
                                                            </IconButton>
                                                        }
                                                    />
                                                </GridListTile>
                                            ))
                                        }
                                    </GridList>
                                </div>
                

                            </div>
                    }

                </div>

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

                    <MenuItem onClick={() => this.props.history.push('/upload')} style={{ padding: 16 }}>
                        <Typography variant='body1' align='center'>
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

            </div>
        )
    }
}