import React from 'react';
import { Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';

import Backdrop from '@material-ui/core/Backdrop';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import serverUrl from '../resources/config';

export default class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            redirect: false,
            loading: true,
            user: null,
            pictures: null,
            mainMenu: false
        }

    }

    handleLogout() {
        Cookies.remove('TOKEN');

        this.props.history.push('/');
    }

    async getPictures() {
        let rawResponse = await fetch(`${serverUrl}/picture?num=10`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        let content = await rawResponse.json();
        if (content.error)
            throw Error(content.errorMessage)

        return content;
    }

    componentDidMount() {

        if (this.props.location.state == null) {
            this.setState({ loading: false, redirect: true });
            return;
        }

        this.setState({ user: this.props.location.state.user });

        this.getPictures()
            .then((content) => {
                console.log(content);
                this.setState({ pictures: content.pictures, loading: false, error: false })
            })
            .catch((error) => {
                console.error(error);
                this.setState({ loading: false, error: true });
            })
    }
    
    render() {
        if (this.state.loading)
            return (
                <Backdrop
                    open={this.state.loading}
                />
            )
        
        else if (this.state.redirect)
            return (
                <Redirect to={{
                    pathname: '/'
                }}/>
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

                <Typography variant='h5' style={{
                    marginLeft: '80px',
                    marginTop: '80px'
                }}>
                    Dashboard
                </Typography>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    marginTop: '32px'
                }}>
                    <GridList
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >

                        {
                            this.state.pictures.map((picture) => (
                                <GridListTile
                                    key={picture._id}
                                    style={{
                                        height: '400px',
                                        width: '45%',
                                        margin: '20px',
                                }}>
                                    <img src={picture.content} alt={picture.title} />
                                    <GridListTileBar
                                        title={picture.title}
                                        subtitle={<span>by: {`${this.state.user.givenName} ${this.state.user.familyName}`}</span>}
                                        
                                    />
                                </GridListTile>
                            ))
                        }
                    </GridList>
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

                    <MenuItem style={{ padding: 16 }}>
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