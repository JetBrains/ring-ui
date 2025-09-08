package tests

import builds.UnitTestsAndBuild
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.DslContext
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import jetbrains.buildServer.configs.kotlin.triggers.vcs

object A11yAudit : BuildType({
  name = "Accessibility Audit"

  allowExternalStatus = true
  artifactRules = "storybook-dist => storybook-dist.zip"
  buildNumberPattern = "${UnitTestsAndBuild.depParamRefs.buildNumber}"

  params {
    param("env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD", "")
    param("env.NODE_OPTIONS", "--max-old-space-size=8192")
    param("github.com.builduser.name", "")
    param("npmjs.com.auth.email", "")
    param("github.com.builduser.email", "")
    param("npmjs.com.auth.key", "credentialsJSON:7f08c5e7-ed45-4767-b103-5802c98c1d6c")
  }

  vcs {
    root(DslContext.settingsRoot)
  }

  steps {
    script {
      name = "Run audit"
      scriptContent = """
                #!/bin/bash
                set -e -x

                node -v
                npm -v

                chown -R root:root . # See https://github.com/npm/cli/issues/4589
                mkdir -p node_modules

                npm install

                npm run a11y-audit-ci
            """.trimIndent()
      dockerImage = "mcr.microsoft.com/playwright:v1.52.0"
    }
  }

  triggers {
    vcs {
      branchFilter = """
                +:*
                -:pull/*
            """.trimIndent()
    }
  }

  dependencies {
    dependency(UnitTestsAndBuild) {
      snapshot {}

      artifacts {
        cleanDestination = true
        artifactRules = "storybook-dist.zip!**=>storybook-dist"
      }
    }
  }

  requirements {
    exists("docker.version")
    contains("docker.server.osType", "linux")
  }
})
