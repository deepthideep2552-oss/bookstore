// Jenkins on Windows -> uses 'bat'. If Jenkins runs on Linux/Mac, replace 'bat' with 'sh'.
pipeline {
    agent any

    triggers {
        // Auto-trigger on new commits (checks GitHub every 2 minutes)
        pollSCM('H/2 * * * *')
    }

    environment {
            environment {
        IMAGE_NAME = 'bookstore'
        CONTAINER  = 'bookstore-app'
        PATH = "C:\\Users\\diisr\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin;${env.PATH}"
    }
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Install & Test') {
            steps {
                bat 'npm install'
                bat 'npm test'
            }
        }
        stage('Docker Build') {
            steps { bat "docker build -t %IMAGE_NAME%:%BUILD_NUMBER% -t %IMAGE_NAME%:latest ." }
        }
        stage('Deploy') {
            steps {
                bat "docker rm -f %CONTAINER% || exit 0"
                bat "docker run -d --name %CONTAINER% -p 3000:3000 %IMAGE_NAME%:latest"
            }
        }
    }
    post {
        success { echo 'BookStore deployed at http://localhost:3000' }
        failure { echo 'Pipeline failed - check console output' }
    }
}
