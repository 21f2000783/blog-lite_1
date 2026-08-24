from celery import shared_task
import flask_excel
import time
from backend.models import Blog
from flask_excel import make_response_from_query_sets
from backend.celery.mail_service import send_email



@shared_task(ignore_result = False)
def add(x,y):
    time.sleep(10)
    return x+y

# you can access the celery specific thing from flask, but you cannot access flask specific things from celery


@shared_task(bind = True,ignore_result = False)
def create_csv(self):
    resource = Blog.query.all()

    task_id = self.request.id
    filename = f'blog_data_{task_id}.csv'
    column_names = [column.name for column in Blog.__table__.columns]
    # print(column_names)
    csv_out = flask_excel.make_response_from_query_sets(resource, column_names = column_names, file_type='csv' )

    with open(f'./backend/celery/user-downloads/{filename}', 'wb') as file:
        file.write(csv_out.data)
    
    return filename

@shared_task(ignore_result = True)
def email_remainder(to, subject,content):
    send_email(to, subject,content)












