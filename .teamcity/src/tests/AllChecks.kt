package tests

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.DslContext
import jetbrains.buildServer.configs.kotlin.FailureAction
import jetbrains.buildServer.configs.kotlin.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.buildFeatures.notifications
import jetbrains.buildServer.configs.kotlin.triggers.VcsTrigger
import jetbrains.buildServer.configs.kotlin.triggers.retryBuild
import jetbrains.buildServer.configs.kotlin.triggers.vcs

object AllChecks : BuildType({
  name = "All checks"

  type = Type.COMPOSITE

  maxRunningBuilds = 1

  vcs {
    root(DslContext.settingsRoot)

    showDependenciesChanges = true
  }

  triggers {
    vcs {
      quietPeriodMode = VcsTrigger.QuietPeriodMode.DO_NOT_USE
      triggerRules = "-:user=npmjs-buildserver:**"
      branchFilter = """
                +:*
                -:pull/*
            """.trimIndent()
    }
    retryBuild {
      delaySeconds = 60
      attempts = 1
    }
  }

  features {
    commitStatusPublisher {
      publisher = github {
        githubUrl = "https://api.github.com"
        authType = personalToken {
          token = "credentialsJSON:5ffe2d7e-531e-4f6f-b1fc-a41bfea26eaa"
        }
      }
      param("github_oauth_user", "Hypnosphi")
    }
    notifications {
      notifierSettings = slackNotifier {
        connection = "PROJECT_EXT_271"
        sendTo = "#ring-ui-alerts"
        messageFormat = simpleMessageFormat()
      }
      branchFilter = """
                    +:<default>
                    +:release-*
                """.trimIndent()
      buildFailedToStart = true
      buildFailed = true
      firstFailureAfterSuccess = true
    }
  }

  dependencies {
    snapshot(GeminiTests) {
      onDependencyCancel = FailureAction.ADD_PROBLEM
    }
    snapshot(QodanaAnalysis) {
      onDependencyFailure = FailureAction.IGNORE
      onDependencyCancel = FailureAction.ADD_PROBLEM
    }
    snapshot(A11yAudit) {
      onDependencyCancel = FailureAction.ADD_PROBLEM
    }
    snapshot(ConsoleErrors) {
      onDependencyCancel = FailureAction.ADD_PROBLEM
    }
  }
})
