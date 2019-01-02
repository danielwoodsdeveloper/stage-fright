import { h, Component } from 'preact';
import { route } from 'preact-router';
import style from './style';

export default class Setup extends Component {
	constructor() {
		super();
		this.state = {
			players: [],
			name: '',
			firstTo: 3
		};
	}

	/**
	 * Add a player name. Uses the value of
	 * the player name input field
	 */
	addPlayer = () => {
		let name = this.state.name;
		name = name.trim();

		// Name cannot be blank
		if (name === '') {
			return;
		}

		// Name must be unique
		for (var i = 0; i < this.state.players.length; i++) {
			if (this.state.players[i] === name) {
				return;
			}
		}

		this.setState({
			players: this.state.players.concat([name]),
			name: ''
		});
	}

	/**
	 * Remove a particular player from the list
	 * of active players
	 */
	removePlayer = (name) => {
		let temp = this.state.players;
		for (var i = 0; i < temp.length; i++) {
			if (temp[i] === name) {
				temp.splice(i, 1);
			}
		}

		this.setState({
			players: temp
		});
	}

	/**
	 * Handler for win condition input
	 */
	handleSelect = (e) => {
		this.setState({
			firstTo: e.target.value
		});
	}

	/**
	 * Handler for player name input
	 */
	handleInput = (e) => {
		this.setState({
			name: e.target.value
		});
	}

	/**
	 * Handle ENTER press to trigger add player
	 */
	handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			this.addPlayer();
		}
	}

	/**
	 * Pass player list and selected first to value
	 * back to parent component so it can be sent to
	 * other components
	 * 
	 * Then route to Game component
	 */
	startGame = () => {
		this.props.playersHandler(this.state.players);
		this.props.firstToHandler(this.state.firstTo);

		route('/game');
	}

	render() {
		return (
			<div class={style.players}>
				<div class={style.title}>
					<h1>SETUP</h1>
					<h2>Add at least 3 players (but more is better).</h2>
					<h2>Then select the conditions for winning.</h2>
				</div>
				<div class={style.input}>
					<input placeholder="Enter a name..." value={this.state.name} onInput={this.handleInput} onKeyPress={this.handleKeyPress}></input>
					<button id="addPlayerBtn" onClick={this.addPlayer}>Add</button>
				</div>
				<div class={style.list}>
					{this.state.players.map(name => (
						<div class={style.item} key={name}>
							<div class={style.name}>{name}</div>
							<button id="removePlayerBtn" onClick={() => this.removePlayer(name)}>Delete</button>
						</div>
					))}
				</div>
				<div class={style.firstToSelect}>
					<select value={this.state.firstTo} onChange={this.handleSelect}>
						<option value="3">First to 3</option>
						<option value="5">First to 5</option>
						<option value="7">First to 7</option>
						<option value="10">First to 10</option>
					</select>
					<button id="startBtn" disabled={this.state.players.length < 3} id={style.startBtn} onClick={this.startGame}>Start</button>
				</div>
			</div>
		);
	}
}
