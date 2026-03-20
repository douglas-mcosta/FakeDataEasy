/**
 * Ícones ao lado do campo focado (IDEIAS §1, §3).
 * Só é injectado nas origens da lista permitida — independente dos atalhos globais.
 */
import { CNPJ } from '../lib/cnpj';
import { CPF } from '../lib/cpf';
import { gerarCep } from '../lib/cep';
import { gerarDataIsoAleatoria } from '../lib/data-fake';
import { gerarEmailFake } from '../lib/email';
import { inferAutoForField } from '../lib/field-heuristics';
import { gerarGuid } from '../lib/guid';
import { gerarNome, gerarNomeCompleto } from '../lib/nome';
import { gerarTelefoneCelularBR } from '../lib/telefone-br';
import {
  getSelectorOverrides,
  type OverrideKind,
  pageUrlMatchesPattern,
  SELECTOR_OVERRIDES_KEY,
  type SelectorOverrideRule,
} from '../lib/storage-field-helper';

const HOST_ID = 'fde-field-helper-host';

/** Sincronizado com `service-worker`: `executeScript` não pode fechar sobre imports. */
const OPEN_CHOOSE_MENU_EVENT = 'fde-open-choose-menu';

let selectorRules: SelectorOverrideRule[] = [];

void getSelectorOverrides().then((r) => {
  selectorRules = r;
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes[SELECTOR_OVERRIDES_KEY]) {
    void getSelectorOverrides().then((rules) => {
      selectorRules = rules;
    });
  }
});

function effectiveOverrideKind(el: HTMLInputElement | HTMLTextAreaElement): OverrideKind | null {
  const url = location.href;
  for (const rule of selectorRules) {
    try {
      if (!pageUrlMatchesPattern(url, rule.pattern)) continue;
      if (el.matches(rule.selector)) return rule.kind;
    } catch {
      /* selector inválido */
    }
  }
  return null;
}

function isFillable(el: EventTarget | null): el is HTMLInputElement | HTMLTextAreaElement {
  if (!el || !(el instanceof HTMLElement)) return false;
  if (el instanceof HTMLTextAreaElement) return true;
  if (el instanceof HTMLInputElement) {
    const t = (el.type || 'text').toLowerCase();
    return new Set(['text', 'email', 'tel', 'search', 'url', 'number', 'password']).has(t);
  }
  return false;
}

function setFieldValue(el: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  el.focus();
  el.value = value;
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

function valueForGen(kind: string): string | null {
  switch (kind) {
    case 'cpf':
      return CPF.gerarSemPontos();
    case 'cnpj':
      return CNPJ.gerarSemPontos();
    case 'nome':
      return gerarNome();
    case 'nome_completo':
      return gerarNomeCompleto(Math.random() < 0.5);
    case 'email':
      return gerarEmailFake();
    case 'guid':
      return gerarGuid();
    case 'tel':
      return gerarTelefoneCelularBR();
    case 'cep':
      return gerarCep();
    case 'data':
      return gerarDataIsoAleatoria();
    default:
      return null;
  }
}

let activeEl: HTMLInputElement | HTMLTextAreaElement | null = null;
let bar: HTMLElement | null = null;
let menu: HTMLElement | null = null;
let hint: HTMLElement | null = null;
let shadow: ShadowRoot | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

function cancelHide(): void {
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
}

function scheduleHide(): void {
  cancelHide();
  hideTimer = setTimeout(() => {
    if (bar) bar.style.display = 'none';
    if (menu) menu.style.display = 'none';
    if (hint) hint.style.display = 'none';
    activeEl = null;
  }, 220);
}

function positionMenuBelowBar(): void {
  if (!menu || !bar) return;
  const br = bar.getBoundingClientRect();
  menu.style.top = `${br.bottom + 2}px`;
  menu.style.left = `${br.left}px`;
}

function openChooseMenu(): void {
  const el = document.activeElement;
  if (!isFillable(el)) return;
  showFor(el);
  if (!menu || !bar) return;
  menu.style.display = 'block';
  positionMenuBelowBar();
  cancelHide();
}

function positionBar(target: HTMLElement): void {
  if (!bar) return;
  const r = target.getBoundingClientRect();
  const top = r.bottom + 4;
  const left = Math.max(4, r.right - 148);
  bar.style.top = `${top}px`;
  bar.style.left = `${left}px`;
  if (hint && hint.style.display === 'block') {
    const bh = bar.getBoundingClientRect().height;
    hint.style.top = `${top + bh + 4}px`;
    hint.style.left = `${left}px`;
  }
}

function showHint(msg: string): void {
  if (!hint) return;
  hint.textContent = msg;
  hint.style.display = msg ? 'block' : 'none';
  if (activeEl && bar) positionBar(activeEl);
}

function showFor(target: HTMLInputElement | HTMLTextAreaElement): void {
  activeEl = target;
  if (!bar || !menu || !shadow) return;
  cancelHide();
  showHint('');
  bar.style.display = 'flex';
  menu.style.display = 'none';
  positionBar(target);
}

function initUi(): void {
  let host = document.getElementById(HOST_ID);
  if (!host) {
    host = document.createElement('div');
    host.id = HOST_ID;
    document.documentElement.appendChild(host);
  }
  if (host.shadowRoot) {
    shadow = host.shadowRoot;
    bar = shadow.querySelector('.bar');
    menu = shadow.querySelector('.menu');
    hint = shadow.querySelector('.hint');
    return;
  }
  shadow = host.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  style.textContent = `
    .bar {
      position: fixed;
      z-index: 2147483646;
      display: none;
      flex-direction: row;
      align-items: center;
      gap: 6px;
      background: #2d2d30;
      border: 1px solid #5f6368;
      border-radius: 6px;
      padding: 4px 6px;
      box-shadow: 0 2px 8px rgba(0,0,0,.35);
      font-family: system-ui, Segoe UI, Roboto, sans-serif;
    }
    .bar button.auto,
    .bar button.pick {
      cursor: pointer;
      border: 1px solid #5f6368;
      background: #3c4043;
      color: #e8eaed;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      padding: 5px 10px;
      line-height: 1.2;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
    .bar button.auto .ico,
    .bar button.pick .ico {
      flex-shrink: 0;
      display: block;
      opacity: 0.95;
    }
    .bar button.auto {
      border-color: #1a73e8;
      background: rgba(26, 115, 232, 0.25);
      color: #8ab4f8;
    }
    .bar button.pick {
      border-color: #5f6368;
    }
    .bar button.auto:hover, .bar button.pick:hover { filter: brightness(1.12); }
    .hint {
      position: fixed;
      z-index: 2147483645;
      display: none;
      max-width: 260px;
      font-size: 11px;
      color: #fde293;
      background: rgba(32, 33, 36, 0.95);
      border: 1px solid #5f6368;
      border-radius: 4px;
      padding: 6px 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,.3);
    }
    .menu {
      position: fixed;
      z-index: 2147483647;
      display: none;
      min-width: 160px;
      background: #2d2d30;
      border: 1px solid #5f6368;
      border-radius: 6px;
      padding: 4px 0;
      box-shadow: 0 4px 12px rgba(0,0,0,.4);
      font-family: system-ui, Segoe UI, Roboto, sans-serif;
    }
    .menu button.row {
      display: block;
      width: 100%;
      height: auto;
      text-align: left;
      padding: 7px 12px;
      border: none;
      border-radius: 0;
      font-size: 13px;
      cursor: pointer;
      background: transparent;
      color: #e8eaed;
    }
    .menu button.row:hover { background: #1a73e8; color: #fff; }
  `;
  shadow.appendChild(style);

  bar = document.createElement('div');
  bar.className = 'bar';
  const btnAuto = document.createElement('button');
  btnAuto.type = 'button';
  btnAuto.className = 'auto';
  btnAuto.innerHTML =
    '<svg class="ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' +
    '<span>Auto</span>';
  btnAuto.title =
    'Automático: tenta reconhecer o tipo de campo (e-mail, CPF, telefone, etc.) e preenche.';
  btnAuto.setAttribute('aria-label', 'Gerar dado automático conforme o campo');
  btnAuto.dataset.act = 'auto';

  const btnPick = document.createElement('button');
  btnPick.type = 'button';
  btnPick.className = 'pick';
  btnPick.innerHTML =
    '<svg class="ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>' +
    '<span>Escolher</span>';
  btnPick.title = 'Escolher manualmente o tipo de dado (CPF, nome, e-mail…).';
  btnPick.setAttribute('aria-label', 'Escolher tipo de dado');
  btnPick.dataset.act = 'menu';

  bar.appendChild(btnAuto);
  bar.appendChild(btnPick);

  hint = document.createElement('div');
  hint.className = 'hint';
  hint.setAttribute('role', 'status');

  menu = document.createElement('div');
  menu.className = 'menu';
  const items: [string, string][] = [
    ['cpf', 'CPF'],
    ['cnpj', 'CNPJ'],
    ['nome', 'Nome'],
    ['nome_completo', 'Nome completo'],
    ['email', 'E-mail'],
    ['tel', 'Telefone (BR)'],
    ['cep', 'CEP'],
    ['data', 'Data (ISO)'],
    ['guid', 'GUID'],
  ];
  for (const [gen, label] of items) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'row';
    b.textContent = label;
    b.dataset.gen = gen;
    menu.appendChild(b);
  }

  shadow.appendChild(bar);
  shadow.appendChild(hint);
  shadow.appendChild(menu);

  bar.addEventListener('pointerdown', (e) => e.preventDefault());
  menu.addEventListener('pointerdown', (e) => e.preventDefault());

  bar.addEventListener('mouseenter', cancelHide);
  menu.addEventListener('mouseenter', cancelHide);
  hint.addEventListener('mouseenter', cancelHide);
  bar.addEventListener('mouseleave', scheduleHide);
  menu.addEventListener('mouseleave', scheduleHide);
  hint.addEventListener('mouseleave', scheduleHide);

  bar.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest('button[data-act]') as HTMLElement | null;
    if (!t || !activeEl) return;
    const act = t.dataset.act;
    if (act === 'auto') {
      const ov = effectiveOverrideKind(activeEl);
      if (ov) {
        const v = valueForGen(ov);
        if (v) {
          setFieldValue(activeEl, v);
          showHint('Tipo definido pela regra de selector nas opções.');
          cancelHide();
          window.setTimeout(scheduleHide, 2800);
        }
      } else {
        const r = inferAutoForField(activeEl);
        setFieldValue(activeEl, r.value);
        if (r.ambiguous) {
          showHint(`${r.kindLabel}. Se não for o pretendido, use «Escolher».`);
          cancelHide();
          window.setTimeout(scheduleHide, 3200);
        } else {
          showHint('');
          scheduleHide();
        }
      }
    } else if (act === 'menu') {
      const open = menu!.style.display === 'block';
      menu!.style.display = open ? 'none' : 'block';
      if (!open) positionMenuBelowBar();
    }
  });

  menu.addEventListener('click', (e) => {
    const bEl = (e.target as HTMLElement).closest('[data-gen]') as HTMLElement | null;
    if (!bEl || !activeEl) return;
    const kind = bEl.dataset.gen || '';
    const v = valueForGen(kind);
    if (v) setFieldValue(activeEl, v);
    menu!.style.display = 'none';
    showHint('');
    scheduleHide();
  });
}

initUi();

document.addEventListener(
  'focusin',
  (e) => {
    if (!isFillable(e.target)) return;
    showFor(e.target);
  },
  true,
);

document.addEventListener(
  'scroll',
  () => {
    if (activeEl && bar && bar.style.display !== 'none') {
      positionBar(activeEl);
      if (menu && menu.style.display === 'block') positionMenuBelowBar();
    }
  },
  true,
);

window.addEventListener('resize', () => {
  if (activeEl && bar && bar.style.display !== 'none') {
    positionBar(activeEl);
    if (menu && menu.style.display === 'block') positionMenuBelowBar();
  }
});

document.addEventListener(
  OPEN_CHOOSE_MENU_EVENT,
  () => {
    openChooseMenu();
  },
  false,
);

document.addEventListener(
  'keydown',
  (e) => {
    if (!e.altKey || !e.shiftKey) return;
    if (e.key !== 'e' && e.key !== 'E') return;
    e.preventDefault();
    openChooseMenu();
  },
  true,
);
