'use strict';

const LRUCache = require('./src/LRUCache');

function logGet(label, value) {
  console.log(`${label} -> ${value}`);
}

console.log('=== LRU Cache Demo (capacity = 2) ===\n');

const cache = new LRUCache(2);

cache.put(1, 'a');
console.log('put(1, "a")');
cache.put(2, 'b');
console.log('put(2, "b")');
logGet('get(1)', cache.get(1));        // "a"  -> 1 is now most recently used
cache.put(3, 'c');                     // evicts key 2 (LRU)
console.log('put(3, "c")');
logGet('get(2)', cache.get(2));        // -1   -> evicted
cache.put(4, 'd');                     // evicts key 1 (LRU)
console.log('put(4, "d")');
logGet('get(1)', cache.get(1));        // -1   -> evicted
logGet('get(3)', cache.get(3));        // "c"
logGet('get(4)', cache.get(4));        // "d"

console.log('\n=== Update existing key ===\n');

const cache2 = new LRUCache(2);
cache2.put(1, 'x');
cache2.put(2, 'y');
cache2.put(1, 'z'); // update key 1, also marks it most recently used
logGet('get(1)', cache2.get(1)); // "z"
cache2.put(3, 'w'); // evicts key 2 (least recently used)
logGet('get(2)', cache2.get(2)); // -1
logGet('get(3)', cache2.get(3)); // "w"

console.log('\nDemo complete.');
