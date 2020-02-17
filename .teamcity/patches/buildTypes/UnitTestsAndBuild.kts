package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.v2018_2.*
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.CommitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.investigationsAutoAssigner
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.RetryBuildTrigger
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.retryBuild
import jetbrains.buildServer.configs.kotlin.v2018_2.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = 'UnitTestsAndBuild'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("UnitTestsAndBuild")) {
    params {
        add {
            param("env.ELECTRON_ENABLE_LOGGING", "false")
        }
    }

    triggers {
        val trigger1 = find<RetryBuildTrigger> {
            retryBuild {
                delaySeconds = 60
            }
        }
        trigger1.apply {
            enabled = false
        }
    }

    features {
        val feature1 = find<CommitStatusPublisher> {
            commitStatusPublisher {
                publisher = github {
                    githubUrl = "https://api.github.com"
                    authType = personalToken {
                        token = "credentialsJSON:5ffe2d7e-531e-4f6f-b1fc-a41bfea26eaa"
                    }
                }
            }
        }
        feature1.apply {
            param("github_oauth_user", "Hypnosphi")
        }
        add {
            investigationsAutoAssigner {
                excludeUsers = "npmjs-buildserver"
                assignOnSecondFailure = true
            }
        }
    }
}
