import test from 'ava';
import { join } from 'path';
import { dirExists } from '../dist/server/server-utils';

test('server-utils: dir exists', t => {
  const dir = join(__dirname, './fixtures');
  const actual = dirExists(dir);
  t.is(actual, true);
});

test('server-utils: dir does not exist', t => {
  const dir = join(__dirname, './fake');
  const actual = dirExists(dir);
  t.is(actual, false);
});
