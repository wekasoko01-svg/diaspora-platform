import { test, expect } from "@playwright/test"

test.describe("Auth flows", () => {
  test("should show login page", async ({ page }) => {
    await page.goto("/login")
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
  })

  test("should show validation on empty login", async ({ page }) => {
    await page.goto("/login")
    await page.getByRole("button", { name: /sign in/i }).click()
    await expect(page.getByText(/invalid/i)).toBeVisible()
  })

  test("should register then redirect", async ({ page }) => {
    await page.goto("/register")
    await expect(page.getByRole("heading", { name: /create account/i })).toBeVisible()

    const unique = Date.now()
    await page.getByLabel(/full name/i).fill("Test User")
    await page.getByLabel(/email/i).fill(`test${unique}@example.com`)
    await page.getByLabel(/phone/i).fill("+254700000000")
    await page.getByLabel(/country/i).fill("Kenya")
    await page.getByLabel(/^password/i).fill("Test1234!")
    await page.getByRole("button", { name: /create account/i }).click()
  })
})

test.describe("Public pages", () => {
  test("should load homepage", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("h1")).toBeVisible()
    await expect(page.getByRole("banner")).toBeVisible()
    await expect(page.getByRole("contentinfo")).toBeVisible()
  })

  test("should navigate via header", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: /services/i }).click()
    await expect(page).toHaveURL(/\/services/)
    await page.getByRole("link", { name: /contact/i }).click()
    await expect(page).toHaveURL(/\/contact/)
  })

  test("should submit contact form", async ({ page }) => {
    await page.goto("/contact")
    await page.getByLabel(/your name/i).fill("Test Contact")
    await page.getByLabel(/your email/i).fill("contact@example.com")
    await page.getByLabel(/subject/i).fill("Test Subject")
    await page.getByLabel(/message/i).fill("This is a test message from E2E.")
    await page.getByRole("button", { name: /send message/i }).click()
  })

  test("should show booking form", async ({ page }) => {
    await page.goto("/book")
    await expect(page.getByRole("heading", { name: /book a service/i })).toBeVisible()
  })

  test("should show 404 for unknown page", async ({ page }) => {
    await page.goto("/nonexistent-page")
    await expect(page.getByText(/page not found/i)).toBeVisible()
  })
})

test.describe("Responsive", () => {
  test("should have mobile menu", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto("/")
    await page.getByLabel(/open menu/i).click()
    await expect(page.getByLabel(/mobile navigation/i)).toBeVisible()
    await page.getByRole("link", { name: /services/i }).click()
    await expect(page).toHaveURL(/\/services/)
  })

  test("should have skip-to-content link", async ({ page }) => {
    await page.goto("/")
    await page.keyboard.press("Tab")
    await expect(page.getByText(/skip to main content/i)).toBeVisible()
  })
})

test.describe("Dark mode", () => {
  test("should toggle theme", async ({ page }) => {
    await page.goto("/")
    const html = page.locator("html")
    await page.getByLabel(/switch to dark mode/i).click()
    await expect(html).toHaveClass(/dark/)
    await page.getByLabel(/switch to light mode/i).click()
    await expect(html).not.toHaveClass(/dark/)
  })
})
