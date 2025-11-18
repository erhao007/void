# Language Settings Persistence Fix - Design

## Overview

本文档描述了修复Void语言设置持久化问题的技术设计方案。该方案基于现有的VoidSettingsService架构，通过改进language参数的保存和读取逻辑来确保用户语言设置在应用重启后正确保持。

## Architecture Analysis

### Current System Architecture

```mermaid
graph TD
    A[LanguageSettings UI Component] --> B[VoidSettingsService]
    B --> C[I18nService]
    B --> D[Encrypted Storage]
    D --> E[Application Scope Storage]

    F[App Startup] --> B
    F --> C
    B --> G[GlobalSettings]
    G --> H[language: 'zh-CN' | 'en-US']
```

### Problem Areas Identified

1. **Storage Timing**: language参数可能在I18nService初始化之后才被读取
2. **State Synchronization**: UI状态与实际保存的设置不同步
3. **Initialization Order**: 服务初始化顺序导致设置丢失

## Solution Design

### 1. Enhanced Service Integration

#### 1.1 VoidSettingsService Improvements

**File**: `src/vs/workbench/contrib/void/common/voidSettingsService.ts`

```typescript
class VoidSettingsService extends Disposable implements IVoidSettingsService {
    private _onDidChangeLanguage = new Emitter<SupportedLanguage>();
    readonly onDidChangeLanguage = this._onDidChangeLanguage.event;

    constructor(
        @IStorageService private readonly _storageService: IStorageService,
        @IEncryptionService private readonly _encryptionService: IEncryptionService,
        @IMetricsService private readonly _metricsService: IMetricsService,
        @II18nService private readonly _i18nService: I18nService, // 添加I18nService依赖
    ) {
        super()
        this.state = defaultState()

        // 立即初始化语言设置
        this._initializeLanguageFromStorage()
    }

    private async _initializeLanguageFromStorage(): Promise<void> {
        try {
            const savedState = await this._readState();
            const savedLanguage = savedState.globalSettings.language;

            if (savedLanguage && savedLanguage !== this._i18nService.getCurrentLanguage()) {
                await this._i18nService.changeLanguage(savedLanguage);
            }
        } catch (error) {
            console.warn('Failed to initialize language from storage:', error);
        }
    }

    setGlobalSetting: SetGlobalSettingFn = async (settingName, newVal) => {
        const oldVal = this.state.globalSettings[settingName as keyof GlobalSettings];

        const newState: VoidSettingsState = {
            ...this.state,
            globalSettings: {
                ...this.state.globalSettings,
                [settingName]: newVal
            }
        }

        this.state = _validatedModelState(newState)
        await this._storeState()
        this._onDidChangeState.fire()

        // 特殊处理语言设置变更
        if (settingName === 'language' && oldVal !== newVal) {
            await this._handleLanguageChange(newVal as SupportedLanguage);
        }
    }

    private async _handleLanguageChange(newLanguage: SupportedLanguage): Promise<void> {
        try {
            await this._i18nService.changeLanguage(newLanguage);
            this._onDidChangeLanguage.fire(newLanguage);

            // 记录语言变更事件
            this._metricsService.track('language_changed', {
                from: this._i18nService.getCurrentLanguage(),
                to: newLanguage
            });
        } catch (error) {
            console.error('Failed to change language:', error);
            // 回滚设置
            await this.setGlobalSetting('language', this._i18nService.getCurrentLanguage());
        }
    }
}
```

#### 1.2 I18nService Enhancement

**File**: `src/vs/workbench/contrib/void/common/i18n/i18nService.ts`

```typescript
class I18nServiceImpl implements I18nService {
    private _currentLanguage: SupportedLanguage = 'en-US';
    private _onDidChangeLanguage = new Emitter<SupportedLanguage>();
    private _isInitialized = false;

    async initialize(): Promise<void> {
        if (this._isInitialized) return;

        // 加载默认语言包
        await this.loadTranslations(this._currentLanguage);
        this._isInitialized = true;
    }

    async changeLanguage(language: SupportedLanguage): Promise<void> {
        if (this._currentLanguage === language) return;

        try {
            await this.loadTranslations(language);
            const oldLanguage = this._currentLanguage;
            this._currentLanguage = language;
            this._onDidChangeLanguage.fire(language);

            // 记录语言变更
            console.log(`Language changed from ${oldLanguage} to ${language}`);
        } catch (error) {
            console.error(`Failed to change language to ${language}:`, error);
            throw error;
        }
    }

    getCurrentLanguage(): SupportedLanguage {
        return this._currentLanguage;
    }

    // 提供同步设置语言的方法（用于初始化）
    _setCurrentLanguage(language: SupportedLanguage): void {
        if (!this._isInitialized) {
            this._currentLanguage = language;
        }
    }
}
```

### 2. UI Component Enhancements

#### 2.1 LanguageSettings Component

**File**: `src/vs/workbench/contrib/void/browser/react/src/void-settings-tsx/Settings.tsx`

```typescript
export const LanguageSettings = () => {
    const { t } = useI18n();
    const { currentLanguage, setLanguage } = useLanguageSettings();
    const accessor = useAccessor();
    const voidSettingsService = accessor.get('IVoidSettingsService');
    const [isChanging, setIsChanging] = useState(false);
    const [changeStatus, setChangeStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // 监听语言设置变更事件
    useEffect(() => {
        const disposable = voidSettingsService.onDidChangeLanguage((newLanguage) => {
            setLanguage(newLanguage);
            setChangeStatus('success');
            setTimeout(() => setChangeStatus('idle'), 2000);
        });

        return () => disposable.dispose();
    }, [voidSettingsService, setLanguage]);

    // 确保UI状态与服务状态同步
    useEffect(() => {
        const serviceLanguage = voidSettingsService.getGlobalSetting('language');
        if (serviceLanguage && serviceLanguage !== currentLanguage) {
            setLanguage(serviceLanguage);
        }
    }, [currentLanguage, setLanguage, voidSettingsService]);

    const handleLanguageChange = useCallback(async (newLanguage: 'zh-CN' | 'en-US') => {
        if (newLanguage === currentLanguage || isChanging) return;

        setIsChanging(true);
        try {
            await voidSettingsService.setGlobalSetting('language', newLanguage);
            // 成功状态由事件监听器处理
        } catch (error) {
            console.error('Failed to change language:', error);
            setChangeStatus('error');
            setTimeout(() => setChangeStatus('idle'), 3000);
        } finally {
            setIsChanging(false);
        }
    }, [currentLanguage, isChanging, voidSettingsService]);

    const languageOptions = [
        { value: 'en-US' as const, label: t('settings.language.english') },
        { value: 'zh-CN' as const, label: t('settings.language.chinese') }
    ];

    return (
        <div className='flex flex-col gap-4'>
            <div className='max-w-48 w-full'>
                <VoidCustomDropdownBox
                    options={languageOptions}
                    selectedOption={languageOptions.find(option => option.value === currentLanguage)}
                    onChangeOption={(option) => option && handleLanguageChange(option.value)}
                    disabled={isChanging}
                />
            </div>

            {/* 状态反馈 */}
            <div className='text-sm'>
                {isChanging && (
                    <div className='text-blue-500'>
                        {t('settings.language.changing')}
                    </div>
                )}
                {changeStatus === 'success' && (
                    <div className='text-green-500'>
                        {t('settings.language.changeSuccess')}
                    </div>
                )}
                {changeStatus === 'error' && (
                    <div className='text-red-500'>
                        {t('settings.language.changeError')}
                    </div>
                )}
            </div>

            <div className='text-void-fg-3 text-xs mt-2'>
                {t('settings.language.restartNote')}
            </div>
        </div>
    );
};
```

#### 2.2 useLanguageSettings Hook

**File**: `src/vs/workbench/contrib/void/browser/react/src/hooks/useLanguageSettings.ts`

```typescript
export const useLanguageSettings = () => {
    const { t, changeLanguage, currentLanguage } = useI18n();
    const settingsState = useSettingsState();
    const accessor = useAccessor();
    const voidSettingsService = accessor.get('IVoidSettingsService');

    // 同步设置服务中的语言
    useEffect(() => {
        const savedLanguage = settingsState.globalSettings.language;
        if (savedLanguage && savedLanguage !== currentLanguage) {
            changeLanguage(savedLanguage);
        }
    }, [settingsState.globalSettings.language, currentLanguage, changeLanguage]);

    const setLanguage = useCallback(async (newLanguage: SupportedLanguage) => {
        try {
            await changeLanguage(newLanguage);
            await voidSettingsService.setGlobalSetting('language', newLanguage);
        } catch (error) {
            console.error('Failed to set language:', error);
        }
    }, [changeLanguage, voidSettingsService]);

    return {
        currentLanguage,
        setLanguage,
        t
    };
};
```

### 3. Service Registration and Dependencies

#### 3.1 Dependency Injection Updates

**File**: `src/vs/workbench/contrib/void/common/void.contribution.ts`

```typescript
// 确保I18nService在VoidSettingsService之前注册
registerSingleton(II18nService, I18nService, InstantiationType.Eager);
registerSingleton(IVoidSettingsService, VoidSettingsService, InstantiationType.Eager);
```

#### 3.2 Service Initialization Sequence

```typescript
// 在应用启动时按正确顺序初始化服务
async function initializeServices() {
    // 1. 首先初始化存储和加密服务
    await storageService.initialize();

    // 2. 初始化I18nService（使用默认语言）
    const i18nService = serviceAccessor.get(II18nService);
    await i18nService.initialize();

    // 3. 初始化VoidSettingsService（会自动从存储中读取语言设置）
    const voidSettingsService = serviceAccessor.get(IVoidSettingsService);
    await voidSettingsService.readAndInitializeState();

    // 4. 其他服务...
}
```

### 4. Error Handling and Validation

#### 4.1 Language Validation

```typescript
function validateLanguageSetting(value: any): SupportedLanguage {
    const validLanguages: SupportedLanguage[] = ['zh-CN', 'en-US'];

    if (typeof value === 'string' && validLanguages.includes(value as SupportedLanguage)) {
        return value as SupportedLanguage;
    }

    console.warn(`Invalid language setting: ${value}, falling back to default`);
    return 'en-US';
}
```

#### 4.2 Error Recovery Strategy

```typescript
private async _handleStorageError(error: Error): Promise<void> {
    console.error('Settings storage error:', error);

    // 尝试使用默认设置重新初始化
    this.state = defaultState();
    await this._storeState();

    // 通知用户
    this._notificationService.warn(
        'Settings have been reset due to a storage error. Please reconfigure your preferences.'
    );
}
```

### 5. Testing Strategy

#### 5.1 Unit Tests

```typescript
describe('VoidSettingsService Language Settings', () => {
    it('should persist language setting to storage', async () => {
        const service = createTestService();
        await service.setGlobalSetting('language', 'zh-CN');

        const savedLanguage = service.getGlobalSetting('language');
        expect(savedLanguage).toBe('zh-CN');
    });

    it('should restore language setting on restart', async () => {
        // 模拟应用重启场景
        const storage = new MockStorageService();

        // 第一次运行：保存语言设置
        let service1 = new VoidSettingsService(storage, encryptionService, metricsService, i18nService);
        await service1.setGlobalSetting('language', 'zh-CN');

        // 第二次运行：验证语言设置被还原
        let service2 = new VoidSettingsService(storage, encryptionService, metricsService, i18nService);
        await service2.readAndInitializeState();

        expect(service2.getGlobalSetting('language')).toBe('zh-CN');
    });
});
```

#### 5.2 Integration Tests

```typescript
describe('Language Settings Integration', () => {
    it('should sync UI with service state', async () => {
        const { render } = renderWithProviders(<LanguageSettings />);

        // 模拟服务中的语言设置变更
        const service = getService(IVoidSettingsService);
        await service.setGlobalSetting('language', 'zh-CN');

        // 验证UI更新
        await waitFor(() => {
            expect(screen.getByText('中文')).toBeInTheDocument();
        });
    });
});
```

## Implementation Phases

### Phase 1: Service Layer Fixes
1. 修改VoidSettingsService构造函数，添加I18nService依赖
2. 实现语言设置变更的特殊处理逻辑
3. 添加语言变更事件通知机制

### Phase 2: UI Component Updates
1. 更新LanguageSettings组件，添加状态同步
2. 实现语言变更反馈机制
3. 改进错误处理和用户体验

### Phase 3: Service Registration
1. 确保正确的服务初始化顺序
2. 添加依赖注入配置
3. 实现优雅的服务启动流程

### Phase 4: Testing and Validation
1. 编写单元测试覆盖所有场景
2. 实现集成测试验证端到端流程
3. 进行用户接受测试

## Risk Assessment

### Technical Risks
- **Low**: 修改现有服务可能影响其他功能
- **Mitigation**: 保持API兼容性，添加充分的测试

### User Experience Risks
- **Medium**: 语言切换可能需要重启应用
- **Mitigation**: 清晰的用户提示和状态反馈

### Performance Risks
- **Low**: 额外的语言检查可能影响启动性能
- **Mitigation**: 异步加载和缓存机制

## Success Criteria

1. **Functional**: 语言设置在应用重启后正确保持
2. **Performance**: 语言设置操作响应时间<100ms
3. **Reliability**: 99.9%的设置保存成功率
4. **User Experience**: 清晰的状态反馈和错误处理
5. **Compatibility**: 不破坏现有功能和API

## Monitoring and Metrics

### Key Performance Indicators
- 语言设置保存成功率
- 应用启动时语言设置还原时间
- 用户语言切换操作频率
- 错误报告和异常情况

### Logging Strategy
- 语言变更操作日志
- 设置读取/写入错误日志
- 服务初始化时序日志
- 用户操作统计日志

这个设计方案确保了语言设置的持久化功能，同时保持了系统的稳定性和性能。通过分阶段实施和充分的测试，可以最小化风险并提供可靠的用户体验。