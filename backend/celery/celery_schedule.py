
from celery.schedules import crontab
from flask import current_app as app
from backend.celery.tasks import email_remainder


celery_app = app.extensions['celery']

# email_remainder is a function(task) that we have created in celery/task.py 

# @celery_app.on_after_configure.connect- this automatically run the function "setup_periodic_tasks" when celery beat start ,we don't need to call this function
@celery_app.on_after_configure.connect    
def setup_periodic_tasks(sender , **kwargs):  # sender is used to add some periodic task
    # every 10 seconds
    sender.add_periodic_task(10.0, email_remainder.s('student@example','remainder to login','<h1> hello everyone')) # here s in test.s is schedular work
    # daily message at 6:20 pm, everyday
    sender.add_periodic_task(crontab(hour=18, minute=20), email_remainder.s('student@example','remainder to login','<h1> hello everyone'), name = 'daily reminder') # here s in test.s is schedular work
    # weekly message
    sender.add_periodic_task(crontab(hour=18, minute=20, day_of_week='monday'), email_remainder.s('student@example','remainder to login','<h1> hello everyone'), name = 'weekly reminder') # here s in test.s is schedular work


@celery_app.task
def test(arg):
    print(arg)


# go and tell app.py that celery_schedule exists.(import backend.celery.celery_schedule)

