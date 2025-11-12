/*--------------------------------------------------------------------------------------
 *  Copyright 2025 Glass Devtools, Inc. All rights reserved.
 *  Licensed under the Apache License, Version 2.0. See LICENSE.txt for more information.
 *--------------------------------------------------------------------------------------*/

import { useEffect, useState } from 'react';
import { i18nService } from '../../../../common/i18n/i18nService.js';

export type SupportedLanguage = 'en-US' | 'zh-CN';

/**
 * React Hook for internationalization
 */
export const useI18n = () => {
	const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(i18nService.currentLanguage);

	useEffect(() => {
		// Subscribe to language changes
		const dispose = i18nService.onDidChangeLanguage((newLanguage: SupportedLanguage) => {
			setCurrentLanguage(newLanguage);
		});

		return dispose;
	}, []);

	const t = (key: string, defaultValue?: string): string => {
		return i18nService.t(key, defaultValue);
	};

	const changeLanguage = async (language: SupportedLanguage): Promise<void> => {
		await i18nService.changeLanguage(language);
	};

	return {
		t,
		changeLanguage,
		currentLanguage,
	};
};

/**
 * Language options for UI components
 */
export const LANGUAGE_OPTIONS = [
	{ value: 'en-US', label: 'English' },
	{ value: 'zh-CN', label: '简体中文' },
] as const;

/**
 * Hook for language selection in settings
 */
export const useLanguageSettings = () => {
	const { t, changeLanguage, currentLanguage } = useI18n();

	const languageOptions = LANGUAGE_OPTIONS.map(option => ({
		value: option.value,
		label: t(`settings.languageOptions.${option.value}`, option.label)
	}));

	const changeLanguageSetting = async (newLanguage: SupportedLanguage): Promise<void> => {
		await changeLanguage(newLanguage);
	};

	return {
		languageOptions,
		setLanguage: changeLanguageSetting,
		currentLanguage,
		t,
	};
};
