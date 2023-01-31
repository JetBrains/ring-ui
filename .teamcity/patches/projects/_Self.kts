package patches.projects

import jetbrains.buildServer.configs.kotlin.v2018_2.*
import jetbrains.buildServer.configs.kotlin.v2018_2.Project
import jetbrains.buildServer.configs.kotlin.v2018_2.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the root project
accordingly, and delete the patch script.
*/
changeProject(DslContext.projectId) {
    params {
        add {
            password("env.QODANA_TOKEN", "credentialsJSON:1b6fe259-bfcd-45f5-be23-e2625685a0f6", display = ParameterDisplay.HIDDEN)
        }
    }
}
