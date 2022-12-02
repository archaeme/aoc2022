import { readFile } from 'node:fs/promises';

enum OutcomeScore {
	Loss = 0,
	Draw = 3,
	Win = 6,
}

enum ShapeScore {
	Rock = 1,
	Paper = 2,
	Scissor = 3,
}

enum Shape {
	Rock = 0,
	Paper = 1,
	Scissor = 2,
}

enum Outcome {
	Loss = 0,
	Draw = 1,
	Win = 2,
}

type Round = [number, number];
type Part1Round = [Shape, Shape];
type Part2Round = [Shape, Outcome];

function normalizeRound(rawRound: string): Round {
	return [rawRound.charCodeAt(0) - 'A'.charCodeAt(0), rawRound.charCodeAt(2) - 'X'.charCodeAt(0)];
}

function shapeToScore(shape: Shape): ShapeScore {
	switch (shape) {
		case Shape.Rock:
			return ShapeScore.Rock;
		case Shape.Paper:
			return ShapeScore.Paper;
		case Shape.Scissor:
			return ShapeScore.Scissor;
	}
}

function part1(rounds: Part1Round[]): number {
	function outcome(round: Part1Round): OutcomeScore {
		const [opponent, player] = round;
		if (opponent === player) {
			return OutcomeScore.Draw;
		} else if ((player + 1) % 3 === opponent) {
			return OutcomeScore.Loss;
		}
		return OutcomeScore.Win;
	}
	let score = 0;
	for (const round of rounds) {
		const [opponent, player] = round;
		score += shapeToScore(player) + outcome(round);
	}
	return score;
}

function part2(rounds: Part2Round[]): number {
	let score = 0;
	for (const round of rounds) {
		const [opponent, outcome] = round;
		let roundScore = 0;
		switch (outcome) {
			case Outcome.Loss:
				roundScore += OutcomeScore.Loss + shapeToScore((((opponent - 1) % 3) + 3) % 3);
				break;
			case Outcome.Draw:
				roundScore += OutcomeScore.Draw + shapeToScore(opponent);
				break;
			case Outcome.Win:
				roundScore += OutcomeScore.Win + shapeToScore((opponent + 1) % 3);
				break;
		}
		score += roundScore;
	}
	return score;
}

const rawData = await readFile('input.txt', { encoding: 'utf8' });
const data: Round[] = rawData.split('\n').filter(line => line !== '').map(normalizeRound);

console.log(part1(data as Part1Round[]));
console.log(part2(data as Part2Round[]));
