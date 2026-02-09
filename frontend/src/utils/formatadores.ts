export const formatarMoeda = (valor: any) => {
  if (valor === undefined || valor === null || valor === '') return 'R$ 0,00';

  let s = String(valor).trim();
  
  if (s.includes(',') && s.includes('.')) {
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (s.includes(',')) {
    s = s.replace(',', '.');
  }

  const numero = Number(s);

  if (isNaN(numero)) return 'R$ 0,00';

  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};
