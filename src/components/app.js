import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Home from '../routes/home';
import Setup from '../routes/setup';
import Game from '../routes/game';
import Over from '../routes/over';

export default class App extends Component {
	constructor() {
		super();
		this.state = {
			players: [],
			firstTo: 3,
			winner: ''
		};
	}
	
	/**
	 * Route handler
	 */
	handleRoute = (e) => {
		this.currentUrl = e.url;
	};

	/**
	 * Function passed to Setup component so that it can
	 * update the state of app.js. Players list is
	 * then sent to Game component
	 */
	setPlayers = (players) => {
		this.setState({
			players: players
		});
	}

	/**
	 * Function passed to Setup component so that it can
	 * update the state of app.js. This is then
	 * sent to Game component to determine win condition
	 */
	setFirstTo = (firstTo) => {
		this.setState({
			firstTo: firstTo
		});
	}

	/**
	 * Function passed to Game component so that it can
	 * update the state of app.js. Winner name is
	 * passed to Over component to display winner name
	 */
	setWinner = (winner) => {
		this.setState({
			winner: winner
		});
	}

	render() {
		return (
			<div id="app">
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<Setup path="/setup" playersHandler={this.setPlayers} firstToHandler={this.setFirstTo} />
					<Game path="/game" players={this.state.players} firstTo={this.state.firstTo} winnerHandler={this.setWinner} />
					<Over path="/over" winner={this.state.winner} />
				</Router>
			</div>
		);
	}
}
