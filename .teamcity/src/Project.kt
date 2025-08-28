import builds.Deploy
import builds.UnitTestsAndBuild
import publish.Publish
import publish.PublishHotfixRelease
import publish.PublishNext
import publish.PublishToGitHubPages
import publish.UnpublishSpecificVersion
import tests.A11yAudit
import tests.AllChecks
import tests.ConsoleErrors
import tests.GeminiTests
import tests.QodanaAnalysis
import tests.SecurityAudit

import jetbrains.buildServer.configs.kotlin.ParameterDisplay
import jetbrains.buildServer.configs.kotlin.Project
import jetbrains.buildServer.configs.kotlin.projectFeatures.buildReportTab

object Project : Project({
  description = "https://jetbrains.github.io/ring-ui/"

  buildType(A11yAudit)
  buildType(ConsoleErrors)
  buildType(SecurityAudit)
  buildType(UnpublishSpecificVersion)
  buildType(GeminiTests)
  buildType(QodanaAnalysis)
  buildType(UnitTestsAndBuild)
  buildType(Publish)
  buildType(Deploy)
  buildType(PublishNext)
  buildType(AllChecks)
  buildType(PublishToGitHubPages)
  buildType(PublishHotfixRelease)

  params {
    param(
      "vcs.branch.spec", """
            +:refs/heads/*
            +:refs/(pull/*)/merge
            -:refs/heads/gh-pages
        """.trimIndent()
    )
    text("env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD", "true", allowEmpty = true)
    password(
      "env.QODANA_TOKEN",
      "credentialsJSON:1b6fe259-bfcd-45f5-be23-e2625685a0f6",
      display = ParameterDisplay.HIDDEN
    )
    param("github.com.builduser.name", "JetBrains Ring UI Automation")
    param("env.GIT_LFS_SKIP_SMUDGE", "true")
  }

  features {
    feature {
      id = "PROJECT_EXT_121"
      type = "ReportTab"
      param("buildTypeId", "JetBrainsUi_RingUi_Deploy")
      param("startPage", "storybook-dist.zip!index.html")
      param("revisionRuleName", "lastSuccessful")
      param("title", "Storybook")
      param("type", "ProjectReportTab")
    }
    feature {
      id = "PROJECT_EXT_122"
      type = "ReportTab"
      param("startPage", "html-report.zip!index.html")
      param("title", "Visual Regression")
      param("type", "BuildReportTab")
    }
    feature {
      id = "PROJECT_EXT_123"
      type = "ReportTab"
      param("startPage", "storybook-dist.zip!index.html")
      param("title", "Storybook")
      param("type", "BuildReportTab")
    }
    feature {
      id = "PROJECT_EXT_124"
      type = "ReportTab"
      param("startPage", "storybook-dist.zip!index.html")
      param("title", "Storybook")
      param("type", "BuildReportTab")
    }
    feature {
      id = "PROJECT_EXT_126"
      type = "ReportTab"
      param("buildTypeId", "JetBrainsUi_RingUi_Build")
      param("startPage", "ring-ui/index.html")
      param("revisionRuleName", "buildTag")
      param("revisionRuleBuildTag", "1.0")
      param("title", "Docs 1.0")
      param("type", "ProjectReportTab")
    }
    feature {
      id = "PROJECT_EXT_151"
      type = "buildtype-graphs"
      param(
        "series", """
                [
                  {
                    "type": "valueType",
                    "title": "Artifacts Size",
                    "key": "VisibleArtifactsSize"
                  }
                ]
            """.trimIndent()
      )
      param("format", "text")
      param("title", "New chart title")
      param("seriesTitle", "Serie")
    }
    feature {
      id = "PROJECT_EXT_180"
      type = "Invitation"
      param("createdByUserId", "7441")
      param("invitationType", "joinProjectInvitation")
      param("roleId", "PROJECT_DEVELOPER")
      param("secure:token", "credentialsJSON:1f88a20a-ef97-43fa-927d-4f94c883c996")
      param("name", "Join project")
      param(
        "welcomeText",
        "Andrey Skladchikov invites you to join the JetBrains Public Projects :: JetBrains UI :: Ring UI project"
      )
      param("disabled", "false")
      param("multi", "true")
    }
    buildReportTab {
      id = "PROJECT_EXT_156"
      title = "NPM audit"
      startPage = "npm-audit.html"
    }
    feature {
      type = "Invitation"
      id = "PROJECT_EXT_346"
      param("createdByUserId", "7441")
      param("invitationType", "joinProjectInvitation")
      param("roleId", "PROJECT_ADMIN")
      param("secure:token", "credentialsJSON:49ae2465-4363-4742-8ad6-416b1470f807")
      param("name", "Join project administration")
      param(
        "welcomeText",
        "Andrey Skladchikov invites you to join the JetBrains Public Projects / JetBrains UI / Ring UI project"
      )
      param("disabled", "false")
      param("multi", "true")
    }
  }
  buildTypesOrder = arrayListOf(
    GeminiTests,
    QodanaAnalysis,
    UnitTestsAndBuild,
    Publish,
    PublishHotfixRelease,
    Deploy,
    PublishToGitHubPages,
    PublishNext,
    UnpublishSpecificVersion,
    AllChecks
  )
})
