import {marked} from 'marked'
import fs from 'fs'
import {join} from "node:path";

const removeExt = (fileName) => fileName.replace(/\.\S+$/g, '')

const wrap = (nameWithoutExt, blogHtml) => `
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>youknowznm | ${nameWithoutExt}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="../styles/global.css">
      <link rel="shortcut icon" href="../images/avatar.png">
    </head>
    <body>
      <div class="blog-content markdown-body">
        ${blogHtml}
      </div>
      <footer class="blog-footer">
        <code>Made with ❤️ by <a href="https://github.com/youknowznm" target="_blank">youknowznm</a>.</code>
      </footer>
    </body>
  </html>
`

const blogDir = join(`./blogs`)

const blogNames = fs.readdirSync(blogDir)

blogNames.forEach(blogName => {
  const blogMarkdown = fs.readFileSync(`${blogDir}/${blogName}`, 'utf8')
  const blogHtml = marked.parse(blogMarkdown)
  const nameWithoutExt = removeExt(blogName)
  fs.writeFileSync(`${blogDir}/${nameWithoutExt}.html`, wrap(nameWithoutExt, blogHtml))
})
