import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ResultsCard from '@/components/ResultsCard.vue'

vi.mock('@vueuse/core', () => ({
  useShare: () => ({
    share: vi.fn(),
    isSupported: false,
  }),
}))

vi.mock('lucide-vue-next', () => ({
  BookOpenCheck: defineComponent({ template: '<svg />' }),
  Link2: defineComponent({ template: '<svg />' }),
  Share2: defineComponent({ template: '<svg />' }),
}))

describe('ResultsCard', () => {
  it('renders core result content', () => {
    const wrapper = mount(ResultsCard, {
      props: {
        result: {
          url: 'https://example.org/works/1',
          title: 'Sample Title',
          published: [1991, 12, 31],
          publisher: 'Crossref',
          type: 'journal-article',
          abstract: 'Abstract text',
          authors: [
            { given: 'Ada', family: 'Lovelace' },
            { name: 'Charles Babbage' },
          ],
        },
      },
      global: {
        stubs: {
          Button: {
            template: '<button><slot /></button>',
          },
        },
      },
    })

    const text = wrapper.text()
    expect(text).toContain('journal-article')
    expect(text).toContain('Published: 31st Dec, 1991')
    expect(text).toContain('Sample Title')
    expect(text).toContain('Crossref')
    expect(text).toContain('Ada Lovelace')
    expect(text).toContain('Charles Babbage')
    expect(text).toContain('https://example.org/works/1')
  })
})
