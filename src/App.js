import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './screens/Home';
import Profile from './screens/Profile';
import Dashboard from './screens/Dashboard';
import Upload from './screens/Upload';

export default function App() {
	return (
		<Router>
			<Switch>
				<Route exact path="/" component={Home} />
				<Route exact path="/profile" component={Profile} />
				<Route exact path="/dashboard" component={Dashboard} />
				<Route exact path="/upload" component={Upload} />
			</Switch>
		</Router>
	)
}