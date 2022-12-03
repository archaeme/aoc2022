import { readFile } from 'node:fs/promises';

/**
 * Splits a string in two (almost) equally sized halves.
 * @param str string to split
 * @return an array with two strings contain each half of the original
 */
function halfSplit(str: string): [string, string] {
    return [
        str.slice(0, Math.floor(str.length / 2)),
        str.slice(Math.floor(str.length / 2)),
    ];
}

/**
 * Returns the priority of the letter.
 *
 * - Lowercase letters (`a` through `z`) have priorities 1 through 26
 * - Uppercase letters (`A` though `Z`) have priorities 27 though 52
 *
 * @param letter a 1-character string containing a letter
 * @return a number indicating the priority of the letter
 */
function priority(letter: string): number {
    if (letter === letter.toLowerCase()) {
        return letter.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    }
    // Letter is uppercase
    return letter.charCodeAt(0) - 'A'.charCodeAt(0) + 27;
}

function part1(sacks: string[]): number{
    let priorities = 0;
    for (const sack of sacks) {
        const [first, second] = halfSplit(sack);

        const shared = [...first].filter(item => second.includes(item))[0];
        priorities += priority(shared);
    }

    return priorities;
}

function part2(sacks: string[]): number {
    let priorities = 0;
    for (let i = 0; i < sacks.length; i += 3) {
        const group = sacks.slice(i, i + 3);

        // Look for item that's in all three rucksacks
        const shared = [...group[0]].filter(item => group[1].includes(item) && group[2].includes(item))[0];
        priorities += priority(shared);
    }
    return priorities;
}

const data = await readFile('input.txt', { encoding: 'utf8' });
const sacks = data.split('\n').filter(line => line !== '');

console.log(`[Part 1] total priorities: ${part1(sacks)}`);
console.log(`[Part 2] total priorities: ${part2(sacks)}`);
