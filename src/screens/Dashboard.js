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
            user: null,
            pictures: null
        }

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
            <h1>This is dashboard screen</h1>
        )
    }
}