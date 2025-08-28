package publish

import builds.Deploy
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.DslContext
import jetbrains.buildServer.configs.kotlin.FailureAction
import jetbrains.buildServer.configs.kotlin.buildFeatures.Swabra
import jetbrains.buildServer.configs.kotlin.buildFeatures.notifications
import jetbrains.buildServer.configs.kotlin.buildFeatures.sshAgent
import jetbrains.buildServer.configs.kotlin.buildFeatures.swabra
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import jetbrains.buildServer.configs.kotlin.failureConditions.BuildFailureOnMetric
import jetbrains.buildServer.configs.kotlin.failureConditions.BuildFailureOnText
import jetbrains.buildServer.configs.kotlin.failureConditions.failOnMetricChange
import jetbrains.buildServer.configs.kotlin.failureConditions.failOnText
import jetbrains.buildServer.configs.kotlin.triggers.VcsTrigger
import jetbrains.buildServer.configs.kotlin.triggers.finishBuildTrigger
import jetbrains.buildServer.configs.kotlin.triggers.retryBuild
import jetbrains.buildServer.configs.kotlin.triggers.vcs

object PublishToGitHubPages : BuildType({
  name = "Deploy to GitHub Pages"

  allowExternalStatus = true
  enablePersonalBuilds = false
  artifactRules = "%teamcity.build.workingDir%/npmlogs/*.log=>npmlogs"
  type = Type.DEPLOYMENT
  maxRunningBuilds = 1

  params {
    param("env.NODE_OPTIONS", "--max-old-space-size=8192")
    param("org.jfrog.artifactory.selectedDeployableServer.downloadSpecSource", "Job configuration")
    param("org.jfrog.artifactory.selectedDeployableServer.useSpecs", "false")
    param("org.jfrog.artifactory.selectedDeployableServer.uploadSpecSource", "Job configuration")
    password("env.CHROMATIC_PROJECT_TOKEN", "credentialsJSON:14b73cdb-03e5-4b8f-b8c1-77d370951b9f")
    password("env.FIGMA_CODE_CONNECT_TOKEN", "credentialsJSON:a10e2416-609f-4616-b94b-8c6ecf150c5d")
  }

  vcs {
    root(DslContext.settingsRoot)
    branchFilter = """
            +:master
            +:<default>
            +:release-*
        """.trimIndent()
  }

  steps {
    script {
      name = "Publish"
      scriptContent = """
                #!/bin/bash
                set -e -x

                node -v
                npm -v
                chown -R root:root . # See https://github.com/npm/cli/issues/4589

                mkdir -p ~/.ssh/
                touch ~/.ssh/config
                cat << EOT >> ~/.ssh/config
                Host github.com
                    StrictHostKeyChecking no
                    UserKnownHostsFile /dev/null
                EOT

                chmod 644 ~/.ssh/config

                # GitHub authorization
                git config user.email "%github.com.builduser.email%"
                git config user.name "%github.com.builduser.name%"

                npx gh-pages --dist storybook-dist --dest %teamcity.build.branch% --message "Deploy %teamcity.build.branch%" --nojekyll
                npm ci
                npm run chromatic
                npm run figma-connect-unpublish
                npm run figma-connect-publish
            """.trimIndent()
      dockerImage = "node:22"
      dockerRunParameters = "-v %teamcity.build.workingDir%/npmlogs:/root/.npm/_logs"
    }
  }

  triggers {
    retryBuild {
      delaySeconds = 60
    }
    finishBuildTrigger {
      enabled = false
      buildType = "${Deploy.id}"
      successfulOnly = true
      branchFilter = ""
    }
    vcs {
      quietPeriodMode = VcsTrigger.QuietPeriodMode.USE_DEFAULT
      triggerRules = ""
    }
  }

  failureConditions {
    failOnText {
      conditionType = BuildFailureOnText.ConditionType.CONTAINS
      pattern = "ERROR:"
      failureMessage = "console.error appeared in log"
      reverse = false
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
  }

  features {
    sshAgent {
      teamcitySshKey = "GitHub ring-ui"
      param("secure:passphrase", "credentialsJSON:60650742-17f8-4b5d-82b2-7108f9408655")
    }
    swabra {
      filesCleanup = Swabra.FilesCleanup.AFTER_BUILD
      forceCleanCheckout = true
      verbose = true
      paths = ".npmrc"
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
    dependency(Deploy) {
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
    contains("system.agent.name", "Ubuntu")
  }
})

