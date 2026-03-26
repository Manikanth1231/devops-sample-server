pipeline {
    agent any

    environment {
        IMAGE_NAME = 'devops-sample-server'
        ECR_REGISTRY = credentials('ecr-registry-url')
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Test') {
            steps {
                dir('app') {
                    sh 'npm ci && npm test'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$BUILD_NUMBER ./app'
            }
        }

        stage('Push to ECR') {
            steps {
                sh '''
                    aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_REGISTRY
                    docker tag $IMAGE_NAME:$BUILD_NUMBER $ECR_REGISTRY/$IMAGE_NAME:$BUILD_NUMBER
                    docker push $ECR_REGISTRY/$IMAGE_NAME:$BUILD_NUMBER
                '''
            }
        }

        stage('Deploy to ECS') {
            when { branch 'main' }
            steps {
                sh '''
                    aws ecs update-service \
                        --cluster devops-cluster \
                        --service devops-sample-service \
                        --force-new-deployment
                '''
            }
        }
    }

    post {
        success { echo 'Pipeline succeeded!' }
        failure { echo 'Pipeline failed!' }
    }
}

