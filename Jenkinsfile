
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate Files') {
            steps {
                sh '''
                    test -s index.html
                    test -s style.css
                    test -s script.js
                    test -s Dockerfile
                    echo "Project files verified"
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t personal-expense-tracker:latest .'
            }
        }

        stage('Deploy Application') {
            steps {
                sh '''
                    docker rm -f personal-expense-tracker || true
                    docker run -d \
                      --name personal-expense-tracker \
                      --restart unless-stopped \
                      -p 80:80 \
                      personal-expense-tracker:latest
                '''
            }
        }

        stage('Test Website') {
            steps {
                sh '''
                    for i in $(seq 1 15); do
                      if curl -fsS http://127.0.0.1/ -o /tmp/expense-tracker.html; then
                        grep -q "Personal Expense Tracker" /tmp/expense-tracker.html
                        echo "Website test passed"
                        exit 0
                      fi
                      sleep 2
                    done
                    echo "Website test failed"
                    exit 1
                '''
            }
        }
    }
}
