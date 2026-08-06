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
      vcsRootExtId = "${DslContext.settingsRoot.id}"
      publisher = github {
        githubUrl = "https://api.github.com"
        authType = storedToken {
          tokenId = "tc_token_id:CID_7bac63521d33dff346806a0a72c1f875:-1:bf9e8acd-b8c2-4dbc-95fd-6ad054393aff"
        }
      }
      param("secure:github_access_token", "")
      param("github_oauth_user", "")
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
      buildFinishedSuccessfully = true
      firstSuccessAfterFailure = true
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
