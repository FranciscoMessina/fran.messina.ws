import { getCollection, type CollectionEntry } from 'astro:content'
import { getPathByLocale } from 'astro:i18n'

/**
 * Get all posts, filtering out posts whose filenames start with _
 */
export async function getFilteredPosts(locale?: string) {
  const posts = await getCollection('posts')
  const current = locale ?? (globalThis as any).Astro?.currentLocale ?? undefined
  const pathPrefix = current ? getPathByLocale(current) : undefined
  return posts.filter((post: CollectionEntry<'posts'>) => {
    if (post.id.startsWith('_')) return false
    if (!pathPrefix) return !post.id.startsWith('es/')
    if (pathPrefix === 'en') return !post.id.startsWith('es/')
    if (pathPrefix === 'es') return post.id.startsWith('es/')
    return true
  })
}

/**
 * Get all posts sorted by publication date, filtering out posts whose filenames start with _
 */
export async function getSortedFilteredPosts(locale?: string) {
  const posts = await getFilteredPosts(locale)
  return posts.sort(
    (a: CollectionEntry<'posts'>, b: CollectionEntry<'posts'>) =>
      b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  )
}
