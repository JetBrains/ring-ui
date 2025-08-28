package publish

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.DslContext
import jetbrains.buildServer.configs.kotlin.ParameterDisplay
import jetbrains.buildServer.configs.kotlin.buildFeatures.Swabra
import jetbrains.buildServer.configs.kotlin.buildFeatures.swabra
import jetbrains.buildServer.configs.kotlin.buildSteps.script

object UnpublishSpecificVersion : BuildType({
  name = "Unpublish specific version"
  description = "If broken version is published, specify it in parameters and run Unpublish build configuration"

  params {
    text(
      "env.PACKAGE_NAME",
      "@jetbrains/ring-ui",
      label = "Package name",
      display = ParameterDisplay.PROMPT,
      allowEmpty = false
    )
    text(
      "env.PACKAGE_VERSION",
      "0.3.3",
      label = "Package version",
      display = ParameterDisplay.PROMPT,
      allowEmpty = false
    )
    param("env.NODE_OPTIONS", "--max-old-space-size=8192")
  }

  vcs {
    root(DslContext.settingsRoot)
  }

  steps {
    script {
      name = "Unpublish"
      scriptContent = """
                echo "##teamcity[buildNumber '%env.PACKAGE_NAME%@%env.PACKAGE_VERSION%']"

                echo "//registry.npmjs.org/:_authToken=%npmjs.com.auth.key%" > ~/.npmrc

                node -v
                npm -v

                npm unpublish %env.PACKAGE_NAME%@%env.PACKAGE_VERSION%
            """.trimIndent()
      dockerImage = "node:22"
    }
  }

  features {
    swabra {
      filesCleanup = Swabra.FilesCleanup.AFTER_BUILD
      paths = "~/.npmrc"
    }
  }

  requirements {
    contains("docker.server.osType", "linux")
  }
})
