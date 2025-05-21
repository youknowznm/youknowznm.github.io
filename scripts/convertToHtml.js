import {marked} from 'marked'
import {readdirSync, readFileSync, writeFileSync} from 'node:fs'
import {join} from "node:path";

const removeExt = (fileName) => fileName.replace(/\.\S+$/g, '')

const githubLink = 'https://github.com/youknowznm'

const getPageHtml = (blogName, blogHtml) => `
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>youknowznm · ${blogName}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="../styles/global.css">
      <link rel="icon" href="../styles/avatar.png">
    </head>
    <body>
      <div class="blog-content markdown-body">
        ${blogHtml}
      </div>
      <footer class="blog-footer">
        <p class="blog-footer-code">
          Made with ❤️ by <a href="${githubLink}" target="_blank" class="blog-footer-code">youknowznm</a>.
        </p>
      </footer>
    </body>
  </html>
`

const blogDir = join(`./blogs`)

const blogNames = readdirSync(blogDir)

blogNames.forEach(nameWithExt => {
  if (!nameWithExt.endsWith('.md')) {
    return
  }
  const blogMarkdown = readFileSync(`${blogDir}/${nameWithExt}`, 'utf8')
  const blogHtml = marked.parse(blogMarkdown)
  const blogName = removeExt(nameWithExt)
  writeFileSync(`${blogDir}/${blogName}.html`, getPageHtml(blogName, blogHtml))
})
