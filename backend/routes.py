from flask import current_app as app, jsonify, request,render_template,send_file
from flask_security import auth_required, verify_password,hash_password,current_user
from backend.models import User, db
from datetime import datetime
from backend.celery.tasks import add, create_csv
from celery.result import AsyncResult



datastore = app.security.datastore
cache = app.cache


# @app.route('/', methods=['GET')
@app.route('/')
def home():
    return render_template('index.html')

@app.get('/celery')
def celery():
    task = add.delay(10,20)
    return {'task_id' : task.id}

@app.get('/get-celery-data/<id>')
def getData(id):
    result = AsyncResult(id)

    if result.ready():
        return {'result' : result.result}
    else:
        return {'message' : 'task not ready'}, 405

@app.get('/create-csv')
def createCSV():
    task = create_csv.delay()
    return {'task_id' : task.id}, 200


@app.get('/get-csv/<id>')
def getCSV(id):
    result = AsyncResult(id)

    if result.ready():
        return send_file(f'./backend/celery/user-downloads/{result.result}'),200
    else:
        return {'message' : 'task not  ready'}, 405

@app.route('/cache')
@cache.cached(timeout=5)
def cache():
    return {'time' : str(datetime.now())}

@app.get('/protected')
@auth_required('token')
def protected():
    return '<h1> only accessible by auth user</h1>'

@app.route('/login', methods = ['POST'])
def login():
    data = request.get_json()
    # email = data['email']
    email  = data.get('email')

    password = data.get('password')

    if not email or not password:
        return jsonify({"message" : "invalid inputs"}), 404
    
    user = datastore.find_user(email = email)

    if not user:
        return jsonify({"message" : "invalid email"}), 400
    
    if verify_password(password, user.password):
        return jsonify({"token" : user.get_auth_token(), 'email' : user.email, 'role' : user.roles[0].name, 'id' : user.id})
    
    return jsonify({'message' : 'password wrong'}), 400

@app.route('/register', methods = ['GET','POST'])
def register():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not email or not password or role not in ['admin','user']:
        return jsonify({"message" : "invalid input"}), 400
    user = datastore.find_user(email = email)
    if user:
        return jsonify({'message' : 'user already exists'}),404
    
    try:
        datastore.create_user(email = email, password = hash_password(password), roles = [role], active = True,)
        db.session.commit()
        return jsonify({"message" : "user created"}), 200
    except:
        db.session.rollback()
        return jsonify({"message" : "error creating user"})
    


@app.get('/follow/<int:id>')
@auth_required('token')
def follow(id):
    followed_user = User.query.get_or_404(id)

    if not followed_user:
        return jsonify({'message' : "user doesn't exist"}), 404

    if followed_user.id == current_user.id:
        return jsonify({'message' : "cant follow yourself"}), 400

    if followed_user in current_user.followed:
        return jsonify({'message' : "already following"}), 400
    
    if followed_user.active == False:
        return jsonify({'message' : "user is banned"}), 400
    
    current_user.followed.append(followed_user)
    db.session.commit()

    return jsonify({'message' : 'following user '}), 200


@app.get('/unfollow/<int:id>')
@auth_required('token')
def unfollow(id):
    followed_user = User.query.get_or_404(id)
    if not followed_user:
        return jsonify({"message" : "user doesn't exists"}),404
    if followed_user.id == current_user.id:
        return jsonify({'message' : "can't Unfollow yourself"}), 400
    if followed_user not in current_user.followed:
        return jsonify({'message' : "not following"}), 400
    if followed_user.active == False:
        return jsonify({'message' : "user is banned"}), 400

    current_user.followed.remove(followed_user)
    db.session.commit()
    return jsonify({'message' : "now un-followed"})
    


    
        

    
    


    
    
