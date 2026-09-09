import { window } from 'vscode';
import { TimeEntryImpl } from '../sdk/types/time-entry';
import { Config } from '../util/config';
import { Tracking } from './tracking';

type PomodoroPhase = 'idle' | 'focus' | 'focus-complete' | 'break' | 'break-complete' | 'transition';

interface PomodoroSettings {
	enabled: boolean;
	focusMinutes: number;
	shortBreakMinutes: number;
	longBreakMinutes: number;
	sessionsBeforeLongBreak: number;
	automaticBreaks: boolean;
}

const SHORT_BREAK_DESCRIPTION = 'Pomodoro break';
const LONG_BREAK_DESCRIPTION = 'Pomodoro long break';

export class Pomodoro {
	private static phase: PomodoroPhase = 'idle';
	private static entryId?: string;
	private static deadline?: number;
	private static completedSessions = 0;
	private static workEntry?: TimeEntryImpl;
	private static updateInProgress?: Promise<void>;

	public static update(): Promise<void> {
		if (!this.updateInProgress) {
			this.updateInProgress = this.performUpdate().finally(() => {
				this.updateInProgress = undefined;
			});
		}
		return this.updateInProgress;
	}

	private static async performUpdate(): Promise<void> {
		const settings = this.getSettings();
		if (!settings.enabled) {
			this.reset(true);
			return;
		}

		const entry = Tracking.isTracking ? Tracking.timeEntry : undefined;
		if (!entry) {
			if (this.phase !== 'transition') {
				this.reset(true);
			}
			return;
		}

		const isLongBreak = entry.description === LONG_BREAK_DESCRIPTION;
		const isBreak = isLongBreak || entry.description === SHORT_BREAK_DESCRIPTION;
		if (this.entryId !== entry.id) {
			if (this.phase === 'focus' || this.phase === 'focus-complete') {
				this.completedSessions = 0;
			}
			this.entryId = entry.id;
			this.phase = isBreak ? 'break' : 'focus';
			const minutes = isBreak
				? isLongBreak
					? settings.longBreakMinutes
					: settings.shortBreakMinutes
				: settings.focusMinutes;
			this.deadline = new Date(entry.timeInterval.start).getTime() + minutes * 60 * 1000;
		}

		if (!this.deadline || Date.now() < this.deadline) {
			return;
		}
		if (!window.state.focused) {
			return;
		}

		if (this.phase === 'focus') {
			await this.completeFocus(entry, settings);
		} else if (this.phase === 'break') {
			await this.completeBreak(entry, settings);
		}
	}

	private static async completeFocus(
		entry: TimeEntryImpl,
		settings: PomodoroSettings
	): Promise<void> {
		this.phase = 'focus-complete';
		this.completedSessions++;
		const longBreak = this.completedSessions % settings.sessionsBeforeLongBreak === 0;
		const breakMinutes = longBreak ? settings.longBreakMinutes : settings.shortBreakMinutes;
		const action = longBreak ? 'Start Long Break' : 'Start Break';
		if (settings.automaticBreaks) {
			await this.beginBreak(entry, longBreak, breakMinutes);
			return;
		}

		void window
			.showInformationMessage(
				`Pomodoro focus interval complete. Time for a ${breakMinutes}-minute break.`,
				action
			)
			.then((selection) => {
				if (selection === action) {
					void this.beginBreak(entry, longBreak, breakMinutes);
				}
			});
	}

	private static async beginBreak(
		entry: TimeEntryImpl,
		longBreak: boolean,
		breakMinutes: number
	): Promise<void> {
		if (Tracking.timeEntry?.id !== entry.id) {
			return;
		}

		this.phase = 'transition';
		this.workEntry = entry;
		if (!(await Tracking.stop(false))) {
			this.phase = 'focus-complete';
			window.showErrorMessage('Clockify could not stop the work timer for the Pomodoro break.');
			return;
		}

		const description = longBreak ? LONG_BREAK_DESCRIPTION : SHORT_BREAK_DESCRIPTION;
		if (!(await Tracking.startFromTimeEntry(entry, description))) {
			this.reset(true);
			window.showErrorMessage('Clockify could not start the Pomodoro break timer.');
			return;
		}

		this.phase = 'idle';
		this.entryId = undefined;
		window.showInformationMessage(`Pomodoro ${breakMinutes}-minute break started.`);
	}

	private static async completeBreak(
		entry: TimeEntryImpl,
		settings: PomodoroSettings
	): Promise<void> {
		this.phase = 'break-complete';
		if (settings.automaticBreaks) {
			await this.resumeWork(entry);
			return;
		}

		void window
			.showInformationMessage('Pomodoro break complete. Ready to continue?', 'Resume Work')
			.then((selection) => {
				if (selection === 'Resume Work') {
					void this.resumeWork(entry);
				}
			});
	}

	private static async resumeWork(breakEntry: TimeEntryImpl): Promise<void> {
		if (Tracking.timeEntry?.id !== breakEntry.id || !this.workEntry) {
			return;
		}

		this.phase = 'transition';
		if (!(await Tracking.stop(false))) {
			this.phase = 'break-complete';
			window.showErrorMessage('Clockify could not stop the Pomodoro break timer.');
			return;
		}

		const workEntry = this.workEntry;
		if (!(await Tracking.startFromTimeEntry(workEntry))) {
			this.reset(true);
			window.showErrorMessage('Clockify could not resume the work timer.');
			return;
		}

		this.phase = 'idle';
		this.entryId = undefined;
		window.showInformationMessage('Pomodoro break complete. Work timer resumed.');
	}

	private static getSettings(): PomodoroSettings {
		const positiveInteger = (key: Parameters<typeof Config.get<number>>[0], fallback: number) => {
			const value = Config.get<number>(key);
			return Number.isInteger(value) && (value ?? 0) > 0 ? (value as number) : fallback;
		};
		return {
			enabled: Config.get<boolean>('pomodoro.enabled') ?? false,
			focusMinutes: positiveInteger('pomodoro.focusMinutes', 25),
			shortBreakMinutes: positiveInteger('pomodoro.shortBreakMinutes', 5),
			longBreakMinutes: positiveInteger('pomodoro.longBreakMinutes', 15),
			sessionsBeforeLongBreak: positiveInteger('pomodoro.sessionsBeforeLongBreak', 4),
			automaticBreaks: Config.get<boolean>('pomodoro.automaticBreaks') ?? false,
		};
	}

	private static reset(resetSessions: boolean): void {
		this.phase = 'idle';
		this.entryId = undefined;
		this.deadline = undefined;
		this.workEntry = undefined;
		if (resetSessions) {
			this.completedSessions = 0;
		}
	}
}
