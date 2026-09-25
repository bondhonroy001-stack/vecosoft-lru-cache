# LRU Cache

A Least Recently Used (LRU) Cache implemented in plain JavaScript (Node.js).

## API

```js
const LRUCache = require('./src/LRUCache');

const cache = new LRUCache(2); // capacity = 2
cache.put(1, 'a');
cache.get(1);      // 'a'
cache.get(9);      // -1 (not found)
```

- `new LRUCache(capacity)` — creates a cache that holds at most `capacity` entries.
- `get(key)` — returns the value for `key`, or `-1` if the key isn't present. A successful `get` marks that key as most recently used.
- `put(key, value)` — inserts or updates `key`. If the cache is at capacity and a new key is inserted, the least recently used entry is evicted first.

## Data structure and why

The cache is backed by a single JavaScript `Map` (see [src/LRUCache.js](src/LRUCache.js)).

A `Map` was chosen because it gives us two properties for free, without needing a hand-rolled doubly linked list:

- **O(1) average `get`/`set`/`delete` by key**, like a hash map.
- **Guaranteed insertion-order iteration** — when a key is re-inserted (via `delete` followed by `set`), it moves to the *end* of the iteration order.

That second property is exactly what LRU ordering needs: the front of the `Map` is always the least recently used entry, and the end is always the most recently used entry.

## How LRU ordering is maintained

- **On `get(key)`** (cache hit): the entry is deleted and re-set with the same value. This doesn't change its value, but moves it to the end of the `Map` (most recently used), since a plain lookup wouldn't otherwise touch its position.
- **On `put(key, value)`** for an existing key: the entry is deleted and re-set with the new value, moving it to the end (most recently used) and updating it at the same time.
- **On `put(key, value)`** for a new key:
  - If the cache is below capacity, the entry is just added — it lands at the end (most recently used).
  - If the cache is at capacity, the first key returned by the `Map`'s iterator (`map.keys().next().value`) is the least recently used entry, since it's the one that has gone longest without being touched. That key is deleted before the new entry is inserted.

Because `Map` iteration order is insertion order, "first key in the map" and "last key touched furthest in the past" are always the same thing under this scheme — no separate linked list or timestamps are needed.

## Time complexity

- `get(key)`: **O(1) average** — one `Map.has`, one `Map.get`, one `Map.delete`, one `Map.set`, all O(1) average.
- `put(key, value)`: **O(1) average** — the same constant number of `Map` operations, regardless of whether it's an insert, update, or eviction. (`map.keys().next()` to find the LRU key is also O(1): it just reads the first entry from the Map's internal linked list without iterating further.)

## Space complexity

**O(capacity)** — the `Map` never holds more than `capacity` key/value entries, since a new insertion beyond capacity always evicts one entry first.

## How to run it

Requires Node.js (built-in `node:test` runner is used, available in Node 18+).

```bash
npm start   # runs index.js, a demo script showing inserts, hits, misses, and evictions
npm test    # runs the test suite in test/LRUCache.test.js
```
