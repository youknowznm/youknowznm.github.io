import {marked} from 'marked'
import fs from 'fs'
import {join} from "node:path";

const removeExt = (fileName) => fileName.replace(/\.\S+$/g, '')

// eslint-disable-next-line no-undef
const workingDir = process.cwd()

const wrap = (nameWithoutExt, blogHtml) => `
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>youknowznm | ${nameWithoutExt}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="../styles/global.css">
      
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap" rel="stylesheet">
      
<!--      <link rel="shortcut icon" href="./src/images/avatar_mini.png">-->
    </head>
    <body>
      <div class="blog-content markdown-body">
        ${blogHtml}
      </div>
    </body>
  </html>
`

const blogDir = join(`${workingDir}/blogs`)

const blogNames = fs.readdirSync(blogDir)

blogNames.forEach(blogName => {
  const blogMarkdown = fs.readFileSync(`${blogDir}/${blogName}`, 'utf8')
  const blogHtml = marked.parse(blogMarkdown)
  const nameWithoutExt = removeExt(blogName)
  fs.writeFileSync(`${blogDir}/${nameWithoutExt}.html`, wrap(nameWithoutExt, blogHtml))
})
