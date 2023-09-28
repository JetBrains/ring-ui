import jetbrains.buildServer.configs.kotlin.v2018_2.*
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.*
import jetbrains.buildServer.configs.kotlin.v2018_2.buildSteps.*
import jetbrains.buildServer.configs.kotlin.v2018_2.failureConditions.BuildFailureOnMetric
import jetbrains.buildServer.configs.kotlin.v2018_2.failureConditions.BuildFailureOnText
import jetbrains.buildServer.configs.kotlin.v2018_2.failureConditions.failOnMetricChange
import jetbrains.buildServer.configs.kotlin.v2018_2.failureConditions.failOnText
import jetbrains.buildServer.configs.kotlin.v2018_2.projectFeatures.*
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.*

/*
The settings script is an entry point for defining a TeamCity
project hierarchy. The script should contain a single call to the
project() function with a Project instance or an init function as
an argument.

VcsRoots, BuildTypes, Templates, and subprojects can be
registered inside the project using the vcsRoot(), buildType(),
template(), and subProject() methods respectively.

To debug settings scripts in command-line, run the

    mvnDebug org.jetbrains.teamcity:teamcity-configs-maven-plugin:generate

command and attach your debugger to the port 8000.

To debug in IntelliJ Idea, open the 'Maven Projects' tool window (View
-> Tool Windows -> Maven Projects), find the generate task node
(Plugins -> teamcity-configs -> teamcity-configs:generate), the
'Debug' option is available in the context menu for the task.
*/

version = "2020.1"

project {
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
        param("vcs.branch.spec", """
            +:refs/heads/*
            -:refs/heads/gh-pages
        """.trimIndent())
        text("env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD", "true", allowEmpty = true)
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
            param("series", """
                [
                  {
                    "type": "valueType",
                    "title": "Artifacts Size",
                    "key": "VisibleArtifactsSize"
                  }
                ]
            """.trimIndent())
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
            param("welcomeText", "Andrey Skladchikov invites you to join the JetBrains Public Projects :: JetBrains UI :: Ring UI project")
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
            param("welcomeText", "Andrey Skladchikov invites you to join the JetBrains Public Projects / JetBrains UI / Ring UI project")
            param("disabled", "false")
            param("multi", "true")
        }
    }
    buildTypesOrder = arrayListOf(GeminiTests, QodanaAnalysis, UnitTestsAndBuild, Publish, PublishHotfixRelease, Deploy, PublishToGitHubPages, PublishNext, UnpublishSpecificVersion, AllChecks)
}

object AllChecks : BuildType({
    name = "All checks"

    type = Type.COMPOSITE

    maxRunningBuilds = 1

    vcs {
        root(DslContext.settingsRoot)

        showDependenciesChanges = true
    }

    triggers {
        vcs {
            quietPeriodMode = VcsTrigger.QuietPeriodMode.DO_NOT_USE
            triggerRules = "-:user=npmjs-buildserver:**"
        }
        retryBuild {
            delaySeconds = 60
        }
    }

    features {
        merge {
            branchFilter = """
              +:dependabot/*
            """.trimIndent()
            mergePolicy = AutoMerge.MergePolicy.FAST_FORWARD
            destinationBranch = "master"
        }
        commitStatusPublisher {
            publisher = github {
                githubUrl = "https://api.github.com"
                authType = personalToken {
                    token = "credentialsJSON:5ffe2d7e-531e-4f6f-b1fc-a41bfea26eaa"
                }
            }
            param("github_oauth_user", "Hypnosphi")
        }
    }

    dependencies {
        snapshot(GeminiTests) {
            onDependencyCancel = FailureAction.ADD_PROBLEM
        }
        snapshot(QodanaAnalysis) {
            onDependencyCancel = FailureAction.ADD_PROBLEM
        }
        snapshot(A11yAudit) {
            onDependencyCancel = FailureAction.ADD_PROBLEM
        }
        snapshot(ConsoleErrors) {
            onDependencyCancel = FailureAction.ADD_PROBLEM
        }
    }
})

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
            dockerImage = "node:16"
            dockerRunParameters = "-v %teamcity.build.workingDir%/npmlogs:/root/.npm/_logs"
        }
    }

    triggers {
        vcs {
            enabled = false
            triggerRules = "-:user=npmjs-buildserver:**"
            branchFilter = ""
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

object GeminiTests : BuildType({
    name = "Visual Regression Tests (Hermione)"
    description = "Screenshots based snapshot tests"

    allowExternalStatus = true
    artifactRules = """
        packages/hermione/html-report/ => html-report.zip
        packages/hermione/*.log
    """.trimIndent()
    buildNumberPattern = "${UnitTestsAndBuild.depParamRefs.buildNumber}"
    maxRunningBuilds = 1

    params {
        param("vcs.branch.spec", """
            +:refs/heads/*
            +:refs/(pull/*)/merge
            -:refs/heads/(gh-pages)
        """.trimIndent())
        param("github.com.builduser.name", "")
        password("env.BROWSERSTACK_KEY", "credentialsJSON:080a4e07-08b0-4450-8347-ddd8760b4f42", display = ParameterDisplay.HIDDEN)
        param("env.BROWSERSTACK_NAME", "sadf7")
        param("npmjs.com.auth.email", "")
        param("github.com.builduser.email", "")
        param("npmjs.com.auth.key", "credentialsJSON:175b3950-943c-4803-99c4-56d5f6ac422a")
        param("env.NODE_OPTIONS", "--max-old-space-size=8192")
    }

    vcs {
        root(DslContext.settingsRoot)
    }

    steps {
        script {
            name = "Run hermione"
            scriptContent = """
                #!/bin/bash
                set -e -x

                node -v
                npm -v
                chown -R root:root . # See https://github.com/npm/cli/issues/4589

                mkdir node_modules
                npm install

                cd packages/hermione
                # ! We run tests against built Storybook from another build configuration
                npm run test-ci
            """.trimIndent()
            dockerImage = "node:16"
            dockerRunParameters = "-p 4445:4445 -v %teamcity.build.workingDir%/npmlogs:/root/.npm/_logs"
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
        commitStatusPublisher {
            publisher = upsource {
                serverUrl = "https://upsource.jetbrains.com"
                projectId = "ring-ui"
                userName = "TeamCityReporter"
                password = "credentialsJSON:58d15732-d29f-42a6-a0e5-e88ab97c64dd"
            }
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
    }
})

object A11yAudit : BuildType({
    name = "Accessibility Audit"

    allowExternalStatus = true
    artifactRules = "storybook-dist => storybook-dist.zip"
    buildNumberPattern = "${UnitTestsAndBuild.depParamRefs.buildNumber}"

    params {
        param("env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD", "")
        param("env.NODE_OPTIONS", "--max-old-space-size=8192")
        param("vcs.branch.spec", """
            +:refs/heads/*
            +:refs/(pull/*)/merge
            -:refs/heads/(gh-pages)
        """.trimIndent())
        param("github.com.builduser.name", "")
        param("npmjs.com.auth.email", "")
        param("github.com.builduser.email", "")
        param("npmjs.com.auth.key", "credentialsJSON:7f08c5e7-ed45-4767-b103-5802c98c1d6c")
    }

    vcs {
        root(DslContext.settingsRoot)
    }

    steps {
        script {
            name = "Run audit"
            scriptContent = """
                #!/bin/bash
                set -e -x

                node -v
                npm -v

                chown -R root:root . # See https://github.com/npm/cli/issues/4589
                mkdir node_modules

                npm install
                npm run a11y-audit-ci
            """.trimIndent()
            dockerImage = "satantime/puppeteer-node:18.12"
        }
    }

    triggers {
        vcs {}
    }

    dependencies {
        dependency(UnitTestsAndBuild) {
            snapshot {}

            artifacts {
                cleanDestination = true
                artifactRules = "storybook-dist.zip!**=>storybook-dist"
            }
        }
    }

    requirements {
        exists("docker.version")
        contains("docker.server.osType", "linux")
    }
})


object ConsoleErrors : BuildType({
    name = "Console errors in stories"

    allowExternalStatus = true

    params {
        param("vcs.branch.spec", """
            +:refs/heads/*
            +:refs/(pull/*)/merge
            -:refs/heads/(gh-pages)
        """.trimIndent())
        param("github.com.builduser.name", "")
        param("npmjs.com.auth.email", "")
        param("github.com.builduser.email", "")
        param("npmjs.com.auth.key", "credentialsJSON:7f08c5e7-ed45-4767-b103-5802c98c1d6c")
        param("env.NODE_OPTIONS", "--max-old-space-size=8192")
    }

    vcs {
        root(DslContext.settingsRoot)
    }

    steps {
        script {
            name = "Run test"
            scriptContent = """
                #!/bin/bash
                set -e -x

                node -v
                npm -v

                chown -R root:root . # See https://github.com/npm/cli/issues/4589
                mkdir node_modules
                npm install
                npm run console-errors-ci
            """.trimIndent()
            dockerImage = "node:16"
        }
    }

    triggers {
        vcs {}
    }

    failureConditions {
        nonZeroExitCode = false
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

    requirements {
        exists("docker.version")
        contains("docker.server.osType", "linux")
    }
})

object SecurityAudit : BuildType({
    name = "Dependencies security audit"

    allowExternalStatus = true

    artifactRules = "npm-audit.html"

    params {
        param("vcs.branch.spec", """
            +:refs/heads/*
            +:refs/(pull/*)/merge
            -:refs/heads/(gh-pages)
        """.trimIndent())
        param("github.com.builduser.name", "")
        param("npmjs.com.auth.email", "")
        param("github.com.builduser.email", "")
        param("npmjs.com.auth.key", "credentialsJSON:7f08c5e7-ed45-4767-b103-5802c98c1d6c")
        param("env.NODE_OPTIONS", "--max-old-space-size=8192")
        param("env.SEVERITY_LEVEL", "critical")
    }

    vcs {
        root(DslContext.settingsRoot)
    }

    steps {
        script {
            name = "Run audit"
            scriptContent = """
                #!/bin/bash
                set -e -x

                node -v
                npm -v

                chown -R root:root . # See https://github.com/npm/cli/issues/4589
                mkdir node_modules
                npm install
                node security-audit-ci.js
            """.trimIndent()
            dockerImage = "node:16"
        }
    }

    triggers {
        vcs {}
        schedule {
            branchFilter = "+:<default>"
            triggerBuild = always()
            withPendingChangesOnly = false
        }
    }

    requirements {
        exists("docker.version")
        contains("docker.server.osType", "linux")
    }
})

object QodanaAnalysis : BuildType({
  name = "Qodana Analyze"

  params {
    password("env.QODANA_TOKEN", "credentialsJSON:1b6fe259-bfcd-45f5-be23-e2625685a0f6", display = ParameterDisplay.HIDDEN)
  }

  vcs {
    root(DslContext.settingsRoot)
  }

  steps {
    qodana {
      name = "Run Qodana for JS"
      linter = customLinter {
        image = "jetbrains/qodana-js:2023.2"
      }
      additionalDockerArguments = "-e QODANA_TOKEN=%env.QODANA_TOKEN%"
      collectAnonymousStatistics = true
    }
  }
  triggers {
    vcs {
    }
  }
})

object Publish : BuildType({
    templates(AbsoluteId("JetBrainsUi_LernaPublish"))
    name = "Publish @latest (master)"

    artifactRules = """
        %teamcity.build.workingDir%/npmlogs/*.log=>npmlogs
        dist=>dist.zip
    """.trimIndent()

    allowExternalStatus = true

    params {
        param("env.NPM_VERSION_PARAMS", "patch")
        param("vcs.branch.spec", "+:refs/heads/(master)")
        param("env.NODE_OPTIONS", "--max-old-space-size=8192")
    }

    vcs {
        root(DslContext.settingsRoot)
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

                chmod 644 ~/.ssh/config

                # GitHub and NPM authorization
                git config user.email "%github.com.builduser.email%"
                git config user.name "%github.com.builduser.name%"

                echo "//registry.npmjs.org/:_authToken=%npmjs.com.auth.key%" > ~/.npmrc

                node -v
                npm -v
                npm whoami

                if [ -n "${'$'}(git status --porcelain)" ]; then
                  git status
                  echo "Your git status is not clean. Aborting.";
                  exit 1;
                fi

                chown -R root:root . # See https://github.com/npm/cli/issues/4589
                mkdir node_modules
                npm install
                npm run build

                if [ ! -d "./dist" ]
                then
                    echo "Directory ./dist does NOT exists. Build failed." >>/dev/stderr
                    exit 333
                fi

                # Reset possibly changed lock to avoid "git status is not clear" error
                git checkout package.json package-lock.json
                npm run release-ci

                cat package.json

                function publishBuildNumber {
                    local VERSION=${'$'}(node -p 'require("./package.json").version')
                    echo "##teamcity[buildNumber '${'$'}VERSION']"
                }

                publishBuildNumber

                #chmod 777 ~/.ssh/config
            """.trimIndent()
            dockerImage = "node:16"
            dockerRunParameters = "-v %teamcity.build.workingDir%/npmlogs:/root/.npm/_logs"
        }
        stepsOrder = arrayListOf("RUNNER_1461")
    }

    triggers {
        retryBuild {
            id = "retryBuildTrigger"
            delaySeconds = 60
            enabled = false
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
    }

    dependencies {
        snapshot(GeminiTests) {
            onDependencyFailure = FailureAction.CANCEL
            onDependencyCancel = FailureAction.CANCEL
        }
    }
})

object PublishHotfixRelease : BuildType({
    templates(AbsoluteId("JetBrainsUi_LernaPublish"))
    name = "Publish @hotfix (release-*)"
    paused = true
    allowExternalStatus = true

    params {
        param("env.NPM_VERSION_PARAMS", "patch --preid hotfix")
        param("env.NPM_PUBLISH_PARAMS", "--tag hotfix")
        param("vcs.branch.spec", "+:refs/heads/(release-*)")
        param("env.NODE_OPTIONS", "--max-old-space-size=8192")
    }

    vcs {
        root(DslContext.settingsRoot)
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

                chmod 644 ~/.ssh/config

                # GitHub and NPM authorization
                git config user.email "%github.com.builduser.email%"
                git config user.name "%github.com.builduser.name%"

                echo "//registry.npmjs.org/:_authToken=%npmjs.com.auth.key%" > ~/.npmrc

                node -v
                npm -v
                npm whoami

                if [ -n "${'$'}(git status --porcelain)" ]; then
                  echo "Your git status is not clean. Aborting.";
                  exit 1;
                fi

                chown -R root:root . # See https://github.com/npm/cli/issues/4589
                mkdir node_modules
                npm install
                # Reset possibly changed lock to avoid "git status is not clear" error
                git checkout package.json package-lock.json packages/*/package-lock.json
                npm whoami
                npm run release-ci

                cat package.json

                function publishBuildNumber {
                    local VERSION=${'$'}(node -p 'require("./package.json").version')
                    echo "##teamcity[buildNumber '${'$'}VERSION']"
                }

                publishBuildNumber

                #chmod 777 ~/.ssh/config
            """.trimIndent()
            dockerImage = "node:16"
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
    }

    dependencies {
        snapshot(GeminiTests) {
            onDependencyFailure = FailureAction.CANCEL
            onDependencyCancel = FailureAction.CANCEL
        }
    }
})

object PublishNext : BuildType({
    templates(AbsoluteId("JetBrainsUi_LernaPublish"))
    name = "Publish @next"
    paused = true

    artifactRules = """
        %teamcity.build.workingDir%/npmlogs/*.log=>npmlogs
        components => components.zip
        dist => dist.zip
    """.trimIndent()

    allowExternalStatus = true

    params {
        param("env.NPM_VERSION_PARAMS", "patch --preid beta")
        param("env.NPM_PUBLISH_PARAMS", "--tag next")

        param("vcs.branch.spec", """
            +:refs/heads/*
            -:refs/heads/gh-pages
            -:refs/heads/master
        """.trimIndent())
        param("env.NODE_OPTIONS", "--max-old-space-size=8192")
    }

    vcs {
        root(DslContext.settingsRoot)

        branchFilter = """
            +:*
            -:<default>
            -:refs/heads/master
        """.trimIndent()
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

                chmod 644 ~/.ssh/config

                # GitHub and NPM authorization
                git config user.email "%github.com.builduser.email%"
                git config user.name "%github.com.builduser.name%"

                echo "//registry.npmjs.org/:_authToken=%npmjs.com.auth.key%" > ~/.npmrc

                node -v
                npm -v

                if [ -n "${'$'}(git status --porcelain)" ]; then
                  echo "Your git status is not clean. Aborting.";
                  exit 1;
                fi

                chown -R root:root . # See https://github.com/npm/cli/issues/4589
                mkdir node_modules
                npm install
                npm run build
                # Reset possibly changed lock to avoid "git status is not clear" error
                git checkout package.json package-lock.json packages/*/package-lock.json
                npm run release-ci

                cat package.json

                function publishBuildNumber {
                    local VERSION=${'$'}(node -p 'require("./package.json").version')
                    echo "##teamcity[buildNumber '${'$'}VERSION']"
                }

                publishBuildNumber

                #chmod 777 ~/.ssh/config
            """.trimIndent()
            dockerImage = "node:16"
            dockerRunParameters = "-v %teamcity.build.workingDir%/npmlogs:/root/.npm/_logs"
        }
        stepsOrder = arrayListOf("RUNNER_1461")
    }

    triggers {
        vcs {
            enabled = false
        }
        retryBuild {
            enabled = false
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
    }

    dependencies {
        snapshot(GeminiTests) {
            onDependencyFailure = FailureAction.FAIL_TO_START
        }
    }
})

object PublishToGitHubPages : BuildType({
    name = "Deploy to GitHub Pages"

    allowExternalStatus = true
    enablePersonalBuilds = false
    artifactRules = "%teamcity.build.workingDir%/npmlogs/*.log=>npmlogs"
    type = Type.DEPLOYMENT
    maxRunningBuilds = 1

    params {
        param("vcs.branch.spec", """
            +:refs/heads/(master)
            +:refs/heads/(release-4.2)
        """.trimIndent())
        param("env.NODE_OPTIONS", "--max-old-space-size=8192")
    }

    vcs {
        root(DslContext.settingsRoot)
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

                npx gh-pages --dist storybook-dist --dest %teamcity.build.branch% --message "Deploy %teamcity.build.branch%"
            """.trimIndent()
            dockerImage = "node:16"
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
            triggerRules = "-:user=npmjs-buildserver:**"
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

object UnitTestsAndBuild : BuildType({
    name = "Unit Tests and Build"

    allowExternalStatus = true
    artifactRules = """
        storybook-dist => storybook-dist.zip
        dist => dist.zip
        %teamcity.build.workingDir%/npmlogs/*.log=>npmlogsssssssssssssssssssss
        coverage => coverage.zip
        npm-ls.log
    """.trimIndent()

    params {
        param("vcs.branch.spec", """
            +:refs/heads/*
            +:refs/(pull/*)/merge
            -:refs/heads/gh-pages
        """.trimIndent())
        param("env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD", "")
        param("env.GIT_AUTHOR_NAME", "")
        param("env.GIT_COMMITTER_EMAIL", "")
        param("github.com.builduser.name", "")
        param("npmjs.com.auth.email", "")
        param("github.com.builduser.email", "")
        param("env.NPM_TOKEN", "")
        param("env.GIT_COMMITTER_NAME", "")
        param("env.GIT_AUTHOR_EMAIL", "")
        param("npmjs.com.auth.key", "credentialsJSON:075c2e9e-0e12-4b18-9ec2-cb2f366d424e")
        param("env.NODE_OPTIONS", "--max-old-space-size=8192")
    }

    vcs {
        root(DslContext.settingsRoot)

        cleanCheckout = true
    }

    steps {
        script {
            name = "Test And Build"
            scriptContent = """
                #!/bin/bash
                set -e -x

                node -v
                npm -v
                chown -R root:root . # See https://github.com/npm/cli/issues/4589

                mkdir node_modules
                npm install

                npm run typecheck-ci
                npm run test-ci
                npm run build
                npm run build-stories
            """.trimIndent()
            dockerImage = "satantime/puppeteer-node:18.12"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
            dockerRunParameters = "-v %teamcity.build.workingDir%/npmlogs:/root/.npm/_logs"
        }
    }

    triggers {
        vcs {
            enabled = false
            triggerRules = "-:user=npmjs-buildserver:**"
            branchFilter = "+:refs/heads/*"
        }
        retryBuild {
          enabled = false
          delaySeconds = 60
        }
    }

    failureConditions {
        failOnText {
            conditionType = BuildFailureOnText.ConditionType.CONTAINS
            pattern = "ERROR:"
            failureMessage = "console.error appeared in log"
            reverse = false
            enabled = false
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
        failOnMetricChange {
            metric = BuildFailureOnMetric.MetricType.COVERAGE_LINE_PERCENTAGE
            threshold = 4
            units = BuildFailureOnMetric.MetricUnit.DEFAULT_UNIT
            comparison = BuildFailureOnMetric.MetricComparison.LESS
            compareTo = build {
                buildRule = lastSuccessful()
            }
        }
        failOnMetricChange {
            metric = BuildFailureOnMetric.MetricType.TEST_COUNT
            threshold = 10
            units = BuildFailureOnMetric.MetricUnit.PERCENTS
            comparison = BuildFailureOnMetric.MetricComparison.LESS
            compareTo = build {
                buildRule = lastSuccessful()
            }
        }
    }

    features {
        swabra {
            filesCleanup = Swabra.FilesCleanup.AFTER_BUILD
            forceCleanCheckout = true
            verbose = true
            paths = ".npmrc"
        }
        commitStatusPublisher {
            publisher = github {
                githubUrl = "https://api.github.com"
                authType = personalToken {
                    token = "credentialsJSON:5ffe2d7e-531e-4f6f-b1fc-a41bfea26eaa"
                }
            }
            param("github_oauth_user", "Hypnosphi")
        }
        commitStatusPublisher {
            enabled = false
            publisher = upsource {
                serverUrl = "https://upsource.jetbrains.com"
                projectId = "ring-ui"
                userName = "TeamCityReporter"
                password = "credentialsJSON:9eaa3cf0-4b14-49db-83f2-b141b3721922"
            }
        }
        investigationsAutoAssigner {
          excludeUsers = "npmjs-buildserver"
          assignOnSecondFailure = true
        }
    }
})

object UnpublishSpecificVersion : BuildType({
    name = "Unpublish specific version"
    description = "If broken version is published, specify it in parameters and run Unpublish build configuration"

    params {
        text("env.PACKAGE_NAME", "@jetbrains/ring-ui", label = "Package name", display = ParameterDisplay.PROMPT, allowEmpty = false)
        text("env.PACKAGE_VERSION", "0.3.3", label = "Package version", display = ParameterDisplay.PROMPT, allowEmpty = false)
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
            dockerImage = "node:16"
        }
    }

    features {
        swabra {
            filesCleanup = Swabra.FilesCleanup.AFTER_BUILD
            paths = "~/.npmrc"
        }
    }

    requirements {
        contains("system.agent.name", "ubuntu")
    }
})
