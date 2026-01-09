/**
 * Example test file demonstrating all features of MicroTest
 * This shows potential employers you understand testing patterns
 */

import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from "../test-framework.js"

// Example: Testing utility functions
describe("Math Utilities", () => {
  describe("Addition", () => {
    it("should add two positive numbers", () => {
      expect(2 + 2).toBe(4)
    })

    it("should add negative numbers", () => {
      expect(-5 + -3).toBe(-8)
    })

    it("should handle zero", () => {
      expect(0 + 0).toBe(0)
      expect(5 + 0).toBe(5)
    })
  })

  describe("Comparison", () => {
    it("should compare numbers correctly", () => {
      expect(10).toBeGreaterThan(5)
      expect(3).toBeLessThan(7)
      expect(5).toBeGreaterThanOrEqual(5)
      expect(5).toBeLessThanOrEqual(5)
    })
  })
})

// Example: Testing objects and arrays
describe("Object and Array Assertions", () => {
  it("should check object equality", () => {
    const user = { name: "John", age: 30 }
    expect(user).toEqual({ name: "John", age: 30 })
  })

  it("should check object properties", () => {
    const product = { id: 1, name: "Laptop", price: 999 }
    expect(product).toHaveProperty("name")
    expect(product).toHaveProperty("price", 999)
  })

  it("should check array contents", () => {
    const fruits = ["apple", "banana", "orange"]
    expect(fruits).toContain("banana")
    expect(fruits).toHaveLength(3)
  })

  it("should work with nested objects", () => {
    const config = {
      server: {
        port: 3000,
        host: "localhost",
      },
    }
    expect(config).toHaveProperty("server")
    expect(config.server.port).toBe(3000)
  })
})

// Example: Testing strings
describe("String Operations", () => {
  it("should check string content", () => {
    const message = "Hello, World!"
    expect(message).toContain("World")
    expect(message).toHaveLength(13)
  })

  it("should match regular expressions", () => {
    const email = "test@example.com"
    expect(email).toMatch(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
  })
})

// Example: Testing with hooks
describe("Lifecycle Hooks", () => {
  let counter = 0
  let database = null

  beforeAll(() => {
    console.log("  🔧 Setting up test database...")
    database = { connected: true }
  })

  afterAll(() => {
    console.log("  🔧 Cleaning up test database...")
    database = null
  })

  beforeEach(() => {
    counter = 0
  })

  afterEach(() => {
    counter = null
  })

  it("should start with counter at 0", () => {
    expect(counter).toBe(0)
  })

  it("should have database connected", () => {
    expect(database.connected).toBeTruthy()
  })
})

// Example: Testing error handling
describe("Error Handling", () => {
  it("should throw errors", () => {
    const throwError = () => {
      throw new Error("Something went wrong")
    }
    expect(throwError).toThrow("Something went wrong")
  })

  it("should check for null and undefined", () => {
    expect(null).toBeNull()
    expect(undefined).toBeUndefined()
    expect("defined").toBeDefined()
  })
})

// Example: Async testing
describe("Async Operations", () => {
  it("should handle async functions", async () => {
    const fetchData = async () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ data: "success" }), 100)
      })
    }

    const result = await fetchData()
    expect(result).toHaveProperty("data", "success")
  })

  it("should handle async errors", async () => {
    const asyncThrow = async () => {
      throw new Error("Async error")
    }

    await expect(asyncThrow).toThrowAsync("Async error")
  })
})

// Example: Truthy/Falsy
describe("Boolean Logic", () => {
  it("should test truthy values", () => {
    expect(true).toBeTruthy()
    expect(1).toBeTruthy()
    expect("text").toBeTruthy()
    expect([]).toBeTruthy()
    expect({}).toBeTruthy()
  })

  it("should test falsy values", () => {
    expect(false).toBeFalsy()
    expect(0).toBeFalsy()
    expect("").toBeFalsy()
    expect(null).toBeFalsy()
    expect(undefined).toBeFalsy()
  })
})

// Example: NOT assertions
describe("Negation with .not", () => {
  it("should negate assertions", () => {
    expect(5).not.toBe(10)
    expect("hello").not.toContain("goodbye")
    expect([1, 2, 3]).not.toHaveLength(5)
  })
})

// Example: Floating point comparison
describe("Floating Point Math", () => {
  it("should handle floating point precision", () => {
    const value = 0.1 + 0.2
    expect(value).toBeCloseTo(0.3, 5)
  })
})

// Example: Instance checking
describe("Type Checking", () => {
  it("should check instances", () => {
    const date = new Date()
    const arr = []
    const obj = {}

    expect(date).toBeInstanceOf(Date)
    expect(arr).toBeInstanceOf(Array)
    expect(obj).toBeInstanceOf(Object)
  })
})
