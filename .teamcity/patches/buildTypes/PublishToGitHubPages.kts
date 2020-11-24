package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.v2018_2.*
import jetbrains.buildServer.configs.kotlin.v2018_2.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.v2018_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2018_2.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = 'PublishToGitHubPages'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("PublishToGitHubPages")) {
    expectSteps {
        script {
            name = "Publish"
            scriptContent = """
                #!/bin/bash
                set -e -x
                
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
                
                npx gh-pages --dist dist --dest %teamcity.build.branch% --message "Deploy %teamcity.build.branch%"
            """.trimIndent()
            dockerImage = "node:latest"
            dockerRunParameters = "-v %teamcity.build.workingDir%/npmlogs:/root/.npm/_logs"
        }
    }
    steps {
        update<ScriptBuildStep>(0) {
            clearConditions()
            scriptContent = """
                #!/bin/bash
                set -e -x
                
                node -v
                npm -v
                
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
                
                npx gh-pages --dist dist --dest %teamcity.build.branch% --message "Deploy %teamcity.build.branch%"
            """.trimIndent()
            dockerImage = "node:14"
        }
    }

    requirements {
        remove {
            contains("system.agent.name", "ubuntu-16.04")
        }
        add {
            contains("system.agent.name", "Ubuntu")
        }
    }
}
