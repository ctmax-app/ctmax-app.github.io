// ui.js — общее для всех страниц: кнопка аккаунта в шапке, форматирование
// сумм и дат, мелкие помощники для DOM. Текст в разметку попадает только
// через textContent: innerHTML на сайте не используется (CSP запрещает его
// для строк через Trusted Types).

import { configured, currentUser, onAuthChange } from './sb.js';

// Страницу нельзя показывать внутри чужой рамки (защита от кликджекинга).
// Хостинг с заголовками закрывает это через frame-ancestors; здесь —
// запасной вариант для хостинга без своих заголовков (GitHub Pages).
if (window.top !== window.self) {
  document.documentElement.hidden = true;
}

export const $ = (id) => document.getElementById(id);

export function show(el, on = true) {
  if (el) el.hidden = !on;
}

export function text(el, value) {
  if (el) el.textContent = value == null ? '' : String(value);
}

/** 19.9 → «19,90». */
export function byn(n) {
  return Number(n).toFixed(2).replace('.', ',');
}

/** ISO-дата → «6 октября 2026». */
export function day(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function initial(user) {
  const s = (user && (user.name || user.email)) || '?';
  return s.trim().charAt(0).toUpperCase() || '?';
}

/** Кнопка «Войти» в шапке превращается в «Аккаунт», когда вход есть. */
export function wireHeader() {
  const link = $('accLink');
  if (!link || !configured) return;
  const paint = (user) => {
    link.textContent = '';
    if (user) {
      link.className = 'acc-chip';
      const av = document.createElement('span');
      av.className = 'av';
      av.textContent = initial(user);
      const nm = document.createElement('span');
      nm.className = 'nm';
      nm.textContent = user.name || 'Аккаунт';
      link.append(av, nm);
      link.setAttribute('aria-label', 'Аккаунт');
    } else {
      link.className = 'btn btn-sm btn-ghost';
      link.textContent = 'Войти';
      link.removeAttribute('aria-label');
    }
  };
  paint(currentUser());
  onAuthChange(paint);
}
