import { Config } from './config';

export function sensify(value: string | number): string {
	if (!Config.get<boolean>('hideSensitiveData')) {
		return `${value}`;
	}

	// sensify data
	if (typeof value === 'number') {
		return '###';
	}
	const words = value.split(' ');
	return words.map(sensifyWord).join(' ');
}

function sensifyWord(word: string): string {
	if (word.length <= 1) {
		return word;
	}

	return `${word.charAt(0)}${'*'.repeat(word.length - 1)}`;
}
