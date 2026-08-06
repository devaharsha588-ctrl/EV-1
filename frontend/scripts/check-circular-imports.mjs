import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import ts from "typescript"

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const srcDir = path.join(rootDir, "src")
const extensions = [".ts", ".tsx", ".js", ".jsx"]

function collectSourceFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const resolvedPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      return collectSourceFiles(resolvedPath)
    }

    return extensions.some((extension) => entry.name.endsWith(extension))
      ? [resolvedPath]
      : []
  })
}

function normalizePath(filePath) {
  return path.relative(srcDir, filePath).replaceAll(path.sep, "/")
}

function resolveImport(fromFile, specifier) {
  if (specifier.startsWith("@/")) {
    return resolveFile(path.join(srcDir, specifier.slice(2)))
  }

  if (specifier.startsWith(".")) {
    return resolveFile(path.resolve(path.dirname(fromFile), specifier))
  }

  return null
}

function resolveFile(candidatePath) {
  if (fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile()) {
    return candidatePath
  }

  for (const extension of extensions) {
    const filePath = `${candidatePath}${extension}`
    if (fs.existsSync(filePath)) {
      return filePath
    }
  }

  for (const extension of extensions) {
    const indexPath = path.join(candidatePath, `index${extension}`)
    if (fs.existsSync(indexPath)) {
      return indexPath
    }
  }

  return null
}

function readImports(filePath) {
  const sourceText = fs.readFileSync(filePath, "utf8")
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  )
  const imports = []

  function visit(node) {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      imports.push(node.moduleSpecifier.text)
    }

    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments[0] &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      imports.push(node.arguments[0].text)
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return imports
}

function findCycles(graph) {
  const cycles = []
  const stack = []
  const visited = new Set()
  const visiting = new Set()

  function visit(node) {
    if (visiting.has(node)) {
      const startIndex = stack.indexOf(node)
      cycles.push([...stack.slice(startIndex), node])
      return
    }

    if (visited.has(node)) {
      return
    }

    visiting.add(node)
    stack.push(node)

    for (const child of graph.get(node) ?? []) {
      visit(child)
    }

    stack.pop()
    visiting.delete(node)
    visited.add(node)
  }

  for (const node of graph.keys()) {
    visit(node)
  }

  return cycles
}

const sourceFiles = collectSourceFiles(srcDir)
const knownFiles = new Set(sourceFiles.map(normalizePath))
const graph = new Map()

for (const filePath of sourceFiles) {
  const imports = readImports(filePath)
    .map((specifier) => resolveImport(filePath, specifier))
    .filter(Boolean)
    .map(normalizePath)
    .filter((specifier) => knownFiles.has(specifier))

  graph.set(normalizePath(filePath), imports)
}

const cycles = findCycles(graph)

if (cycles.length > 0) {
  console.error("Circular imports detected:")
  for (const cycle of cycles) {
    console.error(`- ${cycle.join(" -> ")}`)
  }
  process.exitCode = 1
} else {
  console.log("No circular imports detected.")
}
