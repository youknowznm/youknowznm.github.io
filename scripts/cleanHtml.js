import {rmSync, readdirSync} from 'node:fs'
import {join} from "node:path";

const blogDir = join(`./blogs`)

const blogNames = readdirSync(blogDir)

blogNames.forEach(nameWithExt => {
  if (nameWithExt.endsWith('.html')) {
    rmSync(`${blogDir}/${nameWithExt}`)
  }
})
