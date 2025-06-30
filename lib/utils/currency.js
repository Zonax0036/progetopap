// lib/utils/currency.js

/**
 * Formata um valor numérico como uma string de moeda no formato Euro (pt-PT).
 * @param {number} value - O valor a ser formatado.
 * @returns {string} O valor formatado como moeda.
 */
export const formatCurrency = value => {
  if (typeof Number(value) !== 'number' || isNaN(value)) {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
    }).format(0);
  }

  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
};
