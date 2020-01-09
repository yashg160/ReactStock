import React from 'react';

export default class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        console.log(props);
    }
    
    render() {
        return (
            <h1>This is dashboard screen</h1>
        )
    }
}