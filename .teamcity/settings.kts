import jetbrains.buildServer.configs.kotlin.v2018_2.*
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.Swabra
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.merge
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.sshAgent
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.swabra
import jetbrains.buildServer.configs.kotlin.v2018_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2018_2.failureConditions.BuildFailureOnMetric
import jetbrains.buildServer.configs.kotlin.v2018_2.failureConditions.BuildFailureOnText
import jetbrains.buildServer.configs.kotlin.v2018_2.failureConditions.failOnMetricChange
import jetbrains.buildServer.configs.kotlin.v2018_2.failureConditions.failOnText
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.VcsTrigger
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.finishBuildTrigger
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.retryBuild
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.vcs

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

version = "2018.2"

project {
    description = "https://jetbrains.github.io/ring-ui/"

    buildType(UnpublishSpecificVersion)
    buildType(GeminiTests)
    buildType(UnitTestsAndBuild)
    buildType(Publish)
    buildType(Publish10hotfix)
    buildType(Deploy)
    buildType(PublishNext)
    buildType(AllChecks)
    buildType(PublishToGitHubPages)
    buildType(GeneratorE2eTest)
    buildType(PublishCanary)

    params {
        param("vcs.branch.spec", """
            +:refs/heads/*
            -:refs/heads/gh-pages
        """.trimIndent())
    }

    features {
        feature {
            id = "PROJECT_EXT_121"
            type = "ReportTab"
            param("buildTypeId", "JetBrainsUi_RingUi_Deploy")
            param("startPage", "dist.zip!index.html")
            param("revisionRuleName", "lastSuccessful")
            param("revisionRuleRevision", "latest.lastSuccessful")
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
            param("startPage", "dist.zip!index.html")
            param("title", "Storybook")
            param("type", "BuildReportTab")
        }
        feature {
            id = "PROJECT_EXT_126"
            type = "ReportTab"
            param("buildTypeId", "JetBrainsUi_RingUi_Build")
            param("startPage", "ring-ui/index.html")
            param("revisionRuleName", "buildTag")
            param("revisionRuleRevision", "1.0.tcbuildtag")
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
    }
    buildTypesOrder = arrayListOf(GeminiTests, UnitTestsAndBuild, Publish, Publish10hotfix, Deploy, PublishToGitHubPages, GeneratorE2eTest, PublishNext, UnpublishSpecificVersion, PublishCanary, AllChecks)
}

object AllChecks : BuildType({
    name = "All checks"

    type = BuildTypeSettings.Type.COMPOSITE

    vcs {
        root(DslContext.settingsRoot)

        showDependenciesChanges = true
    }

    triggers {
        vcs {
            quietPeriodMode = VcsTrigger.QuietPeriodMode.USE_DEFAULT
            triggerRules = "-:user=npmjs-buildserver:**"
        }
        retryBuild {
            delaySeconds = 60
        }
    }

    features {
        merge {
            branchFilter = "+:dependencies.io-*"
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
        snapshot(GeneratorE2eTest) {
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
        dist => dist.zip
    """.trimIndent()
    buildNumberPattern = "${UnitTestsAndBuild.depParamRefs.buildNumber}"

    params {
        password("env.AWS_SECRET_ACCESS_KEY", "credentialsJSON:dbeb62cd-b1ba-452b-aa7c-317f19a10804", display = ParameterDisplay.HIDDEN)
        param("env.AWS_ACCESS_KEY_ID", "AKIAJ42U3JYQAGGFJ5KQ")
        param("env.AWS_DEFAULT_REGION", "us-east-2")
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
                
                # To prevent lerna's "cannot run in wd" failure
                npm config set unsafe-perm true
                
                npm run bootstrap
                npm run storybook-build
            """.trimIndent()
            dockerImage = "huston007/node-electron:latest"
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
            onDependencyFailure = FailureAction.FAIL_TO_START
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
    maxRunningBuilds = 3

    params {
        param("vcs.branch.spec", """
            +:refs/heads/*
            +:refs/(pull/*)/merge
            -:refs/heads/(gh-pages)
        """.trimIndent())
        param("github.com.builduser.name", "")
        password("env.SAUCE_ACCESS_KEY", "credentialsJSON:5cf1318c-510e-4f61-ba26-425fa3b3990a", display = ParameterDisplay.HIDDEN)
        param("env.SAUCE_USERNAME", "jetbrains-ui")
        param("npmjs.com.auth.email", "")
        param("github.com.builduser.email", "")
        param("npmjs.com.auth.key", "credentialsJSON:175b3950-943c-4803-99c4-56d5f6ac422a")
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
                
                cd packages/hermione
                yarn install
                # ! We run tests against built Storybook from another build configuration
                npm run test-ci
            """.trimIndent()
            dockerImage = "node:8"
            dockerRunParameters = "-p 4445:4445 -v %teamcity.build.workingDir%/npmlogs:/root/.npm/_logs"
        }
    }

    triggers {
        vcs {
            enabled = false
            branchFilter = "+:refs/heads/*"
        }
        retryBuild {
            delaySeconds = 60
            attempts = 2
        }
    }

    failureConditions {
        javaCrash = false
        errorMessage = true
        failOnMetricChange {
            metric = BuildFailureOnMetric.MetricType.TEST_COUNT
            threshold = 30
            units = BuildFailureOnMetric.MetricUnit.PERCENTS
            comparison = BuildFailureOnMetric.MetricComparison.LESS
            compareTo = build {
                buildRule = lastSuccessful()
            }
        }
        failOnText {
            conditionType = BuildFailureOnText.ConditionType.CONTAINS
            pattern = "Sauce Connect could not establish a connection"
            failureMessage = "Sauce Connect could not establish a connection"
            reverse = false
            stopBuildOnFailure = true
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
                password = "credentialsJSON:9eaa3cf0-4b14-49db-83f2-b141b3721922"
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
                artifactRules = "dist.zip!**=>dist"
            }
        }
    }

    requirements {
        exists("docker.version")
        contains("docker.server.osType", "linux")
    }
})

object GeneratorE2eTest : BuildType({
    name = "Generator E2E test"

    allowExternalStatus = true

    vcs {
        root(DslContext.settingsRoot)
    }

    steps {
        script {
            name = "Test"
            scriptContent = """
                #!/bin/bash
                set -e -x
                
                node -v
                yarn -v
                
                useradd user -m
                
                su user -c "yarn run bootstrap && yarn run test-generator-e2e"
            """.trimIndent()
            dockerImage = "huston007/node-electron"
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
        }
    }

    failureConditions {
        executionTimeoutMin = 20
        errorMessage = true
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
        failOnMetricChange {
            metric = BuildFailureOnMetric.MetricType.TEST_COUNT
            units = BuildFailureOnMetric.MetricUnit.DEFAULT_UNIT
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
        }
    }

    requirements {
        doesNotContain("teamcity.agent.jvm.os.name", "Windows")
    }
})

object Publish : BuildType({
    templates(AbsoluteId("JetBrainsUi_LernaPublish"))
    name = "Publish @latest (master)"

    allowExternalStatus = true

    params {
        param("lerna.publish.options", "--cd-version patch")
        param("vcs.branch.spec", "+:refs/heads/(master)")
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
                
                # Temporary until docker is not updated
                npm config set unsafe-perm true
                
                if [ -n "${'$'}(git status --porcelain)" ]; then
                  echo "Your git status is not clean. Aborting.";
                  exit 1;
                fi
                
                npm run bootstrap
                # Reset possibly changed lock to avoid "git status is not clear" error
                git checkout package.json yarn.lock packages/*/yarn.lock
                npm run release-ci -- %lerna.publish.options%
                
                cat package.json
                
                function publishBuildNumber {
                    local VERSION=${'$'}(node -p 'require("./package.json").version')
                    echo "##teamcity[buildNumber '${'$'}VERSION']"
                }
                
                publishBuildNumber
                
                #chmod 777 ~/.ssh/config
            """.trimIndent()
            dockerImage = "node:10.15"
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
        failOnText {
            id = "BUILD_EXT_180"
            conditionType = BuildFailureOnText.ConditionType.CONTAINS
            pattern = "cannot run in wd"
            failureMessage = "Failed to generate icons.js"
            reverse = false
            stopBuildOnFailure = true
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

object Publish10hotfix : BuildType({
    templates(AbsoluteId("JetBrainsUi_LernaPublish"))
    name = "Publish 1.0 hotfix (release-1.0)"

    allowExternalStatus = true

    params {
        param("lerna.publish.options", "--cd-version patch")
        param("vcs.branch.spec", "+:refs/heads/(release-1.0)")
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
                
                # Temporary until docker is not updated
                npm config set unsafe-perm true
                
                if [ -n "${'$'}(git status --porcelain)" ]; then
                  echo "Your git status is not clean. Aborting.";
                  exit 1;
                fi
                
                npm run bootstrap
                # Reset possibly changed lock to avoid "git status is not clear" error
                git checkout package.json yarn.lock packages/*/yarn.lock
                npm run release-ci -- %lerna.publish.options%
                
                cat package.json
                
                function publishBuildNumber {
                    local VERSION=${'$'}(node -p 'require("./package.json").version')
                    echo "##teamcity[buildNumber '${'$'}VERSION']"
                }
                
                publishBuildNumber
                
                #chmod 777 ~/.ssh/config
            """.trimIndent()
            dockerImage = "node:10.15"
            dockerRunParameters = "-v %teamcity.build.workingDir%/npmlogs:/root/.npm/_logs"
        }
        stepsOrder = arrayListOf("RUNNER_1461")
    }

    triggers {
        retryBuild {
            id = "retryBuildTrigger"
            enabled = false
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
        failOnText {
            id = "BUILD_EXT_180"
            conditionType = BuildFailureOnText.ConditionType.CONTAINS
            pattern = "cannot run in wd"
            failureMessage = "Failed to generate icons.js"
            reverse = false
            stopBuildOnFailure = true
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
    
    disableSettings("vcsTrigger")
})

object PublishCanary : BuildType({
    templates(AbsoluteId("JetBrainsUi_LernaPublish"))
    name = "Publish @canary"

    allowExternalStatus = true

    params {
        param("lerna.publish.options", "--cd-version prerelease --preid beta --npm-tag canary")
        param("vcs.branch.spec", """
            -:refs/heads/(master)
            +:refs/heads/develop-(*)
        """.trimIndent())
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
                
                # Temporary until docker is not updated
                npm config set unsafe-perm true
                
                if [ -n "${'$'}(git status --porcelain)" ]; then
                  echo "Your git status is not clean. Aborting.";
                  exit 1;
                fi
                
                npm run bootstrap
                # Reset possibly changed lock to avoid "git status is not clear" error
                git checkout package.json yarn.lock packages/*/yarn.lock
                npm run release-ci -- %lerna.publish.options%
                
                cat package.json
                
                function publishBuildNumber {
                    local VERSION=${'$'}(node -p 'require("./package.json").version')
                    echo "##teamcity[buildNumber '${'$'}VERSION']"
                }
                
                publishBuildNumber
                
                #chmod 777 ~/.ssh/config
            """.trimIndent()
            dockerImage = "node:9.11"
            dockerRunParameters = "-v %teamcity.build.workingDir%/npmlogs:/root/.npm/_logs"
        }
        stepsOrder = arrayListOf("RUNNER_1461")
    }

    triggers {
        retryBuild {
            id = "retryBuildTrigger"
            enabled = false
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
        failOnText {
            id = "BUILD_EXT_180"
            conditionType = BuildFailureOnText.ConditionType.CONTAINS
            pattern = "cannot run in wd"
            failureMessage = "Failed to generate icons.js"
            reverse = false
            stopBuildOnFailure = true
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
            onDependencyCancel = FailureAction.ADD_PROBLEM
        }
    }
    
    disableSettings("vcsTrigger")
})

object PublishNext : BuildType({
    templates(AbsoluteId("JetBrainsUi_LernaPublish"))
    name = "Publish @next"
    paused = true

    allowExternalStatus = true

    params {
        param("lerna.publish.options", "--cd-version prerelease --preid beta --npm-tag next")
        param("vcs.branch.spec", "+:refs/heads/(develop-2.0)")
    }

    vcs {
        root(DslContext.settingsRoot)

        buildDefaultBranch = false
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
                
                # Temporary until docker is not updated
                npm config set unsafe-perm true
                
                if [ -n "${'$'}(git status --porcelain)" ]; then
                  echo "Your git status is not clean. Aborting.";
                  exit 1;
                fi
                
                npm run bootstrap
                # Reset possibly changed lock to avoid "git status is not clear" error
                git checkout package.json yarn.lock packages/*/yarn.lock
                npm run release-ci -- %lerna.publish.options%
                
                cat package.json
                
                function publishBuildNumber {
                    local VERSION=${'$'}(node -p 'require("./package.json").version')
                    echo "##teamcity[buildNumber '${'$'}VERSION']"
                }
                
                publishBuildNumber
                
                #chmod 777 ~/.ssh/config
            """.trimIndent()
            dockerImage = "node:10.15"
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
            onDependencyFailure = FailureAction.FAIL_TO_START
        }
    }
})

object PublishToGitHubPages : BuildType({
    name = "Deploy to GitHub Pages"

    allowExternalStatus = true
    enablePersonalBuilds = false
    artifactRules = "%teamcity.build.workingDir%/npmlogs/*.log=>npmlogs"
    type = BuildTypeSettings.Type.DEPLOYMENT
    maxRunningBuilds = 1

    params {
        param("vcs.branch.spec", """
            +:refs/heads/(master)
            +:refs/heads/(release-1.0)
            +:refs/heads/(develop-storybook)
        """.trimIndent())
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
                artifactRules = "dist.zip!**=>dist"
            }
        }
    }

    requirements {
        contains("system.agent.name", "ubuntu-16.04")
    }
})

object UnitTestsAndBuild : BuildType({
    name = "Unit Tests and Build"

    allowExternalStatus = true
    artifactRules = """
        dist => dist.zip
        %teamcity.build.workingDir%/npmlogs/*.log=>npmlogsssssssssssssssssssss
        coverage => coverage.zip
        lerna-debug.log
    """.trimIndent()

    params {
        param("vcs.branch.spec", """
            +:refs/heads/*
            +:refs/(pull/*)/merge
            -:refs/heads/gh-pages
        """.trimIndent())
        param("env.GIT_AUTHOR_NAME", "")
        param("env.GIT_COMMITTER_EMAIL", "")
        param("github.com.builduser.name", "")
        param("npmjs.com.auth.email", "")
        param("github.com.builduser.email", "")
        param("env.NPM_TOKEN", "")
        param("env.GIT_COMMITTER_NAME", "")
        param("env.GIT_AUTHOR_EMAIL", "")
        param("npmjs.com.auth.key", "credentialsJSON:075c2e9e-0e12-4b18-9ec2-cb2f366d424e")
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
                yarn -v
                
                # Temporary until docker is not updated
                npm config set unsafe-perm true
                
                yarn bootstrap
                yarn run test-ci
                yarn run storybook-build
            """.trimIndent()
            dockerImage = "huston007/node-electron:latest"
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
            delaySeconds = 60
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
    }

    requirements {
        contains("system.agent.name", "ubuntu")
    }
})

object UnpublishSpecificVersion : BuildType({
    name = "Unpublish specific version"
    description = "If broken version is published, specify it in parameters and run Unpublish build configuration"

    params {
        text("env.PACKAGE_NAME", "@jetbrains/ring-ui", label = "Package name", display = ParameterDisplay.PROMPT, allowEmpty = false)
        text("env.PACKAGE_VERSION", "0.3.3", label = "Package version", display = ParameterDisplay.PROMPT, allowEmpty = false)
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
            dockerImage = "node:8"
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
