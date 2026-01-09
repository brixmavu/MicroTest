# MicroTest - Lightweight Vanilla JavaScript Testing Framework

[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](https://github.com/your-username/microtest)
[![Vanilla JS](https://img.shields.io/badge/vanilla-js-yellow.svg)](https://vanillajs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Code Style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Made with Love](https://img.shields.io/badge/made%20with-love-red.svg)](https://github.com/your-username/microtest)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://www.ecma-international.org/ecma-262/6.0/)
[![Async/Await Support](https://img.shields.io/badge/async%2Fawait-supported-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
[![Test Coverage](https://img.shields.io/badge/test%20coverage-100%25-green.svg)](https://github.com/your-username/microtest)


A professional-grade testing framework built with vanilla JavaScript. Zero dependencies, full-featured, and production-ready.

A lightweight, powerful testing framework in vanilla JavaScript.

## 🎯 Features

- ✅ **Complete Assertion Library** - 25+ assertion methods
- 🔄 **Async/Await Support** - Test promises and async functions
- ⚡ **Lifecycle Hooks** - beforeAll, afterAll, beforeEach, afterEach
- 📊 **Beautiful Reports** - Detailed test results with timing
- 🎯 **Focused Tests** - Run specific tests with .only()
- ⏭️ **Skip Tests** - Skip tests with .skip()
- 🪆 **Nested Suites** - Organize tests hierarchically
- ⏱️ **Timeouts** - Configurable test timeouts
- 🎨 **Fluent API** - Readable, expressive syntax
- 📦 **Zero Dependencies** - Pure vanilla JavaScript

## 🚀 Quick Start

### Running Tests

```bash
# Run all tests
node scripts/run-tests.js
```

### Basic Example

```javascript
import { describe, it, expect } from './lib/test-framework.js';

describe('Calculator', () => {
  it('should add numbers', () => {
    expect(2 + 2).toBe(4);
  });

  it('should multiply numbers', () => {
    expect(3 * 4).toBe(12);
  });
});
```

## 📚 API Reference

### Test Organization

#### `describe(name, fn)`
Groups related tests together.

```javascript
describe('User Authentication', () => {
  // tests here
});
```

#### `it(name, fn)` / `test(name, fn)`
Defines a single test case.

```javascript
it('should login with valid credentials', () => {
  expect(login('user', 'pass')).toBeTruthy();
});
```

### Assertions

#### Equality

```javascript
expect(actual).toBe(expected)              // Object.is equality
expect(actual).toEqual(expected)           // Deep equality
expect(actual).toStrictEqual(expected)     // Strict deep equality
```

#### Truthiness

```javascript
expect(value).toBeTruthy()                 // Truthy value
expect(value).toBeFalsy()                  // Falsy value
expect(value).toBeDefined()                // Not undefined
expect(value).toBeUndefined()              // Is undefined
expect(value).toBeNull()                   // Is null
```

#### Numbers

```javascript
expect(10).toBeGreaterThan(5)
expect(5).toBeLessThan(10)
expect(5).toBeGreaterThanOrEqual(5)
expect(5).toBeLessThanOrEqual(5)
expect(0.1 + 0.2).toBeCloseTo(0.3, 5)     // Floating point
```

#### Strings & Collections

```javascript
expect('hello').toContain('ell')           // String contains
expect([1, 2, 3]).toContain(2)             // Array contains
expect(array).toHaveLength(3)              // Length check
expect('test@email.com').toMatch(/^[\w-\.]+@/)  // Regex match
```

#### Objects

```javascript
expect(obj).toHaveProperty('name')         // Has property
expect(obj).toHaveProperty('age', 25)      // Property with value
```

#### Errors

```javascript
expect(() => throw new Error()).toThrow()
expect(() => throw new Error('fail')).toThrow('fail')
await expect(asyncFn).toThrowAsync('error message')
```

#### Types

```javascript
expect(new Date()).toBeInstanceOf(Date)
expect([]).toBeInstanceOf(Array)
```

#### Negation

```javascript
expect(5).not.toBe(10)
expect('hello').not.toContain('goodbye')
```

### Lifecycle Hooks

```javascript
describe('Database Tests', () => {
  beforeAll(() => {
    // Runs once before all tests
    connectToDatabase();
  });

  afterAll(() => {
    // Runs once after all tests
    disconnectFromDatabase();
  });

  beforeEach(() => {
    // Runs before each test
    clearDatabase();
  });

  afterEach(() => {
    // Runs after each test
    logTestResults();
  });

  it('should save user', () => {
    // test here
  });
});
```

### Async Testing

```javascript
it('should fetch data', async () => {
  const data = await fetchData();
  expect(data).toHaveProperty('status', 'success');
});

it('should handle async errors', async () => {
  const failingFetch = async () => {
    throw new Error('Network error');
  };
  
  await expect(failingFetch).toThrowAsync('Network error');
});
```

### Test Control

```javascript
// Skip a test
it.skip('not ready yet', () => {
  // won't run
});

// Run only specific tests
it.only('focus on this', () => {
  // only this runs
});

// Custom timeout
it('slow operation', async () => {
  await slowOperation();
}, { timeout: 10000 });
```

## 📊 Test Reports

MicroTest provides beautiful, detailed test reports:

```
🚀 Starting Test Run...

📦 Math Utilities
  📦 Addition
    ✓ should add two positive numbers (0.45ms)
    ✓ should add negative numbers (0.23ms)
    ✓ should handle zero (0.18ms)

============================================================
📊 TEST REPORT
============================================================

✓ Passed:  15
✗ Failed:  0
⊝ Skipped: 1
─ Total:   16

⏱  Duration: 125.34ms
📈 Pass Rate: 100.00%

🎉 All tests passed!
============================================================
```

## 💡 Real-World Example

```javascript
import { describe, it, expect, beforeEach } from './lib/test-framework.js';

class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(item) {
    this.items.push(item);
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

describe('Shopping Cart', () => {
  let cart;

  beforeEach(() => {
    cart = new ShoppingCart();
  });

  describe('Adding Items', () => {
    it('should start empty', () => {
      expect(cart.isEmpty()).toBeTruthy();
      expect(cart.items).toHaveLength(0);
    });

    it('should add items', () => {
      cart.addItem({ name: 'Laptop', price: 999 });
      expect(cart.items).toHaveLength(1);
      expect(cart.isEmpty()).toBeFalsy();
    });
  });

  describe('Calculating Total', () => {
    it('should calculate total price', () => {
      cart.addItem({ name: 'Laptop', price: 999 });
      cart.addItem({ name: 'Mouse', price: 29 });
      
      expect(cart.getTotal()).toBe(1028);
    });

    it('should return 0 for empty cart', () => {
      expect(cart.getTotal()).toBe(0);
    });
  });
});
```

## 🎓 Why This Framework?

This framework demonstrates:

1. **Advanced JavaScript Skills**
   - ES6+ features (classes, arrow functions, destructuring)
   - Async/await and Promises
   - Error handling and stack traces
   - Performance timing with Performance API

2. **Software Engineering Principles**
   - Clean, maintainable code
   - Single Responsibility Principle
   - Fluent API design
   - Comprehensive error messages

3. **Testing Knowledge**
   - Understanding of test lifecycle
   - Assertion library design
   - Test organization patterns
   - Industry-standard API (Jest-like)

4. **Real-World Application**
   - Production-ready code
   - Zero dependencies
   - Handles edge cases
   - Professional documentation

## 📝 License

MIT - Build something awesome! © [Brixton Mavu](mailto:brixtonmavu@gmail.com)
