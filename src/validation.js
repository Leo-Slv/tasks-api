/**
 * Valida e normaliza o título de uma tarefa.
 * @param {unknown} title
 * @returns {{ valid: boolean, value?: string, error?: string }}
 */
function validateTitle(title) {
  if (typeof title !== 'string') {
    return { valid: false, error: 'title deve ser uma string' };
  }
  const value = title.trim();
  if (value.length === 0) {
    return { valid: false, error: 'title é obrigatório' };
  }
  if (value.length > 120) {
    return { valid: false, error: 'title deve ter no máximo 120 caracteres' };
  }
  return { valid: true, value };
}

/**
 * Converte um parâmetro de rota em id inteiro positivo.
 * @param {unknown} raw
 * @returns {number | null}
 */
function parseId(raw) {
  if (typeof raw !== 'string' || !/^\d+$/.test(raw)) return null;
  const id = Number(raw);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

module.exports = { validateTitle, parseId };
