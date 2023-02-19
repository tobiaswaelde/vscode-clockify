import { GlobalStateKey } from '../config/state';
import { Context } from './context';

/**
 * Handles global state
 */
export class GlobalState {
	/**
	 * Gets the value for the given key
	 * @param {string} key The key
	 * @returns The value or `undefined`
	 */
	public static get<T>(key: GlobalStateKey): T | undefined {
		const ctx = Context.get();
		return ctx.globalState.get(key);
	}

	/**
	 * Sets the value for the given key
	 * @param {GlobalStateKey} key The key
	 * @param {T} value The value
	 */
	public static async set<T>(key: GlobalStateKey, value: T) {
		const ctx = Context.get();
		await ctx.globalState.update(key, value);
	}
}
