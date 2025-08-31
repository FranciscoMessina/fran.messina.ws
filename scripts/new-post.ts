/**
 * Create a new post with frontmatter
 * Usage: pnpm new <title>
 *        Always creates EN and ES versions.
 */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'

// Process title from all arguments
const titleArgs: string[] = process.argv.slice(2)
const rawTitle: string = titleArgs.length > 0 ? titleArgs.join(' ') : 'new-post'

// Check if title starts with underscore (draft post)
const isDraft: boolean = rawTitle.startsWith('_')
const displayTitle: string = isDraft ? rawTitle.slice(1) : rawTitle

const fileName: string = rawTitle
  .toLowerCase()
  .replace(/[^a-z0-9\s-_]/g, '') // Remove special characters but keep underscore and hyphen
  .replace(/\s+/g, '-') // Replace spaces with hyphens
  .replace(/-+/g, '-') // Replace multiple hyphens with single
  .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
const targetFile: string = `${fileName}.md`
const enDir: string = 'src/content/posts'
const esDir: string = 'src/content/posts/es'
const enPath: string = join(enDir, targetFile)
const esPath: string = join(esDir, targetFile)

// Check if the target file already exists
if (existsSync(enPath) || existsSync(esPath)) {
  console.error(`😇 File already exists: ${existsSync(enPath) ? enPath : esPath}`)
  process.exit(1)
}

// Ensure the directory structure exists
mkdirSync(dirname(enPath), { recursive: true })
mkdirSync(dirname(esPath), { recursive: true })

// Generate frontmatter with current date
const content: string = `---
title: ${displayTitle}
pubDate: '${new Date().toISOString().split('T')[0]}'
---

`

// Write the new post files (EN and ES)
try {
  writeFileSync(enPath, content)
  writeFileSync(esPath, content)
  console.log(`${isDraft ? '📝 Draft created' : '✅ Post created'}: \n  EN → ${enPath}\n  ES → ${esPath}`)
} catch (error) {
  console.error('⚠️ Failed to create post:', error)
  process.exit(1)
}
