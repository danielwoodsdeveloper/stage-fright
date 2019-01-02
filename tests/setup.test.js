import Setup from '../src/routes/setup';
import { shallow } from 'preact-render-spy';

describe('Test of Setup', () => {
	const setup = shallow(<Setup />);

	test('Adding a player', () => {
		setup.setState({name: 'Test Name', players: []});
		setup.find('#addPlayerBtn').simulate('click');
		expect(setup.state('players').length).toBe(1);
	});

	test('Removing a player', () => {
		setup.find('#removePlayerBtn').simulate('click');
		expect(setup.state('players').length).toBe(0);
	});

	test('Start button is disabled when less than 3 players added', () => {
		expect(setup.find('#startBtn').attr('disabled')).toBe(true);
	});

	test('Start button is enabled when 3 or more players are added', () => {
		setup.setState({players: ['Name One', 'Name Two', 'Name Three']});
		expect(setup.find('#startBtn').attr('disabled')).toBe(false);
	});

	test('Cannot add blank name', () => {
		setup.setState({name: '', players: []});
		setup.find('#addPlayerBtn').simulate('click');
		expect(setup.state('players').length).toBe(0);
	});

	test('Cannot add duplicate name', () => {
		setup.setState({name: 'Test Name', players: ['Test Name']});
		setup.find('#addPlayerBtn').simulate('click');
		expect(setup.state('players').length).toBe(1);
	});
});
