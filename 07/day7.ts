import { readFile } from 'node:fs/promises';

class Directory {
	size: number = 0; // Size of the current directory, not including the size of children.
	children: Map<string, Directory> = new Map();
	readonly parent: Directory; // Root directory has undefined parent

	constructor(parent?: Directory) {
		this.parent = parent;
	}

	totalSize(): number {
		let total = this.size;
		for (const [_, child] of this.children) {
			total += child.totalSize();
		}
		return total;
	}

	hasChild(dirName: string): boolean {
		return this.children.has(dirName);
	}

	getChild(dirName: string): Directory | undefined {
		return this.children.get(dirName);
	}

	addChild(dirName: string): void {
		let child = new Directory(this);
		this.children.set(dirName, child);
	}
}

const root = new Directory();

function chdir(curr: Directory, dirName: string): Directory | undefined {
	if (dirName === '..') {
		return curr.parent;
	} else if (dirName === '/') {
		return root;
	}

	// dirName must refer to a child of curr
	return curr.getChild(dirName);
}

function sumSmallDirs(dir: Directory = root): number {
	let totalSize = 0;
	const dirTotalSize = dir.totalSize();

	if (dirTotalSize <= 100000) {
		totalSize += dirTotalSize;
	}

	for (const [_, child] of dir.children) {
		totalSize += sumSmallDirs(child);
	}
	return totalSize;
}

function smallestFreeSpace(dir: Directory = root): number {
	const freeSpace = 70000000 - root.totalSize();

	const dirTotalSize = dir.totalSize();
	const dirScore = dirTotalSize >= (30000000 - freeSpace) ? dirTotalSize : Infinity;

	let childScores: number[] = [];
	for (const [_, child] of dir.children) {
		childScores.push(smallestFreeSpace(child));
	}
	return Math.min(dirScore, ...childScores);
}

const data = await readFile('input.txt', { encoding: 'utf8' });

const lines = data.split('\n').filter(line => line !== '');

let currentDir = root;
for (const line of lines) {
	const parts = line.split(' ');
	switch (parts[0]) {
	case '$':
		switch (parts[1]) {
		case 'cd':
			const newDir = chdir(currentDir, parts[2]);
			if (newDir == null) {
				throw new Error(`Directory ${newDir} doesn't exist in the current directory.`);
			}

			currentDir = newDir;
			break;
		case 'ls':
			continue;
		}
		break;
	case 'dir':
		currentDir.addChild(parts[1]);
		break;
	default:
		currentDir.size += Number(parts[0]);
	}
}

console.log(`[Part 1] Total: ${sumSmallDirs()}`);
console.log(`[Part 2] Smallest directory that can be removed: ${smallestFreeSpace()}`);
