import {marked} from 'marked'
import fs from 'fs'
import {join} from "node:path";

const removeExt = (fileName) => fileName.replace(/\.\S+$/g, '')

const getPageHtml = (blogName, blogHtml) => `
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>youknowznm | ${blogName}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="../styles/global.css">
      <link rel="shortcut icon" href="../images/avatar.png">
    </head>
    <body>
      <div class="blog-content markdown-body">
        ${blogHtml}
      </div>
      <footer class="blog-footer">
        Made with ❤️ by <a href="https://github.com/youknowznm" target="_blank">youknowznm</a>.
      </footer>
    </body>
  </html>
`

const blogDir = join(`./blogs`)

const blogNames = fs.readdirSync(blogDir)

blogNames.forEach(nameWithExt => {
  const blogMarkdown = fs.readFileSync(`${blogDir}/${nameWithExt}`, 'utf8')
  const blogHtml = marked.parse(blogMarkdown)
  const blogName = removeExt(nameWithExt)
  fs.writeFileSync(`${blogDir}/${blogName}.html`, getPageHtml(blogName, blogHtml))
})
