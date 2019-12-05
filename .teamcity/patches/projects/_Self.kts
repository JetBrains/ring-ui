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
        expect {
            param("env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD", "true")
        }
        update {
            text("env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD", "true", allowEmpty = true)
        }
    }

    features {
        add {
            feature {
                type = "keepRules"
                id = "KEEP_RULE_2"
                param("limit.type", "all")
                param("keepData.1.type", "everything")
                param("ruleDisabled", "false")
                param("preserveArtifacts", "true")
            }
        }
    }
}
