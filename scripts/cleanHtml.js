import {rmSync, readdirSync} from 'node:fs'
import {join} from "node:path";

const blogHtmlDir = join(`./blogs`)

const blogNameList = readdirSync(blogHtmlDir)

blogNameList.forEach(nameWithExt => {
  rmSync(`${blogHtmlDir}/${nameWithExt}`)
})
