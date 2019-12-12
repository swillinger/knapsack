import test from 'ava';
import { colorContrast, convertColor } from '../dist--mjs';

test('colorContrast', t => {
  const results = colorContrast('#CFE3DE');

  t.is(results, '#000000');
  const results2 = colorContrast('#23342E');
  t.is(results2, '#ffffff');
});

test('convertColor', t => {
  const results = convertColor('hsl(165, 26%, 85%)', 'hex');
  const results2 = convertColor('#CFE3DE', 'rgb');
  const results3 = convertColor('rgb(207, 227, 222)', 'hsl');
  t.is(results, '#CFE3DE');
  t.is(results2, 'rgb(207, 227, 222)');
  t.is(results3, 'hsl(165, 26.3%, 85.1%)');
});
