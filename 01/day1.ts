import { readFile } from 'node:fs/promises';

function maxCalories(calories: number[]): number {
	return Math.max(...calories);
}

function topThreeTotal(calories: number[]): number {
	let topThree: number[] = [];
	for (let i = 0; i < 3; i++) {
		const remaining = calories.filter(n => !topThree.includes(n));
		topThree.push(maxCalories(remaining));
	}

	return topThree.reduce((acc, curr) => acc + curr);
}

const inputFile = 'input.txt';

const data = await readFile(inputFile, {
	encoding: 'utf8',
});

const calories: number[] = data
	.split('\n\n')
	.map(s => s
	     .split('\n')
	     .map((line: string) => Number(line))
	     .reduce((acc: number, curr: number) => acc + curr));

console.log(maxCalories(calories));
console.log(topThreeTotal(calories));
