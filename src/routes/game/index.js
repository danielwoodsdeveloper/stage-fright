import { h, Component } from 'preact';
import { route } from 'preact-router';
import style from './style';

export default class Game extends Component {
	constructor() {
		super();
		this.state = {
			round: 0,
			time: 60,
			players: [],
			performers: [],
			judge: '',
			prompt: '',
			roundStarted: false
		};

		// Array of base prompts
		this.prompts = [
			"Perform an interpretive dance that depicts {BEING} {ACTION} {BEING} {PLACE}.",
			"Write and perform a short rap that tells the story of {BEING} {ACTION} {BEING} {PLACE}.",
			"Write and read aloud a short poem that tells the story of {BEING} {ACTION} {BEING} {PLACE}.",
			"Write and perform a short song (spoken-word is fine) that tells the story of {BEING} {ACTION} {BEING} {PLACE}.",
			"Act out the following scene: {BEING} {ACTION} {BEING} {PLACE}.",
			"Mime (no speaking allowed) the following scene: {BEING} {ACTION} {BEING} {PLACE}.",
			"Tell a story about {BEING} {ACTION} {BEING} {PLACE}.",
			"Perform a news broadcast about {BEING} {ACTION} {BEING} {PLACE}.",
		];

		// Array of humans/animals/living beings
		this.beings = [
			"the Pope",
			"a police officer",
			"a telemarketer",
			"a dog",
			"a cat",
			"the queen of England",
			"a baby",
			"a 12 year old",
			"a duck",
			"a very old man",
			"Arnold Schwarzenegger",
			"an old lady",
			"Samuel L. Jackson",
			"the Prime Minister",
			"the President of the United States of America",
			"Adolf Hitler",
			"Shannon Noll",
			"an incredibly obese man"
		];

		// Array of actions for beings to perform
		this.actions = [
			"getting into a fist-fight with",
			"having an over-the-top argument with",
			"aggressively licking",
			"pretending to be",
			"eating",
			"falling in love with",
			"giving an erotic massage to",
			"stealing a car and running over",
			"pinning down, and subsequently pooping on,",
			"literally screaming at",
			"suggestively winking at"
		];

		// Array of places for actions to occur in
		this.places = [
			"in a McDonald's parking lot",
			"at a Church Bake Sale",
			"at the White House",
			"in outer space",
			"in Gary, Indiana (the U.S. crime capital)",
			"in Disneyland",
			"in a KFC"
		];
	}

	/**
	 * Randomly build a prompt
	 * 
	 * Starts with a base prompt, and then adds random
	 * BEINGS, ACTIONS and PLACES
	 */
	buildPrompt = () => {
		let prompt = this.prompts[Math.floor(Math.random() * this.prompts.length)];

		while (prompt.includes("{BEING}")) {
			prompt = prompt.replace("{BEING}", this.beings[Math.floor(Math.random() * this.beings.length)]);
		}

		while (prompt.includes("{ACTION}")) {
			prompt = prompt.replace("{ACTION}", this.actions[Math.floor(Math.random() * this.actions.length)]);
		}

		while (prompt.includes("{PLACE}")) {
			prompt = prompt.replace("{PLACE}", this.places[Math.floor(Math.random() * this.places.length)]);
		}

		return prompt;
	}

	/**
	 * Player names are passed in as a prop. So we'll
	 * take the array of names, and use it to construct
	 * an array of player objects
	 */
	componentDidMount() {
		for (var i = 0; i < this.props.players.length; i++) {
			this.setState({
				players: this.state.players.concat({name: this.props.players[i], score: 0})
			});
		}
		
		this.reset();
	}

	/**
	 * After each round, we need to reset a few things
	 * in the state. We also need to stop and reset the
	 * timer variable
	 */
	reset = () => {
		clearInterval(this.timer);

		/**
		 * Select the next judge
		 * 
		 * For the first round, the judge will be the first
		 * player added. This will then cycle sequentially
		 */
		let judgeIndex = 0;
		if (this.state.judge !== '') {
			for (var i = 0; i < this.state.players.length; i++) {
				if (this.state.players[i].name === this.state.judge) {
					judgeIndex = i + 1;
				}
			}

			if (judgeIndex >= this.state.players.length) {
				judgeIndex = 0;
			}
		}


		/**
		 * Build array of performers. This is the array
		 * of players with the judge removed
		 */
		let temp = [];
		for (var i = 0; i < this.state.players.length; i++) {
			temp.push(this.state.players[i].name);
		}

		let judge = temp[judgeIndex];
		temp.splice(judgeIndex, 1);

		// Reset state
		this.setState({
			round: this.state.round + 1,
			time: 60,
			judge: judge,
			performers: temp,
			prompt: this.buildPrompt(),
			roundStarted: false
		});

		// If a player has won, route to Over component
		for (var i = 0; i < this.state.players.length; i++) {
			if (this.state.players[i].score >= this.props.firstTo) {
				this.props.winnerHandler(this.state.players[i].name);
				route('/over');
			}
		}
	}

	/**
	 * Handler for the preparation time input
	 */
	handleSelect = (e) => {
		this.setState({
			time: e.target.value
		});
	}

	/**
	 * Begin the preparation timer
	 */
	startTimer = () => {
		this.setState({
			roundStarted: true
		});

		this.timer = setInterval(() => {
			this.setState({
				time: this.state.time - 1
			});

			if (this.state.time <= 0) {
				clearInterval(this.timer);
			}
		}, 1000);
	}

	/**
	 * Handler for the judge selecting the winning
	 * performer
	 */
	selectWinner = (name) => {
		let temp = this.state.players;
		for (var i = 0; i < temp.length; i++) {
			if (temp[i].name === name) {
				temp[i].score++;
			}
		}

		this.setState({
			players: temp
		});

		this.reset();
	}

	render() {
		// Format timer
		let minutes = Math.floor(this.state.time / 60);
		let seconds = this.state.time - minutes * 60;
		seconds = seconds < 10 ? "0" + seconds : seconds;
		seconds = seconds === 0 ? "00" : seconds;

		return (
			<div class={style.game}>
				<div class={style.title}>
					<h1>ROUND {this.state.round}</h1>
					<h2>Select the amount of preparation time, then click Start.</h2>
				</div>
				{!this.state.roundStarted ? <div class={style.timeSelect}>
					<select value={this.state.time} onChange={this.handleSelect}>
						<option value="60">1 Minute</option>
						<option value="120">2 Minutes</option>
						<option value="300">5 Minutes</option>
						<option value="600">10 Minutes</option>
					</select>
					<button id="startTimerBtn" onClick={this.startTimer}>Start</button>
				</div> : null }
				{this.state.roundStarted ? <div class={style.timer}>
					<h1 id="timer">{this.state.time > 0 ? minutes + ":" + seconds : "0:00"}</h1>
				</div> : null}
				<div class={style.promptSection}>
					<h2>Judge: {this.state.judge}</h2>
					<h1>{this.state.prompt}</h1>
				</div>
				<div class={style.performers}>
					<h2>Performers:</h2>
					{this.state.performers.map(name => (
						<div class={style.item} key={name}>
							<div class={style.name}>{name}</div>
							<button class="selectWinnerBtn" disabled={!this.state.roundStarted || this.state.time > 0} onClick={() => this.selectWinner(name)}>Winner</button>
						</div>
					))}
				</div>
			</div>
		);
	}
}
