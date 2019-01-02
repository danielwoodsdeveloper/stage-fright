import { h, Component } from 'preact';
import { route } from 'preact-router';
import style from './style';

export default class Home extends Component {
	/**
	 * Route back to the Setup component if
	 * the player wants to play again
	 */
	play = () => {
		route('/setup');
	}

	render() {
		return (
			<div class={style.home}>
				<div class={style.welcome}>
					<h1>STAGE FRIGHT</h1>
					<h2>A party game for extroverts.</h2>
					
					<button onClick={this.play}>Play Now</button>
				</div>
			</div>
		);
	}
}
