pipeline {
    agent any

    environment {
        DOCKER_USER = "testethical"
        BACKEND_IMAGE = "edustream-backend"
        FRONTEND_IMAGE = "edustream-frontend"
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }
        stage('Build Images'){
            steps{
                script {
                    echo 'Building Backend...'
                    dir('backend') {
                        sh "docker build -t ${DOCKER_USER}/${BACKEND_IMAGE}:${env.BUILD_NUMBER} ."
                    }
                    echo 'Building Frontend...'
                    dir('frontend'){
                        // Fixed spelling: BUID -> BUILD
                        sh "docker build -t ${DOCKER_USER}/${FRONTEND_IMAGE}:${env.BUILD_NUMBER} ."
                    }
                }
            }
        }
        stage('Push to Docker Hub'){
            steps{
                script{
                    withCredentials([string(credentialsId: 'dockerhub-pass', variable:'PASSWORD')]){
                        // Fixed spelling: ehco -> echo
                        sh 'echo "$PASSWORD" | docker login -u ${DOCKER_USER} --password-stdin'
                        sh "docker push ${DOCKER_USER}/${BACKEND_IMAGE}:${env.BUILD_NUMBER}"
                        sh "docker push ${DOCKER_USER}/${FRONTEND_IMAGE}:${env.BUILD_NUMBER}"   
                    }
                }
            }
        }
        stage('Deploy to Kubernetes'){
            steps{
                script {
                    echo 'Applying Database Config...'
                    sh "kubectl apply -f k8s/postgres.yaml"

                    echo 'Updating Backend...'
                    sh "kubectl apply -f k8s/backend.yaml"
                    sh "kubectl set image deployment/edustream-backend backend=${DOCKER_USER}/${BACKEND_IMAGE}:${env.BUILD_NUMBER}"

                    echo 'Updating Frontend...'
                    sh "kubectl apply -f k8s/frontend.yaml"
                    sh "kubectl set image deployment/edustream-frontend frontend=${DOCKER_USER}/${FRONTEND_IMAGE}:${env.BUILD_NUMBER}"
                }
            }
        }
    }
}