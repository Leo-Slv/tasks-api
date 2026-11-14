const { validateTitle, parseId } = require('../../src/validation');

describe('validateTitle', () => {
  test('aceita título válido e remove espaços', () => {
    expect(validateTitle('  Estudar CI  ')).toEqual({
      valid: true,
      value: 'Estudar CI',
    });
  });
  test('rejeita não-string', () => {
    expect(validateTitle(10).valid).toBe(false);
  });
  test('rejeita vazio', () => {
    expect(validateTitle('   ').valid).toBe(false);
  });
  test('rejeita acima de 120 caracteres', () => {
    expect(validateTitle('a'.repeat(121)).valid).toBe(false);
  });
});

describe('parseId', () => {
  test('converte inteiro positivo', () => {
    expect(parseId('42')).toBe(42);
  });
  test.each(['0', '-1', 'abc', '1.5', '', undefined])('rejeita %p', (v) => {
    expect(parseId(v)).toBeNull();
  });
});
