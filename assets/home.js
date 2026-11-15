// home.js — главная: кнопка аккаунта и цены Премиума из базы.
// Цены на странице только для показа: сумму оплаты считает сервер по той же
// таблице plans, поэтому подмена цифр в браузере ничего не даёт.

import { configured, selectPublic } from './sb.js';
import { $, byn, wireHeader } from './ui.js';

wireHeader();

/** Карточки тарифов; выгода года считается от цены месяца. */
function renderPlans(box, plans) {
  box.textContent = '';
  const month = plans.find((p) => p.id === 'month');
  for (const p of plans) {
    const card = document.createElement('div');
    card.className = 'card plan' + (p.id === 'year' ? ' best' : '');

    if (p.id === 'year' && month) {
      const full = Number(month.amount_byn) * Number(p.months);
      const save = Math.round((1 - Number(p.amount_byn) / full) * 100);
      if (save > 0) {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = '−' + save + '%';
        card.append(tag);
      }
    }

    const h = document.createElement('h3');
    h.textContent = p.title;
    const price = document.createElement('div');
    price.className = 'price';
    const b = document.createElement('b');
    b.textContent = byn(p.amount_byn);
    const cur = document.createElement('span');
    cur.textContent = 'BYN';
    price.append(b, cur);
    const note = document.createElement('p');
    note.className = 'plan-note';
    note.textContent = Number(p.months) > 1
      ? '≈ ' + byn(Number(p.amount_byn) / Number(p.months)) + ' BYN в месяц'
      : 'разовая оплата';
    const go = document.createElement('a');
    go.className = 'btn btn-block mt16 ' + (p.id === 'year' ? 'btn-primary' : 'btn-ghost');
    go.href = 'account/?plan=' + encodeURIComponent(p.id);
    go.textContent = 'Выбрать';
    card.append(h, price, note, go);
    box.append(card);
  }
}

async function loadPlans() {
  const box = $('plans');
  if (!box) return;
  if (!configured) {
    box.hidden = true;
    return;
  }
  try {
    const plans = await selectPublic('plans', 'select=id,title,amount_byn,months&order=sort.asc');
    if (!Array.isArray(plans) || plans.length === 0) throw new Error('empty');
    renderPlans(box, plans);
  } catch {
    box.textContent = '';
    const p = document.createElement('p');
    p.className = 'plans-loading';
    p.textContent = 'Не получилось загрузить цены. Обнови страницу чуть позже.';
    box.append(p);
  }
}

loadPlans();
