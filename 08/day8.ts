import { readFile } from 'node:fs/promises';

function isVisibleFromPath(tree: number, path: number[]): boolean {
	let visible = true;
	for (const otherTree of path) {
		if (otherTree >= tree) {
			visible = false;
			break;
		}
	}
	return visible;
}

function isVisible(x: number, y: number, grid: number[][]): boolean {
	const row = grid[y];
	const tree = row[x];
	const leftVisible = isVisibleFromPath(tree, row.slice(0, x));
	if (leftVisible) {
		return true;
	}

	const rightVisible = isVisibleFromPath(tree, row.slice(x + 1));
	if (rightVisible) {
		return true;
	}

	const col = grid.map(row => row[x]);
	const topVisible = isVisibleFromPath(tree, col.slice(0, y));
	if (topVisible) {
		return true;
	}

	const bottomVisible = isVisibleFromPath(tree, col.slice(y + 1));
	if (bottomVisible) {
		return true;
	}

	return false;
}

function viewingDistance(tree: number, path: number[]): number {
	let visible = 0;
	for (const otherTree of path) {
		visible++;
		if (otherTree >= tree) break;
	}
	return visible;
}

function scenicScore(x: number, y: number, grid: number[][]): number {
	const row = grid[y];
	const col = grid.map(row => row[x]);
	const tree = row[x];

	const left = viewingDistance(tree, row.slice(0, x).reverse());
	const right = viewingDistance(tree, row.slice(x + 1));
	const top = viewingDistance(tree, col.slice(0, y).reverse());
	const bottom = viewingDistance(tree, col.slice(y + 1));

	return left * right * top * bottom;
}

const data = await readFile('input.txt', { encoding: 'utf8' });
const grid = data.split('\n').slice(0, -1).map(row => row.split('').map(Number));

let visibleTrees = grid.length * 2 + (grid[0].length - 2) * 2;
let maxScenicScore = 1;
for (let y = 1; y < grid.length - 1; y++) {
	for (let x = 1; x < grid[y].length - 1; x++) {
		if (isVisible(x, y, grid)) {
			visibleTrees++;
		}
		const currScenicScore = scenicScore(x, y, grid);
		maxScenicScore = Math.max(maxScenicScore, currScenicScore);
	}
}

console.log(`[Part 1] Visible trees: ${visibleTrees}`);
console.log(`[Part 2] Max scenic score: ${maxScenicScore}`);
