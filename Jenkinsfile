pipeline {
    agent any

    environment {
        CI              = 'true'
        TEST_EMAIL      = credentials('TEST_EMAIL')
        TEST_PASSWORD   = credentials('TEST_PASSWORD')
        LOGOUT_EMAIL    = credentials('LOGOUT_EMAIL')
        LOGOUT_PASSWORD = credentials('LOGOUT_PASSWORD')
    }

    stages {
        stage('Install dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Install browser') {
            steps {
                bat 'npx playwright install chromium'
            }
        }

        stage('Run tests') {
            steps {
                bat 'npx playwright test'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'reports/**, test-results/**', allowEmptyArchive: true
        }
    }
}