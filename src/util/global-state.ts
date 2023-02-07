import { Context } from './context';

type GlobalStateKey = 'initialized' | 'selectedWorkspace' | 'selectedClient' | 'selectedProject';

/**
 * Handles global state
 */
export class GlobalState {
	/**
	 * Gets the value for the given key
	 * @param {string} key The key
	 * @returns
	 */
	public static get(key: GlobalStateKey): unknown {
		const ctx = Context.get();
		return ctx.globalState.get(key);
	}

	/**
	 * Sets the value for the given key
	 * @param {GlobalStateKey} key The key
	 * @param {any} value The value
	 */
	public static async set(key: GlobalStateKey, value: any) {
		const ctx = Context.get();
		await ctx.globalState.update(key, value);
	}
}
