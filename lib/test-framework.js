/**
 * MicroTest - A lightweight, powerful testing framework in vanilla JavaScript
 * Perfect for demonstrating advanced JS skills and real-world testing knowledge
 * @author Brixton Mavu
 */

class MicroTest {
  constructor() {
    this.suites = []
    this.currentSuite = null
    this.results = {
      passed: 0,
      failed: 0,
      skipped: 0,
      total: 0,
      duration: 0,
      suites: [],
    }
    this.beforeEachHooks = []
    this.afterEachHooks = []
    this.beforeAllHooks = []
    this.afterAllHooks = []
  }

  /**
   * Define a test suite
   */
  describe(name, fn) {
    const suite = {
      name,
      tests: [],
      beforeEach: [],
      afterEach: [],
      beforeAll: [],
      afterAll: [],
      nested: [],
    }

    const previousSuite = this.currentSuite
    this.currentSuite = suite

    try {
      fn()

      if (previousSuite) {
        previousSuite.nested.push(suite)
      } else {
        this.suites.push(suite)
      }
    } finally {
      this.currentSuite = previousSuite
    }
  }

  /**
   * Define a test case
   */
  it(name, fn, options = {}) {
    if (!this.currentSuite) {
      throw new Error("Tests must be defined inside a describe block")
    }

    this.currentSuite.tests.push({
      name,
      fn,
      skip: options.skip || false,
      only: options.only || false,
      timeout: options.timeout || 5000,
    })
  }

  /**
   * Alias for it()
   */
  test(name, fn, options = {}) {
    this.it(name, fn, options)
  }

  /**
   * Skip a test
   */
  skip(name, fn) {
    this.it(name, fn, { skip: true })
  }

  /**
   * Run only this test (focus mode)
   */
  only(name, fn) {
    this.it(name, fn, { only: true })
  }

  /**
   * Setup hooks
   */
  beforeEach(fn) {
    if (this.currentSuite) {
      this.currentSuite.beforeEach.push(fn)
    }
  }

  afterEach(fn) {
    if (this.currentSuite) {
      this.currentSuite.afterEach.push(fn)
    }
  }

  beforeAll(fn) {
    if (this.currentSuite) {
      this.currentSuite.beforeAll.push(fn)
    }
  }

  afterAll(fn) {
    if (this.currentSuite) {
      this.currentSuite.afterAll.push(fn)
    }
  }

  /**
   * Run all tests
   */
  async run() {
    console.log("\n🚀 Starting Test Run...\n")
    const startTime = performance.now()

    for (const suite of this.suites) {
      await this.runSuite(suite)
    }

    const endTime = performance.now()
    this.results.duration = endTime - startTime

    this.printReport()
    return this.results
  }

  /**
   * Run a single test suite
   */
  async runSuite(suite, depth = 0) {
    const indent = "  ".repeat(depth)
    console.log(`${indent}📦 ${suite.name}`)

    const suiteResults = {
      name: suite.name,
      passed: 0,
      failed: 0,
      skipped: 0,
      tests: [],
    }

    // Run beforeAll hooks
    for (const hook of suite.beforeAll) {
      try {
        await hook()
      } catch (error) {
        console.error(`${indent}  ❌ beforeAll hook failed:`, error.message)
      }
    }

    // Check if any tests are marked with .only()
    const hasOnly = suite.tests.some((test) => test.only)

    // Run tests
    for (const test of suite.tests) {
      if (hasOnly && !test.only) continue
      if (test.skip) {
        console.log(`${indent}  ⊝ ${test.name} (skipped)`)
        suiteResults.skipped++
        this.results.skipped++
        this.results.total++
        continue
      }

      const testResult = await this.runTest(test, suite, depth + 1)
      suiteResults.tests.push(testResult)

      if (testResult.passed) {
        suiteResults.passed++
        this.results.passed++
      } else {
        suiteResults.failed++
        this.results.failed++
      }
      this.results.total++
    }

    // Run nested suites
    for (const nested of suite.nested) {
      await this.runSuite(nested, depth + 1)
    }

    // Run afterAll hooks
    for (const hook of suite.afterAll) {
      try {
        await hook()
      } catch (error) {
        console.error(`${indent}  ❌ afterAll hook failed:`, error.message)
      }
    }

    this.results.suites.push(suiteResults)
  }

  /**
   * Run a single test
   */
  async runTest(test, suite, depth) {
    const indent = "  ".repeat(depth)
    const startTime = performance.now()
    const result = {
      name: test.name,
      passed: false,
      error: null,
      duration: 0,
    }

    try {
      // Run beforeEach hooks
      for (const hook of suite.beforeEach) {
        await hook()
      }

      // Run test with timeout
      await this.withTimeout(test.fn(), test.timeout)

      const endTime = performance.now()
      result.duration = endTime - startTime
      result.passed = true

      console.log(`${indent}  ✓ ${test.name} (${result.duration.toFixed(2)}ms)`)
    } catch (error) {
      const endTime = performance.now()
      result.duration = endTime - startTime
      result.error = error

      console.log(`${indent}  ✗ ${test.name}`)
      console.log(`${indent}    ${error.message}`)

      if (error.stack) {
        const stackLines = error.stack.split("\n").slice(1, 3)
        stackLines.forEach((line) => {
          console.log(`${indent}    ${line.trim()}`)
        })
      }
    } finally {
      // Run afterEach hooks
      for (const hook of suite.afterEach) {
        try {
          await hook()
        } catch (error) {
          console.error(`${indent}  ❌ afterEach hook failed:`, error.message)
        }
      }
    }

    return result
  }

  /**
   * Helper to run promises with timeout
   */
  withTimeout(promise, timeout) {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error(`Test timeout after ${timeout}ms`)), timeout)),
    ])
  }

  /**
   * Print final test report
   */
  printReport() {
    console.log("\n" + "=".repeat(60))
    console.log("📊 TEST REPORT")
    console.log("=".repeat(60))

    const passRate = this.results.total > 0 ? ((this.results.passed / this.results.total) * 100).toFixed(2) : 0

    console.log(`\n✓ Passed:  ${this.results.passed}`)
    console.log(`✗ Failed:  ${this.results.failed}`)
    console.log(`⊝ Skipped: ${this.results.skipped}`)
    console.log(`─ Total:   ${this.results.total}`)
    console.log(`\n⏱  Duration: ${this.results.duration.toFixed(2)}ms`)
    console.log(`📈 Pass Rate: ${passRate}%`)

    if (this.results.failed === 0) {
      console.log("\n🎉 All tests passed!")
    } else {
      console.log(`\n⚠️  ${this.results.failed} test(s) failed`)
    }

    console.log("=".repeat(60) + "\n")
  }
}

/**
 * Assertion Library - Fluent interface for readable tests
 */
class Expect {
  constructor(actual) {
    this.actual = actual
    this.isNot = false
  }

  get not() {
    this.isNot = !this.isNot
    return this
  }

  toBe(expected) {
    const passed = Object.is(this.actual, expected)
    if (passed === this.isNot) {
      throw new Error(
        `Expected ${JSON.stringify(this.actual)} ${this.isNot ? "not " : ""}to be ${JSON.stringify(expected)}`,
      )
    }
  }

  toEqual(expected) {
    const passed = this.deepEqual(this.actual, expected)
    if (passed === this.isNot) {
      throw new Error(
        `Expected ${JSON.stringify(this.actual)} ${this.isNot ? "not " : ""}to equal ${JSON.stringify(expected)}`,
      )
    }
  }

  toStrictEqual(expected) {
    const passed = this.strictEqual(this.actual, expected)
    if (passed === this.isNot) {
      throw new Error(
        `Expected ${JSON.stringify(this.actual)} ${this.isNot ? "not " : ""}to strictly equal ${JSON.stringify(expected)}`,
      )
    }
  }

  toBeTruthy() {
    const passed = Boolean(this.actual)
    if (passed === this.isNot) {
      throw new Error(`Expected ${JSON.stringify(this.actual)} ${this.isNot ? "not " : ""}to be truthy`)
    }
  }

  toBeFalsy() {
    const passed = !Boolean(this.actual)
    if (passed === this.isNot) {
      throw new Error(`Expected ${JSON.stringify(this.actual)} ${this.isNot ? "not " : ""}to be falsy`)
    }
  }

  toBeNull() {
    const passed = this.actual === null
    if (passed === this.isNot) {
      throw new Error(`Expected ${JSON.stringify(this.actual)} ${this.isNot ? "not " : ""}to be null`)
    }
  }

  toBeUndefined() {
    const passed = this.actual === undefined
    if (passed === this.isNot) {
      throw new Error(`Expected ${JSON.stringify(this.actual)} ${this.isNot ? "not " : ""}to be undefined`)
    }
  }

  toBeDefined() {
    const passed = this.actual !== undefined
    if (passed === this.isNot) {
      throw new Error(`Expected ${JSON.stringify(this.actual)} ${this.isNot ? "not " : ""}to be defined`)
    }
  }

  toBeGreaterThan(expected) {
    const passed = this.actual > expected
    if (passed === this.isNot) {
      throw new Error(`Expected ${this.actual} ${this.isNot ? "not " : ""}to be greater than ${expected}`)
    }
  }

  toBeLessThan(expected) {
    const passed = this.actual < expected
    if (passed === this.isNot) {
      throw new Error(`Expected ${this.actual} ${this.isNot ? "not " : ""}to be less than ${expected}`)
    }
  }

  toBeGreaterThanOrEqual(expected) {
    const passed = this.actual >= expected
    if (passed === this.isNot) {
      throw new Error(`Expected ${this.actual} ${this.isNot ? "not " : ""}to be greater than or equal ${expected}`)
    }
  }

  toBeLessThanOrEqual(expected) {
    const passed = this.actual <= expected
    if (passed === this.isNot) {
      throw new Error(`Expected ${this.actual} ${this.isNot ? "not " : ""}to be less than or equal ${expected}`)
    }
  }

  toContain(item) {
    let passed = false

    if (typeof this.actual === "string") {
      passed = this.actual.includes(item)
    } else if (Array.isArray(this.actual)) {
      passed = this.actual.includes(item)
    } else if (this.actual instanceof Set || this.actual instanceof Map) {
      passed = this.actual.has(item)
    }

    if (passed === this.isNot) {
      throw new Error(
        `Expected ${JSON.stringify(this.actual)} ${this.isNot ? "not " : ""}to contain ${JSON.stringify(item)}`,
      )
    }
  }

  toHaveLength(length) {
    const passed = this.actual?.length === length
    if (passed === this.isNot) {
      throw new Error(
        `Expected ${JSON.stringify(this.actual)} ${this.isNot ? "not " : ""}to have length ${length}, but got ${this.actual?.length}`,
      )
    }
  }

  toHaveProperty(property, value) {
    const hasProperty = Object.prototype.hasOwnProperty.call(this.actual, property)

    if (!hasProperty && !this.isNot) {
      throw new Error(`Expected object to have property "${property}"`)
    }

    if (hasProperty && this.isNot) {
      throw new Error(`Expected object not to have property "${property}"`)
    }

    if (value !== undefined && hasProperty) {
      const actualValue = this.actual[property]
      const valuesMatch = this.deepEqual(actualValue, value)

      if (valuesMatch === this.isNot) {
        throw new Error(
          `Expected property "${property}" ${this.isNot ? "not " : ""}to be ${JSON.stringify(value)}, but got ${JSON.stringify(actualValue)}`,
        )
      }
    }
  }

  toMatch(regex) {
    const passed = regex.test(this.actual)
    if (passed === this.isNot) {
      throw new Error(`Expected ${JSON.stringify(this.actual)} ${this.isNot ? "not " : ""}to match ${regex}`)
    }
  }

  toThrow(expectedError) {
    if (typeof this.actual !== "function") {
      throw new Error("toThrow expects a function")
    }

    let thrown = false
    let error = null

    try {
      this.actual()
    } catch (e) {
      thrown = true
      error = e
    }

    if (thrown === this.isNot) {
      throw new Error(`Expected function ${this.isNot ? "not " : ""}to throw`)
    }

    if (thrown && expectedError) {
      if (typeof expectedError === "string") {
        if (!error.message.includes(expectedError)) {
          throw new Error(`Expected error message to include "${expectedError}", but got "${error.message}"`)
        }
      } else if (expectedError instanceof RegExp) {
        if (!expectedError.test(error.message)) {
          throw new Error(`Expected error message to match ${expectedError}, but got "${error.message}"`)
        }
      }
    }
  }

  async toThrowAsync(expectedError) {
    if (typeof this.actual !== "function" && !(this.actual instanceof Promise)) {
      throw new Error("toThrowAsync expects an async function or promise")
    }

    let thrown = false
    let error = null

    try {
      await this.actual()
    } catch (e) {
      thrown = true
      error = e
    }

    if (thrown === this.isNot) {
      throw new Error(`Expected async function ${this.isNot ? "not " : ""}to throw`)
    }

    if (thrown && expectedError) {
      if (typeof expectedError === "string") {
        if (!error.message.includes(expectedError)) {
          throw new Error(`Expected error message to include "${expectedError}", but got "${error.message}"`)
        }
      }
    }
  }

  toBeInstanceOf(constructor) {
    const passed = this.actual instanceof constructor
    if (passed === this.isNot) {
      throw new Error(`Expected ${this.actual} ${this.isNot ? "not " : ""}to be instance of ${constructor.name}`)
    }
  }

  toBeCloseTo(expected, precision = 2) {
    const diff = Math.abs(this.actual - expected)
    const threshold = Math.pow(10, -precision) / 2
    const passed = diff < threshold

    if (passed === this.isNot) {
      throw new Error(
        `Expected ${this.actual} ${this.isNot ? "not " : ""}to be close to ${expected} (precision: ${precision})`,
      )
    }
  }

  // Deep equality helper
  deepEqual(a, b) {
    if (a === b) return true
    if (a == null || b == null) return false
    if (typeof a !== typeof b) return false

    if (typeof a !== "object") return a === b

    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false
      return a.every((item, index) => this.deepEqual(item, b[index]))
    }

    if (Array.isArray(a) !== Array.isArray(b)) return false

    const keysA = Object.keys(a)
    const keysB = Object.keys(b)

    if (keysA.length !== keysB.length) return false

    return keysA.every((key) => this.deepEqual(a[key], b[key]))
  }

  // Strict equality (checks types too)
  strictEqual(a, b) {
    if (a === b) return true
    if (typeof a !== typeof b) return false
    if (typeof a !== "object") return false

    if (Array.isArray(a) !== Array.isArray(b)) return false
    if (a.constructor !== b.constructor) return false

    return this.deepEqual(a, b)
  }
}

// Export global test functions
const microTest = new MicroTest()

export const describe = microTest.describe.bind(microTest)
export const it = microTest.it.bind(microTest)
export const test = microTest.test.bind(microTest)
export const expect = (actual) => new Expect(actual)
export const beforeEach = microTest.beforeEach.bind(microTest)
export const afterEach = microTest.afterEach.bind(microTest)
export const beforeAll = microTest.beforeAll.bind(microTest)
export const afterAll = microTest.afterAll.bind(microTest)
export const run = microTest.run.bind(microTest)

// For convenience in Node.js or browser
if (typeof globalThis !== "undefined") {
  globalThis.MicroTest = MicroTest
  globalThis.describe = describe
  globalThis.it = it
  globalThis.test = test
  globalThis.expect = expect
  globalThis.beforeEach = beforeEach
  globalThis.afterEach = afterEach
  globalThis.beforeAll = beforeAll
  globalThis.afterAll = afterAll
  globalThis.runTests = run
}

export default microTest
