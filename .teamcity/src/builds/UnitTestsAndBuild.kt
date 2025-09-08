package builds

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.DslContext
import jetbrains.buildServer.configs.kotlin.buildFeatures.Swabra
import jetbrains.buildServer.configs.kotlin.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.buildFeatures.investigationsAutoAssigner
import jetbrains.buildServer.configs.kotlin.buildFeatures.notifications
import jetbrains.buildServer.configs.kotlin.buildFeatures.swabra
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import jetbrains.buildServer.configs.kotlin.failureConditions.BuildFailureOnMetric
import jetbrains.buildServer.configs.kotlin.failureConditions.BuildFailureOnText
import jetbrains.buildServer.configs.kotlin.failureConditions.failOnMetricChange
import jetbrains.buildServer.configs.kotlin.failureConditions.failOnText
import jetbrains.buildServer.configs.kotlin.triggers.retryBuild
import jetbrains.buildServer.configs.kotlin.triggers.vcs

object UnitTestsAndBuild : BuildType({
  name = "Unit Tests and Build"

  allowExternalStatus = true
  artifactRules = """
        storybook-dist => storybook-dist.zip
        dist => dist.zip
        %teamcity.build.workingDir%/npmlogs/*.log=>npmlogsssssssssssssssssssss
        coverage => coverage.zip
        npm-ls.log
    """.trimIndent()

  params {
    param("env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD", "")
    param("env.GIT_AUTHOR_NAME", "")
    param("env.GIT_COMMITTER_EMAIL", "")
    param("github.com.builduser.name", "")
    param("npmjs.com.auth.email", "")
    param("github.com.builduser.email", "")
    param("env.NPM_TOKEN", "")
    param("env.GIT_COMMITTER_NAME", "")
    param("env.GIT_AUTHOR_EMAIL", "")
    param("npmjs.com.auth.key", "credentialsJSON:075c2e9e-0e12-4b18-9ec2-cb2f366d424e")
    param("env.NODE_OPTIONS", "--max-old-space-size=8192")
  }

  vcs {
    root(DslContext.settingsRoot)

    cleanCheckout = true
  }

  steps {
    script {
      name = "Test And Build"
      scriptContent = """
                #!/bin/bash
                set -e -x

                node -v
                npm -v
                chown -R root:root . # See https://github.com/npm/cli/issues/4589

                mkdir node_modules
                npm install

                npm run typecheck-ci
                npm run test-ci || true
                npm run build
                npm run build-stories
            """.trimIndent()
      dockerImage = "node:22"
      dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
      dockerRunParameters = "-v %teamcity.build.workingDir%/npmlogs:/root/.npm/_logs"
    }
  }

  triggers {
    vcs {
      enabled = false
      triggerRules = "-:user=npmjs-buildserver:**"
      branchFilter = "+:refs/heads/*"
    }
    retryBuild {
      enabled = false
      delaySeconds = 60
    }
  }

  failureConditions {
    failOnText {
      conditionType = BuildFailureOnText.ConditionType.CONTAINS
      pattern = "ERROR:"
      failureMessage = "console.error appeared in log"
      reverse = false
      enabled = false
    }
    failOnText {
      conditionType = BuildFailureOnText.ConditionType.CONTAINS
      pattern = "WARN:"
      failureMessage = "console.warn appeared in log"
      reverse = false
    }
    failOnText {
      conditionType = BuildFailureOnText.ConditionType.CONTAINS
      pattern = "LOG:"
      failureMessage = "console.log appeared in log"
      reverse = false
    }
    failOnMetricChange {
      metric = BuildFailureOnMetric.MetricType.INSPECTION_WARN_COUNT
      threshold = 0
      units = BuildFailureOnMetric.MetricUnit.DEFAULT_UNIT
      comparison = BuildFailureOnMetric.MetricComparison.MORE
      compareTo = value()
      param("anchorBuild", "lastSuccessful")
    }
    failOnMetricChange {
      metric = BuildFailureOnMetric.MetricType.COVERAGE_LINE_PERCENTAGE
      threshold = 4
      units = BuildFailureOnMetric.MetricUnit.DEFAULT_UNIT
      comparison = BuildFailureOnMetric.MetricComparison.LESS
      compareTo = build {
        buildRule = lastSuccessful()
      }
    }
    failOnMetricChange {
      metric = BuildFailureOnMetric.MetricType.TEST_COUNT
      threshold = 10
      units = BuildFailureOnMetric.MetricUnit.PERCENTS
      comparison = BuildFailureOnMetric.MetricComparison.LESS
      compareTo = build {
        buildRule = lastSuccessful()
      }
    }
  }

  features {
    swabra {
      filesCleanup = Swabra.FilesCleanup.AFTER_BUILD
      forceCleanCheckout = true
      verbose = true
      paths = ".npmrc"
    }
    commitStatusPublisher {
      publisher = github {
        githubUrl = "https://api.github.com"
        authType = personalToken {
          token = "credentialsJSON:5ffe2d7e-531e-4f6f-b1fc-a41bfea26eaa"
        }
      }
      param("github_oauth_user", "Hypnosphi")
    }
    commitStatusPublisher {
      enabled = false
      publisher = upsource {
        serverUrl = "https://upsource.jetbrains.com"
        projectId = "ring-ui"
        userName = "TeamCityReporter"
        password = "credentialsJSON:9eaa3cf0-4b14-49db-83f2-b141b3721922"
      }
    }
    investigationsAutoAssigner {
      excludeUsers = "npmjs-buildserver"
      assignOnSecondFailure = true
    }
    notifications {
      id = "SlackNofiticationToRingAlerts"
      notifierSettings = slackNotifier {
        connection = "PROJECT_EXT_486"
        sendTo = "#ring-ui-alerts"
        messageFormat = simpleMessageFormat()
      }
      enabled = true
      branchFilter = "+:<default>"
      buildFailed = true
      firstFailureAfterSuccess = true
      newBuildProblemOccurred = false
      buildFinishedSuccessfully = true
      firstSuccessAfterFailure = true
    }
  }
})
