'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const LRUCache = require('../src/LRUCache');

test('get on missing key returns -1', () => {
  const cache = new LRUCache(2);
  assert.equal(cache.get(1), -1);
});

test('put then get returns the stored value', () => {
  const cache = new LRUCache(2);
  cache.put(1, 'a');
  assert.equal(cache.get(1), 'a');
});

test('evicts least recently used entry when capacity exceeded', () => {
  const cache = new LRUCache(2);
  cache.put(1, 'a');
  cache.put(2, 'b');
  cache.put(3, 'c'); // capacity 2 exceeded, evict key 1 (LRU)
  assert.equal(cache.get(1), -1);
  assert.equal(cache.get(2), 'b');
  assert.equal(cache.get(3), 'c');
});

test('get marks a key as most recently used, protecting it from eviction', () => {
  const cache = new LRUCache(2);
  cache.put(1, 'a');
  cache.put(2, 'b');
  cache.get(1);       // 1 is now most recently used; 2 becomes LRU
  cache.put(3, 'c');  // evicts key 2
  assert.equal(cache.get(2), -1);
  assert.equal(cache.get(1), 'a');
  assert.equal(cache.get(3), 'c');
});

test('put on an existing key updates its value and marks it most recently used', () => {
  const cache = new LRUCache(2);
  cache.put(1, 'a');
  cache.put(2, 'b');
  cache.put(1, 'updated'); // updates value, 1 becomes most recently used
  cache.put(3, 'c');       // evicts key 2 (LRU)
  assert.equal(cache.get(1), 'updated');
  assert.equal(cache.get(2), -1);
  assert.equal(cache.get(3), 'c');
});

test('capacity of 1 always evicts the previous single entry', () => {
  const cache = new LRUCache(1);
  cache.put(1, 'a');
  cache.put(2, 'b');
  assert.equal(cache.get(1), -1);
  assert.equal(cache.get(2), 'b');
});

test('repeated get calls do not evict anything', () => {
  const cache = new LRUCache(2);
  cache.put(1, 'a');
  cache.put(2, 'b');
  cache.get(1);
  cache.get(1);
  cache.get(2);
  assert.equal(cache.get(1), 'a');
  assert.equal(cache.get(2), 'b');
});

test('throws on invalid capacity', () => {
  assert.throws(() => new LRUCache(0));
  assert.throws(() => new LRUCache(-1));
  assert.throws(() => new LRUCache(1.5));
});
