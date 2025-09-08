package builds

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.DslContext
import jetbrains.buildServer.configs.kotlin.FailureAction
import jetbrains.buildServer.configs.kotlin.buildFeatures.Swabra
import jetbrains.buildServer.configs.kotlin.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.buildFeatures.sshAgent
import jetbrains.buildServer.configs.kotlin.buildFeatures.swabra
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import jetbrains.buildServer.configs.kotlin.failureConditions.BuildFailureOnMetric.*
import jetbrains.buildServer.configs.kotlin.failureConditions.BuildFailureOnText
import jetbrains.buildServer.configs.kotlin.failureConditions.failOnMetricChange
import jetbrains.buildServer.configs.kotlin.failureConditions.failOnText
import jetbrains.buildServer.configs.kotlin.triggers.finishBuildTrigger
import jetbrains.buildServer.configs.kotlin.triggers.retryBuild
import jetbrains.buildServer.configs.kotlin.triggers.vcs
import publish.Publish
import tests.AllChecks


object Deploy : BuildType({
  name = "Production build"
  description = "Build documentation for publishing"

  allowExternalStatus = true
  artifactRules = """
        %teamcity.build.workingDir%/npmlogs/*.log=>npmlogs
        storybook-dist => storybook-dist.zip
    """.trimIndent()
  buildNumberPattern = "${UnitTestsAndBuild.depParamRefs.buildNumber}"

  params {
    param("env.NODE_OPTIONS", "--max-old-space-size=8192")
  }

  vcs {
    root(DslContext.settingsRoot)
  }

  steps {
    script {
      name = "Build for production"
      scriptContent = """
                #!/bin/bash
                set -e -x

                node -v
                npm -v

                chown -R root:root . # See https://github.com/npm/cli/issues/4589
                mkdir node_modules
                npm install
                npm run build-stories
            """.trimIndent()
      dockerImage = "node:22"
      dockerRunParameters = "-v %teamcity.build.workingDir%/npmlogs:/root/.npm/_logs"
    }
  }

  triggers {
    vcs {
      enabled = false
      triggerRules = "-:user=npmjs-buildserver:**"
      branchFilter = """
                +:*
                -:pull/*
            """.trimIndent()
    }
    retryBuild {
      delaySeconds = 60
    }
    finishBuildTrigger {
      enabled = false
      buildType = "JetBrainsUi_RingUi_Build"
      successfulOnly = true
    }
    finishBuildTrigger {
      enabled = false
      buildType = "${Publish.id}"
      successfulOnly = true
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
      metric = MetricType.INSPECTION_WARN_COUNT
      threshold = 0
      units = MetricUnit.DEFAULT_UNIT
      comparison = MetricComparison.MORE
      compareTo = value()
      param("anchorBuild", "lastSuccessful")
    }
  }

  features {
    sshAgent {
      enabled = false
      teamcitySshKey = "GitHub ring-ui"
      param("secure:passphrase", "credentialsJSON:60650742-17f8-4b5d-82b2-7108f9408655")
    }
    swabra {
      filesCleanup = Swabra.FilesCleanup.AFTER_BUILD
      forceCleanCheckout = true
      verbose = true
      paths = ".npmrc"
    }
    commitStatusPublisher {
      vcsRootExtId = "${DslContext.settingsRoot.id}"
      publisher = github {
        githubUrl = "https://api.github.com"
        authType = personalToken {
          token = "credentialsJSON:5ffe2d7e-531e-4f6f-b1fc-a41bfea26eaa"
        }
      }
    }
  }

  dependencies {
    snapshot(AllChecks) {
      onDependencyFailure = FailureAction.ADD_PROBLEM
    }
  }

  requirements {
    doesNotContain("env.OS", "Windows")
  }
})
