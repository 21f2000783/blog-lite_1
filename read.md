

Step1. Start flask app -- python3 app.py

Step2. Start MaiHog    --    ~/go/bin/MailHog

Step3. Start Celery Worker -- celery -A app:celery_app worker -l INFO

Step4. Start Celery Beat   -- celery -A app:celery_app beat -l INFO
