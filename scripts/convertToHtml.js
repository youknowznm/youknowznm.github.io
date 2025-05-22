import {marked} from 'marked'
import {readdirSync, readFileSync, writeFileSync} from 'node:fs'

const removeFileNameExt = (fileName) => fileName.replace(/\.\S+$/g, '')

const githubLink = 'https://github.com/youknowznm'

const getPageHtml = (blogName, blogHtml) => `
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>youknowznm · ${blogName}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="../styles/global.css">
      <link rel="icon" href="../styles/avatar.png">
      <link rel="stylesheet" href="../utils/highlightjs/catppuccin-macchiato.css" media="(prefers-color-scheme: dark)">
      <link rel="stylesheet" href="../utils/highlightjs/catppuccin-latte.css" media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)">
      <script src="../utils/highlightjs/highlight.min.js"></script>
      <script>hljs.highlightAll()</script>
    </head>
    <body>
      <div class="container">
        <div class="blog-nav">
          <ul>
            <li><a href="">faflfja;dlfjad;lfjdlfja;fjaldfj;daf;s</a></li>
            <li><a href="">faflfj</a></li>
            <li><a href="">faflfja;dlfjad;lfjdlfja;fjaldfj;daf;s</a></li>
          </ul>
        </div>
<!--        <div class="nav-trigger" />-->
        <div class="blog-content-wrap">
          <div class="blog-content markdown-body">
            ${blogHtml}
          </div>
        </div>
        <footer class="blog-footer">
          <p class="blog-footer-code">
            Made with ❤️ by <a href="${githubLink}" target="_blank" class="blog-footer-code">youknowznm</a>.
          </p>
        </footer>
      </div>
    </body>
  </html>
`

const blogSourceDir = './blogSource'
const blogHtmlDir = './blogs'

const blogSourceNameList = readdirSync(blogSourceDir)

const renderer = new marked.Renderer()
renderer.link = ({href, text}) => `<a target="_blank" href="${href}">${text}` + '</a>'
marked.setOptions({
  renderer,
  gfm: true
})

blogSourceNameList.forEach(nameWithExt => {
  if (!nameWithExt.endsWith('.md')) {
    return
  }
  const blogMarkdown = readFileSync(`${blogSourceDir}/${nameWithExt}`, 'utf8')
  const blogHtml = marked.parse(blogMarkdown)
  const blogName = removeFileNameExt(nameWithExt)
  writeFileSync(`${blogHtmlDir}/${blogName}.html`, getPageHtml(blogName, blogHtml))
})
