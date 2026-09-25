'use strict';

/**
 * Least Recently Used (LRU) Cache.
 *
 * Backed by a Map, which preserves insertion order in JS. Deleting and
 * re-setting a key moves it to the end (most recently used), so the key
 * at the front of the Map is always the least recently used one. Map's
 * get/set/delete are O(1) average, giving O(1) average get() and put().
 */
class LRUCache {
  constructor(capacity) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new Error('capacity must be a positive integer');
    }
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key) {
    if (!this.map.has(key)) {
      return -1;
    }
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      const lruKey = this.map.keys().next().value;
      this.map.delete(lruKey);
    }
    this.map.set(key, value);
  }
}

module.exports = LRUCache;
