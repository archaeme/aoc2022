import { readFile } from 'node:fs/promises';

// A - Rock; B - Paper; C - Scissor
type Opponent = 'A'|'B'|'C';
// X - Rock; Y - Paper; Z - Scissor
type Player = 'X'|'Y'|'Z';
type Part1Round = [Opponent, Player];

// X - Lose; Y - Draw; Z - Win
type DesiredOutcome = 'X'|'Y'|'Z';
type Part2Round = [Opponent, DesiredOutcome];
type Round = Part1Round | Part2Round;

enum Outcome {
	Loss = 0,
	Draw = 3,
	Win = 6,
}

enum PlayerShape {
	Rock = 1,
	Paper = 2,
	Scissor = 3,
}

function part1(rounds: Part1Round[]): number {
	function outcome(opponent: Opponent, player: Player): Outcome {
		if (opponent === 'A' && player === 'X') {
			return Outcome.Draw;
		} else if (opponent === 'A' && player === 'Y') {
			return Outcome.Win;
		} else if (opponent === 'A' && player === 'Z') {
			return Outcome.Loss;
		} else if (opponent === 'B' && player === 'X') {
			return Outcome.Loss;
		} else if (opponent === 'B' && player === 'Y') {
			return Outcome.Draw;
		} else if (opponent === 'B' && player === 'Z') {
			return Outcome.Win;
		} else if (opponent === 'C' && player === 'X') {
			return Outcome.Win;
		} else if (opponent === 'C' && player === 'Y') {
			return Outcome.Loss;
		} else if (opponent === 'C' && player === 'Z') {
			return Outcome.Draw;
		}
	}
	let score = 0;
	for (const round of rounds) {
		const [opponent, player] = round;
		let roundScore = 0;
		switch (player) {
		case 'X':
			roundScore += PlayerShape.Rock + outcome(...round);
			break;
		case 'Y':
			roundScore += PlayerShape.Paper + outcome(...round);
			break;
		case 'Z':
			roundScore += PlayerShape.Scissor + outcome(...round);
			break;
		}
		score += roundScore;
	}
	return score;
}

function part2(rounds: Part2Round[]): number {
	let score = 0;
	for (const round of rounds) {
		const [opponent, desiredOutcome] = round;
		let roundScore = 0;
		switch (desiredOutcome) {
		case 'X': // Loss
			roundScore += Outcome.Loss;
			switch (opponent) {
			case 'A': 
				roundScore += PlayerShape.Scissor;
				break;
			case 'B': 
				roundScore += PlayerShape.Rock;
				break;
			case 'C': 
				roundScore += PlayerShape.Paper;
				break;
			}
			break;
		case 'Y': // Draw12767
			roundScore += Outcome.Draw;
			switch (opponent) {
			case 'A':
				roundScore += PlayerShape.Rock;
				break;
			case 'B':
				roundScore += PlayerShape.Paper;
				break;
			case 'C':
				roundScore += PlayerShape.Scissor;
				break;
			}
			break;
		case 'Z': // Win
			roundScore += Outcome.Win;
			switch (opponent) {
			case 'A': 
				roundScore += PlayerShape.Paper;
				break;
			case 'B': 
				roundScore += PlayerShape.Scissor;
				break;
			case 'C': 
				roundScore += PlayerShape.Rock;
				break;
			}
			break;
		}
		score += roundScore;
	}
	return score;
}

const rawData = await readFile('input.txt', { encoding: 'utf8' });
const data: Round[] = rawData.split('\n').map(s => s.split(' '));

console.log(part1(data as Part1Round[]));
console.log(part2(data as Part2Round[]));
