import React from 'react';
import Cookies from 'js-cookie';
import { Redirect } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FacebookIcon from '@material-ui/icons/Facebook';
import Backdrop from '@material-ui/core/Backdrop';

import { GoogleLogin } from 'react-google-login';

import backgroundImage from '../resources/home-background.png';
import serverUrl from '../resources/config';


export default class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            error: false,
            redirect: false,
            user: null,
            userCreated: false
        }
    }

    async attemptLogin(token) {
        console.log(token);

        let rawResponse = await fetch(`${serverUrl}/user/login?accessToken=${token}`);

        let content = rawResponse = await rawResponse.json();
        console.log(content);
        if (content.error) {
            throw Error(content.statusMessage);
        }

        return content;
    }

    async loginUser(response) {
        var profile = response.profileObj;
        var accessToken = response.tokenObj.access_token;

        const body = JSON.stringify({
            googleId: profile.googleId,
            name: {
                given: profile.givenName,
                family: profile.familyName
            },
            imageUrl: profile.imageUrl,
            email: profile.email,
            accessToken: accessToken
        });

        let rawResponse = await fetch(`${serverUrl}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: body,
        });

        let content = await rawResponse.json();

        if (content.error) {
            throw Error(content.statusMessage);
        }

        Cookies.set('TOKEN', content.accessToken);
        this.setState({ userCreated: content.userCreated });

        return content.accessToken;
    }

    handleLoginSuccess(response) {
        console.log(response);
        this.setState({ loading: true });

        this.loginUser(response)
            .then((token) => this.attemptLogin(token))
            .then((content) => {
                console.log(content);
                this.setState({ redirect: true, loading: false, user: content.profile})
            })
            .catch((error) => {
                console.error(error);
                this.setState({ redirect: false, error: true, loading: false });
        })
    }

    handleLoginFailure(response) {
        console.log(response);
    }

    componentDidMount() {
        
        const token = Cookies.get('TOKEN');

        this.attemptLogin(token)
            .then((content) => {
                if (content.error) 
                    throw Error(content.errorMessage);
                else
                    this.setState({ redirect: true, user: content.profile });
            })
            .catch((error) => {
                console.error(error);
                this.setState({ error: true, loading: false, redirect: false });
            });
    }


    render() {
        console.log(this.state);
        if (this.state.loading)
            return (
                <Backdrop/>
            )
        
        else if (this.state.redirect && this.state.userCreated) 
            return (
                <Redirect to={{
                    pathname: '/profile',
                    state:{user: this.state.user}
                }}
                />
            )
            
        else if (this.state.redirect && !this.state.userCreated) 
            return (
                <Redirect to={{
                    pathname: '/dashboard',
                    state:{user: this.state.user}
                }}
                />
            )

        return (
            <div style={{
                backgroundImage: `url(${backgroundImage})`,
                height:'100vh',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap'
            }}>

                <Typography
                    variant='h1'
                    align='center'
                    style={{
                        color: 'white',
                        marginBottom: '16px'
                    }}
                >
                    ReactStock
                </Typography>

                <Typography
                    variant='body1'
                    align='center'
                    style={{
                        color: 'white',
                        marginTop: '8px',
                        fontSize: 'large'
                    }}
                >
                    Share the world around you. Through images.
                </Typography>
                <Typography
                    variant='body1'
                    align='center'
                    style={{
                        color: 'white',
                        fontSize: 'large'
                    }}
                >
                    Create pictures. Create memories.
                </Typography>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    marginTop: '28px'
                }}>

                    <GoogleLogin
                        clientId="695377450188-hjltbu0rri4vfneiugb9fh21p6i8b2gm.apps.googleusercontent.com"
                        render={renderProps => (
                            <Button
                                variant='contained'
                                style={{
                                    textTransform: 'none',
                                    padding: '12px',
                                    paddingLeft: '32px',
                                    paddingRight: '32px',
                                    borderRadius: '32px',
                                    marginBottom: '4px'
                                }}
                                onClick={renderProps.onClick}
                            >
                                <Typography
                                    variant='body1'
                                >
                                    Continue with Google
                                </Typography>
                            </Button>
                        )}
                        buttonText="Login"
                        onSuccess={response => this.handleLoginSuccess(response)}
                        onFailure={response => this.handleLoginFailure(response)}
                    />
                    

                    <Button
                        variant='contained'
                        startIcon={<FacebookIcon/>}
                        style={{
                            textTransform: 'none',
                            padding: '12px',
                            paddingLeft: '32px',
                            paddingRight: '32px',
                            borderRadius: '32px',
                            marginTop: '4px'
                        }}
                    >
                        <Typography
                            variant='body1'
                        >
                            Continue with Facebook
                        </Typography>
                    </Button>

                </div>
                


            </div>
        )
    }
}