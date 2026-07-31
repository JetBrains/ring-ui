package tests

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.DslContext
import jetbrains.buildServer.configs.kotlin.buildSteps.script

/**
 * Runs the Collapse/CollapsibleGroup test suites against the React 18 runtime.
 *
 * Collapse serializes the `inert` attribute differently for React 18 (empty-string
 * attribute form) and React 19 (real boolean), and the main test run — pinned to
 * React 19 — never exercises the React 18 branch even though `react >=18` is a
 * supported peer range. Runtime only: the repository is type-checked against the
 * React 19 typings, so no React 18 type packages are involved.
 *
 * TODO drop this build in develop-8.0 — Ring UI 8.0 supports React 19 only
 */
object React18Compat : BuildType({
  name = "React 18 runtime compatibility"

  allowExternalStatus = true

  params {
    param("env.NODE_OPTIONS", "--max-old-space-size=8192")
  }

  vcs {
    root(DslContext.settingsRoot)
  }

  steps {
    script {
      name = "Run Collapse tests on React 18"
      scriptContent = """
                #!/bin/bash
                set -e -x

                node -v
                npm -v

                chown -R root:root . # See https://github.com/npm/cli/issues/4589
                mkdir -p node_modules
                npm install
                npm install --no-save react@18 react-dom@18
                npx vitest run src/collapse src/collapsible-group
            """.trimIndent()
      dockerImage = "registry.jetbrains.team/p/ij/docker-hub/node:22.22.3"
    }
  }

  requirements {
    exists("docker.version")
    contains("docker.server.osType", "linux")
  }
})
