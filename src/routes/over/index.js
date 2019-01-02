import { h, Component } from 'preact';
import { route } from 'preact-router';
import style from './style';

export default class Over extends Component {
	render() {
		return (
			<div class={style.over}>
                <h2>This game's winner is</h2>
                <h1>{this.props.winner}</h1>
                <button onClick={() => {route('/setup')}}>Play Again</button>
			</div>
		);
	}
}
