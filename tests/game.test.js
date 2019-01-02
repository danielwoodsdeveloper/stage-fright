import Game from '../src/routes/game';
import { shallow } from 'preact-render-spy';

describe('Test of Game', () => {
    const game = shallow(<Game players={['Name One', 'Name Two', 'Name Three']} />);
    
    test('Initialisation of Game component', () => {
        expect(game.state('players').length).toBe(3);
        expect(game.state('players')[0].name).toBe('Name One');
        expect(game.state('players')[0].score).toBe(0);
    });

    test('Judge should be first player by default', () => {
        expect(game.state('judge')).toBe('Name One');
    });

    test('Performers should not include the judge', () => {
        expect(game.state('performers').length).toBe(2);
        expect(game.state('performers')).toContain('Name Two');
        expect(game.state('performers')).toContain('Name Three');
    });

    test('Winner select button is disabled before prep time is finished', () => {
        expect(game.find('.selectWinnerBtn').first().attr('disabled')).toBe(true);
    });

    test('When timer is started, check that the timer is shown and time selector is hidden', () => {
        expect(game.find('#timer').length).toBe(0);
        expect(game.find('#startTimerBtn').length).toBe(1);
        game.find('#startTimerBtn').simulate('click');
        expect(game.find('#timer').length).toBe(1);
        expect(game.find('#startTimerBtn').length).toBe(0);
    });

    test('When timer ends, winner select buttons should be enabled', () => {
        game.setState({
            round: 1,
			time: 0,
			players: [{name: 'Name One', score: 0}, {name: 'Name Two', score: 0}, {name: 'Name Three', score: 0}],
			performers: ['Name Two', 'Name Three'],
			judge: 'Name One',
			prompt: '',
			roundStarted: true
        });

        expect(game.find('.selectWinnerBtn').first().attr('disabled')).toBe(false);
    });

    test('Resetting game', () => {
        // Select Name Two as winner
        game.find('.selectWinnerBtn').first().simulate('click');

        // Timer should be reset
        expect(game.find('#timer').length).toBe(0);
        expect(game.find('#startTimerBtn').length).toBe(1);

        // Winner select buttons should again be disabled
        expect(game.find('.selectWinnerBtn').first().attr('disabled')).toBe(true);

        // Name Two's score should have increased
        expect(game.state('players')[0].score).toBe(0);
        expect(game.state('players')[1].score).toBe(1);
        expect(game.state('players')[2].score).toBe(0);

        // Name Two should now be the judge
        expect(game.state('judge')).toBe('Name Two');

        // Round should have incremented
        expect(game.state('round')).toBe(2);
    });
});
