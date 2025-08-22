package tests

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.DslContext
import jetbrains.buildServer.configs.kotlin.ParameterDisplay
import jetbrains.buildServer.configs.kotlin.buildSteps.qodana
import jetbrains.buildServer.configs.kotlin.triggers.vcs

object QodanaAnalysis : BuildType({
  name = "Qodana Analyze"

  params {
    password(
      "env.QODANA_TOKEN",
      "credentialsJSON:1b6fe259-bfcd-45f5-be23-e2625685a0f6",
      display = ParameterDisplay.HIDDEN
    )
  }

  vcs {
    root(DslContext.settingsRoot)
  }

  steps {
    qodana {
      name = "Run Qodana for JS"
      linter = customLinter {
        image = "jetbrains/qodana-js:2025.2"
      }
      additionalDockerArguments = "-e QODANA_TOKEN=%env.QODANA_TOKEN%"
      additionalQodanaArguments = "--config .qodana/qodana.yaml"
      collectAnonymousStatistics = true
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
    executionTimeoutMin = 30
  }
  requirements {
    contains("docker.server.osType", "linux")
  }
})
