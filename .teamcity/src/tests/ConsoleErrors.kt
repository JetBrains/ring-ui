package tests

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.DslContext
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import jetbrains.buildServer.configs.kotlin.failureConditions.BuildFailureOnMetric
import jetbrains.buildServer.configs.kotlin.failureConditions.BuildFailureOnText
import jetbrains.buildServer.configs.kotlin.failureConditions.failOnMetricChange
import jetbrains.buildServer.configs.kotlin.failureConditions.failOnText
import jetbrains.buildServer.configs.kotlin.triggers.vcs


object ConsoleErrors : BuildType({
  name = "Console errors in stories"

  allowExternalStatus = true

  params {
    param("github.com.builduser.name", "")
    param("npmjs.com.auth.email", "")
    param("github.com.builduser.email", "")
    param("npmjs.com.auth.key", "credentialsJSON:7f08c5e7-ed45-4767-b103-5802c98c1d6c")
    param("env.NODE_OPTIONS", "--max-old-space-size=8192")
  }

  vcs {
    root(DslContext.settingsRoot)
  }

  steps {
    script {
      name = "Run test"
      scriptContent = """
                #!/bin/bash
                set -e -x

                node -v
                npm -v

                chown -R root:root . # See https://github.com/npm/cli/issues/4589
                mkdir -p node_modules
                npm install
                npm run console-errors-ci
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
  }

  failureConditions {
    nonZeroExitCode = false
    failOnMetricChange {
      metric = BuildFailureOnMetric.MetricType.TEST_COUNT
      threshold = 50
      units = BuildFailureOnMetric.MetricUnit.PERCENTS
      comparison = BuildFailureOnMetric.MetricComparison.LESS
      compareTo = build {
        buildRule = lastSuccessful()
      }
    }
    failOnText {
      conditionType = BuildFailureOnText.ConditionType.CONTAINS
      pattern = "console.warn"
      reverse = false
    }
  }

  requirements {
    exists("docker.version")
    contains("docker.server.osType", "linux")
  }
})
