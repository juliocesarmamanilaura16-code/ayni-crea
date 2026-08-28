import { describe, it, expect } from 'vitest';
import { calcPrice, getAynLevel, progressToNext, AYN_LEVELS } from '@/lib/pricing';
import type { Product } from '@/types';

const mockProduct: Product = {
  id: 'p1',
  artisanId: 'a1',
  categoryId: 'textiles',
  name: 'Test Product',
  description: 'Test',
  basePrice: 100,
  image: '',
  productionDays: 5,
  options: {
    colors: [
      { name: 'Azul', hex: '#1e3a8a', extra: 0 },
      { name: 'Dorado', hex: '#C9A24A', extra: 12 },
    ],
    materials: [
      { name: 'Tela', extra: 0 },
      { name: 'Cuero', extra: 30 },
    ],
    sizes: [
      { name: 'Pequeño', extra: 0 },
      { name: 'Grande', extra: 40 },
    ],
    texts: { label: 'Texto', extra: 10 },
  },
};

describe('calcPrice', () => {
  it('calcula precio base correctamente', () => {
    const price = calcPrice(mockProduct, { color: 'Azul', material: 'Tela', size: 'Pequeño', text: '' });
    expect(price).toBe(100);
  });

  it('suma extras de color, material, tamaño y texto', () => {
    const price = calcPrice(mockProduct, { color: 'Dorado', material: 'Cuero', size: 'Grande', text: 'HOLA' });
    expect(price).toBe(100 + 12 + 30 + 40 + 10);
  });

  it('no suma extra de texto si está vacío', () => {
    const price = calcPrice(mockProduct, { color: 'Azul', material: 'Tela', size: 'Pequeño', text: '   ' });
    expect(price).toBe(100);
  });
});

describe('getAynLevel', () => {
  it('retorna Explorador para 0 puntos', () => {
    expect(getAynLevel(0).name).toBe('Explorador');
  });

  it('retorna Creador para 150 puntos', () => {
    expect(getAynLevel(150).name).toBe('Creador');
  });

  it('retorna Ayni Master para 400 puntos', () => {
    expect(getAynLevel(400).name).toBe('Ayni Master');
  });

  it('retorna Embajador Ayni para 1000 puntos', () => {
    expect(getAynLevel(1000).name).toBe('Embajador Ayni');
  });
});

describe('progressToNext', () => {
  it('retorna 0% al inicio de nivel', () => {
    expect(progressToNext(0).pct).toBe(0);
  });

  it('retorna 100% en nivel máximo', () => {
    expect(progressToNext(1000).pct).toBe(100);
  });

  it('calcula porcentaje intermedio correctamente', () => {
    const result = progressToNext(200);
    expect(result.pct).toBeGreaterThan(0);
    expect(result.pct).toBeLessThanOrEqual(100);
    expect(result.next).toBe('Ayni Master');
  });
});

describe('AYN_LEVELS', () => {
  it('tiene 4 niveles definidos', () => {
    expect(AYN_LEVELS.length).toBe(4);
  });

  it('niveles están ordenados por min', () => {
    for (let i = 1; i < AYN_LEVELS.length; i++) {
      expect(AYN_LEVELS[i].min).toBeGreaterThan(AYN_LEVELS[i - 1].min);
    }
  });
});