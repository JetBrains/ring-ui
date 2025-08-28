package tests

import builds.UnitTestsAndBuild
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.DslContext
import jetbrains.buildServer.configs.kotlin.FailureAction
import jetbrains.buildServer.configs.kotlin.ParameterDisplay
import jetbrains.buildServer.configs.kotlin.buildFeatures.Swabra
import jetbrains.buildServer.configs.kotlin.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.buildFeatures.notifications
import jetbrains.buildServer.configs.kotlin.buildFeatures.swabra
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import jetbrains.buildServer.configs.kotlin.failureConditions.BuildFailureOnMetric
import jetbrains.buildServer.configs.kotlin.failureConditions.BuildFailureOnText
import jetbrains.buildServer.configs.kotlin.failureConditions.failOnMetricChange
import jetbrains.buildServer.configs.kotlin.failureConditions.failOnText
import jetbrains.buildServer.configs.kotlin.triggers.vcs

object GeminiTests : BuildType({
  name = "Visual Regression Tests"
  description = "Screenshots based snapshot tests"

  allowExternalStatus = true
  artifactRules = """
        packages/screenshots/html-report/ => html-report.zip
        packages/screenshots/*.log
    """.trimIndent()
  buildNumberPattern = "${UnitTestsAndBuild.depParamRefs.buildNumber}"
  maxRunningBuilds = 1

  params {
    param("github.com.builduser.name", "")
    password(
      "env.BROWSERSTACK_KEY",
      "credentialsJSON:080a4e07-08b0-4450-8347-ddd8760b4f42",
      display = ParameterDisplay.HIDDEN
    )
    param("env.BROWSERSTACK_NAME", "sadf7")
    param("npmjs.com.auth.email", "")
    param("github.com.builduser.email", "")
    param("npmjs.com.auth.key", "credentialsJSON:175b3950-943c-4803-99c4-56d5f6ac422a")
    param("env.NODE_OPTIONS", "--max-old-space-size=8192")
    password("env.NGROK_TOKEN", "credentialsJSON:56069693-43e9-4c45-ac02-a0ca8913f080")
    param("env.GIT_LFS_SKIP_SMUDGE", "false")
  }

  vcs {
    root(DslContext.settingsRoot)
  }

  steps {
    script {
      name = "Run screenshot tests"
      scriptContent = """
                #!/bin/bash
                set -e -x

                node -v
                npm -v
                chown -R root:root . # See https://github.com/npm/cli/issues/4589

                mkdir -p node_modules
                npm install

                cd packages/screenshots
                # ! We run tests against built Storybook from another build configuration
                npm run test-ci
            """.trimIndent()
      dockerImage = "node:22"
      dockerRunParameters = "-p 4445:4445 -p 9999:9999 -v %teamcity.build.workingDir%/npmlogs:/root/.npm/_logs"
      param("org.jfrog.artifactory.selectedDeployableServer.downloadSpecSource", "Job configuration")
      param("org.jfrog.artifactory.selectedDeployableServer.useSpecs", "false")
      param("org.jfrog.artifactory.selectedDeployableServer.uploadSpecSource", "Job configuration")
    }
  }

  triggers {
    vcs {
      enabled = false
      branchFilter = "+:refs/heads/*"
    }
  }

  failureConditions {
    javaCrash = false
    errorMessage = true
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

  features {
    swabra {
      enabled = false
      filesCleanup = Swabra.FilesCleanup.AFTER_BUILD
      forceCleanCheckout = true
      verbose = true
      paths = """
                *.log
                packages/docs/dist
            """.trimIndent()
    }
    commitStatusPublisher {
      publisher = github {
        githubUrl = "https://api.github.com"
        authType = personalToken {
          token = "credentialsJSON:5ffe2d7e-531e-4f6f-b1fc-a41bfea26eaa"
        }
      }
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

  dependencies {
    dependency(UnitTestsAndBuild) {
      snapshot {
        onDependencyFailure = FailureAction.FAIL_TO_START
      }

      artifacts {
        cleanDestination = true
        artifactRules = "storybook-dist.zip!**=>storybook-dist"
      }
    }
  }

  requirements {
    exists("docker.version")
    contains("docker.server.osType", "linux")
    exists("teamcity.gitLfs.version")
  }
})
