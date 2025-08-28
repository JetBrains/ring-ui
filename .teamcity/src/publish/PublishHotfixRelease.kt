package publish

import tests.GeminiTests
import jetbrains.buildServer.configs.kotlin.AbsoluteId
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
import jetbrains.buildServer.configs.kotlin.triggers.retryBuild

object PublishHotfixRelease : BuildType({
  templates(AbsoluteId("JetBrainsUi_LernaPublish"))
  name = "Publish @hotfix (release-*)"
  paused = true
  allowExternalStatus = true
  artifactRules = """
        %teamcity.build.workingDir%/npmlogs/*.log=>npmlogs
        dist=>dist.zip
    """.trimIndent()

  params {
    param("env.NPM_VERSION_PARAMS", "patch --preid hotfix")
    param("env.NPM_PUBLISH_PARAMS", "--tag hotfix")
    param("env.NODE_OPTIONS", "--max-old-space-size=8192")
  }

  vcs {
    root(DslContext.settingsRoot)
    branchFilter = "+:release-*"
  }

  steps {
    script {
      name = "Publish"
      id = "RUNNER_1461"
      scriptContent = """
                #!/bin/bash
                set -e -x

                # Required for docker
                mkdir -p ~/.ssh/
                touch ~/.ssh/config
                cat << EOT >> ~/.ssh/config
                Host github.com
                    StrictHostKeyChecking no
                    UserKnownHostsFile /dev/null
                EOT

                node -v
                npm -v

                chmod 644 ~/.ssh/config

                # GitHub and NPM authorization
                git config --system --add safe.directory '*' # Fix for "fatal: detected dubious ownership in repository"
                git config user.email "%github.com.builduser.email%"
                git config user.name "%github.com.builduser.name%"

                echo "//registry.npmjs.org/:_authToken=%npmjs.com.auth.key%" > ~/.npmrc

                curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | bash
                apt-get install git-lfs

                if [ -n "${'$'}(git status --porcelain)" ]; then
                  git status
                  echo "Your git status is not clean. Aborting.";
                  exit 1;
                fi

                npm whoami

                chown -R root:root . # See https://github.com/npm/cli/issues/4589
                mkdir node_modules
                npm install

                # Reset possibly changed lock to avoid "git status is not clear" error
                git checkout package.json package-lock.json
                npm run build
                npm run release-ci
                cat package.json

                ########## Here goes publishing of pre-built version
                if [ ! -d "./dist" ]
                then
                    echo "Directory ./dist does NOT exists. Build failed." >>/dev/stderr
                    exit 333
                fi
                rm -rf components
                mv dist components
                npm run release-built-ci
                ########## End of pre-built version publishing
                cat package.json

                function publishBuildNumber {
                    local VERSION=${'$'}(node -p 'require("./package.json").version')
                    echo "##teamcity[buildNumber '${'$'}VERSION']"
                }

                publishBuildNumber

                #chmod 777 ~/.ssh/config
            """.trimIndent()
      dockerImage = "node:22"
      dockerRunParameters = "-v %teamcity.build.workingDir%/npmlogs:/root/.npm/_logs"
    }
    stepsOrder = arrayListOf("RUNNER_1461")
  }

  triggers {
    retryBuild {
      id = "retryBuildTrigger"
      delaySeconds = 60
    }
  }

  failureConditions {
    failOnText {
      id = "BUILD_EXT_184"
      conditionType = BuildFailureOnText.ConditionType.CONTAINS
      pattern = "ERROR:"
      failureMessage = "console.error appeared in log"
      reverse = false
    }
    failOnText {
      id = "BUILD_EXT_185"
      conditionType = BuildFailureOnText.ConditionType.CONTAINS
      pattern = "WARN:"
      failureMessage = "console.warn appeared in log"
      reverse = false
    }
    failOnText {
      id = "BUILD_EXT_186"
      conditionType = BuildFailureOnText.ConditionType.CONTAINS
      pattern = "LOG:"
      failureMessage = "console.log appeared in log"
      reverse = false
    }
    failOnMetricChange {
      id = "BUILD_EXT_187"
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
      id = "ssh-agent-build-feature"
      teamcitySshKey = "GitHub ring-ui"
      param("secure:passphrase", "credentialsJSON:60650742-17f8-4b5d-82b2-7108f9408655")
    }
    swabra {
      id = "swabra"
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
    snapshot(GeminiTests) {
      onDependencyFailure = FailureAction.CANCEL
      onDependencyCancel = FailureAction.CANCEL
    }
  }
})

