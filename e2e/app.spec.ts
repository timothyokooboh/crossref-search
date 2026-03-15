import { test, expect } from '@playwright/test'

const mockResponse = {
  message: {
    items: [
      {
        URL: 'https://example.org/works/1',
        title: ['Climate Change and You'],
        'container-title': ['Journal of Climate'],
        published: { 'date-parts': [[2020, 5, 20]] },
        publisher: 'Crossref',
        abstract: 'Abstract',
        type: 'journal-article',
        author: [{ given: 'Timothy', family: 'Okooboh' }],
      },
    ],
    facets: {
      'type-name': { values: { Book: 5 } },
      published: { values: { 2020: 3 } },
    },
    'total-results': 25,
  },
}

test.beforeEach(async ({ page }) => {
  await page.route('**/works**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockResponse),
    })
  })
})

test('shows empty state on first load', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Start Your Search')).toBeVisible()
})

test('search renders results and facets', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Search title, author, DOIs, ORCIDs').fill('climate')

  await page.waitForResponse((response) => response.url().includes('/works'))

  await expect(page.getByText('Climate Change and You')).toBeVisible()
  await expect(page.getByText('Publication Type')).toBeVisible()
  await expect(page.getByText('Publication Year')).toBeVisible()
})

test('selecting a filter updates the request with filter param', async ({ page }) => {
  let lastRequestUrl = ''
  await page.route('**/works**', async (route) => {
    lastRequestUrl = route.request().url()
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockResponse),
    })
  })

  await page.goto('/')
  await page.getByLabel('Search title, author, DOIs, ORCIDs').fill('climate')
  await expect(page.getByText('Climate Change and You')).toBeVisible()

  const filterResponse = page.waitForResponse((response) =>
    /filter=type-name(:|%3A)Book/.test(response.url()),
  )

  await page.getByText('Book').click()
  await filterResponse
})

test('sorting updates the request with the new sort param', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Search title, author, DOIs, ORCIDs').fill('climate')
  await expect(page.getByText('Climate Change and You')).toBeVisible()

  const sortResponse = page.waitForResponse((response) => {
    const url = response.url()
    return url.includes('/works') && /sort=published/.test(url)
  })

  await page.getByRole('tab', { name: 'Year' }).click()
  await sortResponse
})

test('pagination updates the request with new offset', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Search title, author, DOIs, ORCIDs').fill('climate')
  await expect(page.getByText('Climate Change and You')).toBeVisible()

  const pageTwoResponse = page.waitForResponse((response) => {
    const url = response.url()
    return url.includes('/works') && /offset=10/.test(url)
  })

  await page.getByRole('button', { name: '2' }).click()
  await pageTwoResponse
})
