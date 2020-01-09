import React from 'react';
import { Redirect } from 'react-router-dom';

import Backdrop from '@material-ui/core/Backdrop';

import serverUrl from '../resources/config';

export default class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            redirect: false,
            loading: true,
            user: null
        }

    }

    async getPictures() {
        const rawResponse = await fetch(`${serverUrl}/picture`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        let content = await rawResponse.json();
        console.log(content);
        if (content.error)
            throw Error(content.errorMessage)

        return content;
    }

    componentDidMount() {
        console.log(this.props);

        if (this.props.location.state == null) {
            this.setState({ loading: false, redirect: true });
            return;
        }

        this.getPictures()
            .then((pictures) => {
                console.log(pictures)
                this.setState({ pictures, loading: false, error: false })
            })
            .catch((error) => {
                console.error(error);
                this.setState({ loading: false, error: true });
            })
    }
    
    render() {
        if (this.state.loading)
            return <Backdrop
                open={this.state.loading}
            />
        
        else if (this.state.redirect)
            return (
                <Redirect to={{
                    pathname: '/'
                }}/>
            )
        
        return (
            <h1>This is dashboard screen</h1>
        )
    }
}