#!/usr/bin/env groovy
pipeline {
    agent any
    stages {
        stage('Build') {
             steps {
                sh 'ls'
                sh './deploy.sh'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing...'
            }
        }
    }
    post {
        success {
            slackSend (color: '#00FF00', message: "*ReGov API - Staging Deployed*\n${env.JOB_NAME} [${env.BUILD_NUMBER}]'\n${env.BUILD_URL}")
        }
        failure {
            slackSend (color: '#FF0000', message: "*ReGov API - Staging Failed*\n${env.JOB_NAME} [${env.BUILD_NUMBER}]'\n${env.BUILD_URL}")
        }
    }
}