/**
 * Inferência do tipo de dado pelo contexto do campo (plano IDEIAS §2).
 * Ordem: mais específicos primeiro. Fallback ambíguo → nome com `ambiguous: true`.
 */
import { CNPJ } from './cnpj';
import { CPF } from './cpf';
import { gerarDataIsoAleatoria } from './data-fake';
import { gerarEmailFake } from './email';
import { gerarGuid } from './guid';
import { gerarNome } from './nome';
import { gerarTelefoneCelularBR } from './telefone-br';
import { onlyNumbers } from './string-utils';

function blobText(el: HTMLElement): string {
  return `${el.getAttribute('name') ?? ''} ${el.id} ${el.getAttribute('aria-label') ?? ''} ${el.getAttribute('class') ?? ''}`.toLowerCase();
}

function placeholderLower(el: HTMLElement): string {
  return (el.getAttribute('placeholder') || '').toLowerCase();
}

export type InferAutoResult = {
  value: string;
  ambiguous: boolean;
  kindLabel: string;
};

export function inferAutoForField(el: HTMLInputElement | HTMLTextAreaElement): InferAutoResult {
  const input = el instanceof HTMLInputElement ? el : null;
  const type = (input?.type || 'text').toLowerCase();
  const inputmode = (input?.getAttribute('inputmode') || '').toLowerCase();
  const ac = (el.getAttribute('autocomplete') || '').toLowerCase();
  const blob = blobText(el);
  const ph = placeholderLower(el);
  const maxLen = input && input.maxLength > 0 ? input.maxLength : null;

  const hit = (...words: string[]) => words.some((w) => blob.includes(w) || ph.includes(w));

  // GUID / UUID
  if (hit('guid', 'uuid')) {
    return { value: gerarGuid(), ambiguous: false, kindLabel: 'GUID' };
  }

  // CNPJ (14 dígitos ou máscara ~18; ou palavra-chave explícita)
  if (hit('cnpj') || maxLen === 14 || maxLen === 18) {
    return { value: CNPJ.gerarSemPontos(), ambiguous: false, kindLabel: 'CNPJ' };
  }

  // CPF
  if (hit('cpf') && !hit('cnpj')) {
    return { value: CPF.gerarSemPontos(), ambiguous: false, kindLabel: 'CPF' };
  }

  if (maxLen === 11 && (inputmode === 'numeric' || inputmode === 'decimal')) {
    if (el.value === '' || onlyNumbers(el.value).length <= 11) {
      return { value: CPF.gerarSemPontos(), ambiguous: true, kindLabel: 'CPF (11 dígitos?)' };
    }
  }

  // E-mail
  if (
    type === 'email' ||
    inputmode === 'email' ||
    ac.includes('email') ||
    hit('e-mail', 'email', 'correio') ||
    ph.includes('@')
  ) {
    return { value: gerarEmailFake(), ambiguous: false, kindLabel: 'E-mail' };
  }

  // Telefone
  if (
    type === 'tel' ||
    inputmode === 'tel' ||
    ac.includes('tel') ||
    hit('telefone', 'fone', 'celular', 'whatsapp', 'phone', 'mobile')
  ) {
    return { value: gerarTelefoneCelularBR(), ambiguous: false, kindLabel: 'Telefone' };
  }

  // Data
  if (
    type === 'date' ||
    ac === 'bday' ||
    ac.includes('bday') ||
    hit('nascimento', 'nasc', 'birth', 'data_nasc', 'dt_nasc', 'anivers')
  ) {
    return { value: gerarDataIsoAleatoria(), ambiguous: false, kindLabel: 'Data' };
  }

  // URL
  if (type === 'url' || inputmode === 'url' || hit('website', 'linkedin', 'instagram', 'facebook') || /\burl\b/.test(blob)) {
    return {
      value: `https://exemplo-${crypto.randomUUID().slice(0, 8)}.test`,
      ambiguous: false,
      kindLabel: 'URL',
    };
  }

  // Nome
  if (
    hit('nome', 'name', 'sobrenome', 'apelido', 'fullname', 'responsavel', 'responsável', 'fantasia') ||
    ac.includes('name') ||
    ac === 'given-name' ||
    ac === 'family-name' ||
    ac === 'name'
  ) {
    return { value: gerarNome(), ambiguous: false, kindLabel: 'Nome' };
  }

  // Área de texto / texto genérico — ambíguo
  if (type === 'text' || type === 'search' || type === 'password' || el instanceof HTMLTextAreaElement) {
    return {
      value: gerarNome(),
      ambiguous: true,
      kindLabel: 'Nome (ambíguo — use Escolher)',
    };
  }

  return {
    value: CPF.gerarSemPontos(),
    ambiguous: true,
    kindLabel: 'CPF (fallback — use Escolher)',
  };
}
