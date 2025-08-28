package tests

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.DslContext
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import jetbrains.buildServer.configs.kotlin.triggers.schedule
import jetbrains.buildServer.configs.kotlin.triggers.vcs

object SecurityAudit : BuildType({
  name = "Dependencies security audit"

  allowExternalStatus = true

  artifactRules = "npm-audit.html"

  params {
    param("github.com.builduser.name", "")
    param("npmjs.com.auth.email", "")
    param("github.com.builduser.email", "")
    param("npmjs.com.auth.key", "credentialsJSON:7f08c5e7-ed45-4767-b103-5802c98c1d6c")
    param("env.NODE_OPTIONS", "--max-old-space-size=8192")
    param("env.SEVERITY_LEVEL", "critical")
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
                node scripts/security-audit-ci.js
            """.trimIndent()
      dockerImage = "node:22"
    }
  }

  triggers {
    vcs {
      branchFilter = """
                +:*
                -:pull/*
            """.trimIndent()
    }
    schedule {
      branchFilter = "+:<default>"
      triggerBuild = always()
      withPendingChangesOnly = false
    }
  }

  requirements {
    exists("docker.version")
    contains("docker.server.osType", "linux")
  }
})
