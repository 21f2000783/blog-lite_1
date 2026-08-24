from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin,RoleMixin  # UserMixin - classes are what gives the user_role the feature of users, RoleMixin - features of role to role table
db = SQLAlchemy()

# many-to-many relationship for followers
# association table

followers = db.Table('followers',
                    db.Column('follower_id', db.Integer, db.ForeignKey('user.id')), 
                    db.Column('followed_id', db.Integer, db.ForeignKey('user.id')) 
                     )

                

class User(db.Model, UserMixin):
    id = db.Column(db.Integer,primary_key = True)
    email = db.Column(db.String(100),unique = True,nullable = False)
    password = db.Column(db.String(100),unique = False,nullable = False)
    # flask-security specific
    fs_uniquifier = db.Column(db.String,unique = True, nullable = False)
    active = db.Column(db.Boolean,default = True)
    roles =  db.Relationship('Role', backref = 'bearers', secondary = 'user_roles')

    blogs = db.relationship('Blog', backref = 'author', lazy = 'dynamic')  # user.blogs.filter- this type of functionality gives by lazy ='Dynamic
    # User.blogs (blog object)
    # Blog.author (user object)


    # many-to-many relationship between user to user
    followed = db.relationship(
        'User', secondary = followers,
        primaryjoin = (followers.c.follower_id == id),   # c - columns
        secondaryjoin = (followers.c.followed_id == id),
        backref = db.backref('followers', lazy = 'dynamic'), lazy = 'dynamic' 
    )

    @property
    def num_followed(self):
        return self.followed.count()
    
    # user(particular user).num_followed
    
    @property
    def num_following(self):
        return self.followers.count()
    
    @property
    def num_post(self):
        return self.blogs.count()
          



class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer,primary_key = True)
    name = db.Column(db.String,unique = True, nullable = False)
    description = db.Column(db.String(100),nullable = False)


# user role is just a table that is associating User and Role table actual data stored in user and role.
class UserRoles(db.Model):
    id = db.Column(db.Integer,primary_key = True)
    user_id  = db.Column(db.Integer,db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer,db.ForeignKey('role.id'))


class Blog(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String)
    caption = db.Column(db.String)
    image_url = db.Column(db.String)
    timestamp = db.Column(db.DateTime, index = True, default = datetime.now())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
