/*--------------------------------------------------------------------------------------
 *  Copyright 2025 Glass Devtools, Inc. All rights reserved.
 *  Licensed under the Apache License, Version 2.0. See LICENSE.txt for more information.
 *--------------------------------------------------------------------------------------*/

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAccessor } from '../util/services.js';
import { useI18n } from '../util/i18nHook.js';
import type { SupportedLanguage } from '../../../../common/i18n/i18nService.js';

/**
 * Language setting states for UI feedback
 */
export interface LanguageSettingState {
	/** Current language from i18n service */
	currentLanguage: SupportedLanguage;
	/** Language stored in backend settings */
	storedLanguage: SupportedLanguage | undefined;
	/** Whether language is in sync between frontend and backend */
	isInSync: boolean;
	/** Loading state for language operations */
	isLoading: boolean;
	/** Last operation error */
	error: string | null;
	/** Last operation success state */
	lastOperationSuccess: boolean | null;
}

/**
 * Language setting actions for user interactions
 */
export interface LanguageSettingActions {
	/** Change language with full sync to backend */
	changeLanguage: (newLanguage: SupportedLanguage) => Promise<boolean>;
	/** Sync language from backend to frontend */
	syncFromBackend: () => Promise<void>;
	/** Clear error state */
	clearError: () => void;
	/** Reset operation state */
	resetOperationState: () => void;
	/** Computed language options with selection state */
	languageOptions: Array<{
		value: SupportedLanguage;
		label: string;
		isSelected: boolean;
		isStored: boolean;
	}>;
}

/**
 * Enhanced Hook for language settings management with backend synchronization
 *
 * Features:
 * - Automatic backend synchronization
 * - Loading and error states
 * - Performance optimized with proper dependency arrays
 * - Memory efficient with proper cleanup
 * - Type-safe with TypeScript
 */
export const useLanguageSettings = (): LanguageSettingState & LanguageSettingActions => {
	const { t, changeLanguage: i18nChangeLanguage, currentLanguage: i18nLanguage } = useI18n();
	const accessor = useAccessor();
	const voidSettingsService = accessor.get('IVoidSettingsService');
	const settingsState = accessor.get('IVoidSettingsService').state;

	// State management
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [lastOperationSuccess, setLastOperationSuccess] = useState<boolean | null>(null);

	// Ref to prevent infinite loops
	const isUpdatingRef = useRef(false);
	const lastSyncRef = useRef<string | null>(null);

	// Memoized computed values
	const storedLanguage = useMemo(() => settingsState.globalSettings.language, [settingsState.globalSettings.language]);

	const isInSync = useMemo(() => {
		return storedLanguage === i18nLanguage;
	}, [storedLanguage, i18nLanguage]);

	// Clear error after timeout
	useEffect(() => {
		if (error) {
			const timer = setTimeout(() => {
				setError(null);
				setLastOperationSuccess(null);
			}, 5000);

			return () => clearTimeout(timer);
		}
		return undefined;
	}, [error]);

	// Clear success state after timeout
	useEffect(() => {
		if (lastOperationSuccess === true) {
			const timer = setTimeout(() => {
				setLastOperationSuccess(null);
			}, 3000);

			return () => clearTimeout(timer);
		}
		return undefined;
	}, [lastOperationSuccess]);

	// Auto-sync: sync language from backend when different
	useEffect(() => {
		// Skip if already updating or same language
		if (isUpdatingRef.current || isInSync || !storedLanguage) {
			return;
		}

		// Skip if we just synced this language
		const syncKey = `${storedLanguage}-${i18nLanguage}`;
		if (lastSyncRef.current === syncKey) {
			return;
		}

		const performSync = async () => {
			try {
				isUpdatingRef.current = true;
				await i18nChangeLanguage(storedLanguage);
				lastSyncRef.current = syncKey;
				console.log(`Auto-synced language from backend: ${storedLanguage}`);
			} catch (err) {
				console.warn('Failed to auto-sync language from backend:', err);
				setError('Failed to sync language setting');
			} finally {
				isUpdatingRef.current = false;
			}
		};

		// Small delay to prevent immediate sync during component mount
		const timer = setTimeout(performSync, 100);

		return () => {
			clearTimeout(timer);
		};
	}, [storedLanguage, i18nLanguage, isInSync, i18nChangeLanguage]);

	// Enhanced language change with backend sync
	const changeLanguage = useCallback(async (newLanguage: SupportedLanguage): Promise<boolean> => {
		// Skip if same language or already updating
		if (newLanguage === i18nLanguage || isLoading || isUpdatingRef.current) {
			return true;
		}

		setIsLoading(true);
		setError(null);
		setLastOperationSuccess(null);

		try {
			isUpdatingRef.current = true;

			// Update backend setting first
			await voidSettingsService.setGlobalSetting('language', newLanguage);

			// Then update i18n service
			await i18nChangeLanguage(newLanguage);

			// Track successful change
			const metricsService = accessor.get('IMetricsService');
			metricsService.capture('Language Changed', {
				from: i18nLanguage,
				to: newLanguage,
				source: 'hook'
			});

			setLastOperationSuccess(true);

			// Show user feedback
			const notificationService = accessor.get('INotificationService');
			notificationService.info(t('settings.language.restartNote'));

			return true;
		} catch (err) {
			console.error('Failed to change language:', err);

			const errorMessage = err instanceof Error ? err.message : 'Failed to change language';
			setError(errorMessage);
			setLastOperationSuccess(false);

			// Show error notification
			const notificationService = accessor.get('INotificationService');
			notificationService.error({
				message: t('settings.language.changeError', 'Failed to change language'),
				severity: 1 // Severity.Error
			});

			return false;
		} finally {
			setIsLoading(false);
			isUpdatingRef.current = false;
		}
	}, [i18nLanguage, isLoading, voidSettingsService, i18nChangeLanguage, accessor, t]);

	// Manual sync from backend
	const syncFromBackend = useCallback(async (): Promise<void> => {
		if (!storedLanguage || storedLanguage === i18nLanguage || isUpdatingRef.current) {
			return;
		}

		setIsLoading(true);

		try {
			isUpdatingRef.current = true;
			await i18nChangeLanguage(storedLanguage);

			const syncKey = `${storedLanguage}-${i18nLanguage}`;
			lastSyncRef.current = syncKey;

			console.log(`Manual sync completed: ${storedLanguage}`);
		} catch (err) {
			console.error('Failed to sync language from backend:', err);
			setError('Failed to sync language from backend');
		} finally {
			setIsLoading(false);
			isUpdatingRef.current = false;
		}
	}, [storedLanguage, i18nLanguage, i18nChangeLanguage]);

	// Clear error state
	const clearError = useCallback(() => {
		setError(null);
		setLastOperationSuccess(null);
	}, []);

	// Reset all operation states
	const resetOperationState = useCallback(() => {
		setIsLoading(false);
		setError(null);
		setLastOperationSuccess(null);
	}, []);

	// Memoized language options
	const languageOptions = useMemo(() => {
		const options = [
			{ value: 'en-US' as const, label: t('settings.language.english') },
			{ value: 'zh-CN' as const, label: t('settings.language.chinese') }
		];

		return options.map(option => ({
			...option,
			isSelected: option.value === i18nLanguage,
			isStored: option.value === storedLanguage
		}));
	}, [t, i18nLanguage, storedLanguage]);

	return {
		// State
		currentLanguage: i18nLanguage,
		storedLanguage,
		isInSync,
		isLoading,
		error,
		lastOperationSuccess,

		// Actions
		changeLanguage,
		syncFromBackend,
		clearError,
		resetOperationState,

		// Computed properties
		languageOptions
	};
};

/**
 * Default export for backward compatibility
 */
export default useLanguageSettings;