import React from 'react';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FacebookIcon from '@material-ui/icons/Facebook';

import { GoogleLogin } from 'react-google-login';

import backgroundImage from '../resources/home-background.png';

export default class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        }
    }

    handleLoginSuccess(response) {
        console.log(response);
    }

    handleLoginFailure(response) {
        console.log(response);
    }


    render() {
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
                        startIcon={<FacebookIcon fontSize='32px'/>}
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