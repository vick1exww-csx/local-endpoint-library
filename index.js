import { saveSettingsDebounced } from '../../../../script.js';
import { extension_settings } from '../../../extensions.js';
import { callGenericPopup, POPUP_TYPE } from '../../../popup.js';

const SETTINGS_KEY = 'local_endpoint_library';

function entries() {
    extension_settings[SETTINGS_KEY] ??= { entries: [] };
    return extension_settings[SETTINGS_KEY].entries;
}

function validUrl(value) {
    try {
        const url = new URL(value);
        return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password;
    } catch {
        return false;
    }
}

function init() {
    const input = document.getElementById('custom_api_url_text');
    if (!input || document.getElementById('local-endpoint-library')) return;

    const panel = document.createElement('div');
    panel.id = 'local-endpoint-library';
    const select = document.createElement('select');
    select.className = 'text_pole';
    select.setAttribute('aria-label', '已保存的 API 地址');
    select.title = '只切换地址；密钥和模型保持当前选择';
    const save = document.createElement('button');
    save.type = 'button';
    save.className = 'menu_button';
    save.textContent = '保存当前地址';
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'menu_button';
    remove.textContent = '移除';
    panel.append(select, save, remove);
    input.insertAdjacentElement('afterend', panel);

    function sync() {
        const current = input.value.trim();
        const selected = entries().findIndex(entry => entry.url === current);
        select.value = selected < 0 ? '' : String(selected);
        remove.disabled = selected < 0;
    }

    function render() {
        select.replaceChildren(new Option('选择已保存的地址…', ''));
        entries().forEach((entry, index) => {
            select.add(new Option(`${entry.name} — ${entry.url}`, String(index)));
        });
        sync();
    }

    select.addEventListener('change', () => {
        if (select.value === '') return;
        const entry = entries()[Number(select.value)];
        if (!entry || !validUrl(entry.url)) return;
        input.value = entry.url;
        // Use the normal SillyTavern handler to persist the active endpoint.
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        sync();
    });

    save.addEventListener('click', async () => {
        const url = input.value.trim();
        if (!validUrl(url)) {
            toastr.warning('请输入有效的 http:// 或 https:// API 地址（不要包含账号密码）。');
            return;
        }
        const existing = entries().find(entry => entry.url === url);
        const name = await callGenericPopup('给这个 API 地址起个名字', POPUP_TYPE.INPUT,
            existing?.name ?? new URL(url).host);
        if (typeof name !== 'string' || !name.trim()) return;
        if (existing) existing.name = name.trim();
        else entries().push({ name: name.trim(), url });
        saveSettingsDebounced();
        render();
        toastr.success('API 地址已保存到本地酒馆设置');
    });

    remove.addEventListener('click', () => {
        if (select.value === '') return;
        const index = Number(select.value);
        if (!entries()[index]) return;
        const [removed] = entries().splice(index, 1);
        saveSettingsDebounced();
        render();
        toastr.info('已从地址簿移除，当前输入的地址保持不变', '', {
            timeOut: 10000,
            closeButton: true,
            onclick: () => {
                if (!entries().some(entry => entry.url === removed.url)) {
                    entries().splice(Math.min(index, entries().length), 0, removed);
                    saveSettingsDebounced();
                    render();
                }
            },
        });
    });

    input.addEventListener('input', sync);
    input.addEventListener('change', sync);
    // Profile switching can update the native field programmatically.
    panel.addEventListener('pointerenter', sync);
    select.addEventListener('focus', sync);
    render();
}

jQuery(init);
