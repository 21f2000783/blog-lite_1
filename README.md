# 📝 Blog-Lite

> A full-stack social blogging platform built with **Flask, SQLAlchemy, RESTful APIs, Redis, and Celery**, combining blog publishing with social interactions, personalized feeds, caching, and asynchronous background processing.

---

## ✨ Overview

**Blog-Lite** is a full-stack blogging platform designed to provide users with a simple social blogging experience.

Users can create and manage blog posts, discover other users, follow users they are interested in, and view a personalized feed containing posts from people they follow.

The backend is built using a modular Flask architecture and exposes RESTful APIs for communication between the frontend and backend.

The application also uses **Redis caching** to improve API response performance and **Celery** for handling background and scheduled tasks such as email notifications and CSV generation.

---

## 🚀 Key Features

### 👤 User Management

* Secure user authentication using Flask-Security
* Role-based access control
* User search functionality
* Active/inactive user management
* User profile information and statistics

### 📝 Blogging

* Create blog posts
* View individual blog posts
* Delete your own posts
* Track post authors and timestamps
* Display author information with blog data

### 🤝 Social Features

* Follow other users
* View followers and followed users
* Personalized feed based on followed users
* User following statistics
* Number of posts per user

### 🔎 Search

* Search users by email
* Filter active users
* Role-based user filtering

### ⚡ Performance

* Redis-based API caching
* Memoization for individual blog requests
* Cached blog listing responses

### ⚙️ Background Processing

* Celery-based asynchronous task processing
* Background CSV generation
* Scheduled email reminders
* Periodic and weekly scheduled tasks
* Redis used as Celery broker and result backend

### 📊 Data Export

* Generate blog data as CSV
* CSV generation handled asynchronously through Celery
* Task-specific filenames for generated files

---

## 🏗️ Technology Stack

| Technology         | Purpose                          |
| ------------------ | -------------------------------- |
| **Python**         | Core programming language        |
| **Flask**          | Backend web framework            |
| **Flask-RESTful**  | REST API development             |
| **SQLAlchemy**     | Database ORM                     |
| **Flask-Security** | Authentication & role management |
| **Redis**          | Caching & Celery message broker  |
| **Celery**         | Background and scheduled tasks   |
| **Flask-Excel**    | CSV/data export                  |
| **SMTP**           | Email notifications              |

---

## 🧩 Application Architecture

```text
                    ┌─────────────────────┐
                    │     Frontend UI     │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │     Flask API       │
                    │                     │
                    │ Authentication      │
                    │ Blog APIs           │
                    │ User APIs            │
                    │ Feed API             │
                    └───────┬───────┬─────┘
                            │       │
                ┌───────────┘       └────────────┐
                ▼                                ▼
       ┌─────────────────┐              ┌─────────────────┐
       │   SQLAlchemy    │              │      Redis      │
       │   Database ORM  │              │     Caching     │
       └────────┬────────┘              └─────────────────┘
                │
                ▼
       ┌─────────────────┐
       │    Database     │
       │ Users / Blogs   │
       │ Roles / Follows │
       └─────────────────┘


                    Background Processing
                              │
                              ▼
                     ┌─────────────────┐
                     │     Celery      │
                     └────────┬────────┘
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
        ┌─────────────────┐       ┌─────────────────┐
        │ Email Reminders │       │   CSV Export    │
        └─────────────────┘       └─────────────────┘
```

---

## 📡 REST API

The application provides RESTful endpoints for blogs, users, and personalized feeds.

### Blog APIs

| Method   | Endpoint               | Description          |
| -------- | ---------------------- | -------------------- |
| `GET`    | `/api/blogs/<blog_id>` | Get a specific blog  |
| `DELETE` | `/api/blogs/<blog_id>` | Delete your own blog |
| `GET`    | `/api/blogs`           | Get all blogs        |
| `POST`   | `/api/blogs`           | Create a new blog    |

### User APIs

| Method | Endpoint               | Description         |
| ------ | ---------------------- | ------------------- |
| `GET`  | `/api/users`           | Get/search users    |
| `GET`  | `/api/users/<user_id>` | Get a specific user |
| `GET`  | `/api/user`            | Get all users       |

### Feed API

| Method | Endpoint    | Description                   |
| ------ | ----------- | ----------------------------- |
| `GET`  | `/api/feed` | Get posts from followed users |

---

## 🔐 Authentication & Authorization

Protected APIs use token-based authentication through **Flask-Security**.

For example:

```python
@auth_required('token')
def get(self, blog_id):
    ...
```

Users can only delete their own blog posts:

```python
if blog.user_id == current_user.id:
    db.session.delete(blog)
```

This ensures that users cannot delete content belonging to another user.

---

## 👥 User Following System

Blog-Lite implements a **many-to-many self-referencing relationship** between users.

```text
User
 │
 ├── follows ──► User
 │
 └── followed by ◄── User
```

This relationship is implemented using an association table:

```text
followers
├── follower_id
└── followed_id
```

This allows the application to efficiently represent relationships such as:

```text
User A ──► User B
User A ──► User C
User B ──► User C
```

The personalized feed then retrieves blogs created by users followed by the current user.

---

## ⚡ Redis Caching

Redis is used to reduce unnecessary database queries and improve API performance.

For example, the blog list is cached:

```python
@cache.cached(timeout=5, key_prefix="blog_list")
def get(self):
    blogs = Blog.query.all()
    return blogs
```

Individual blog requests also use memoization:

```python
@cache.memoize(timeout=5)
def get(self, blog_id):
    ...
```

This allows frequently requested data to be served from the cache instead of repeatedly querying the database.

---

## ⚙️ Celery Background Tasks

Time-consuming operations are handled asynchronously using **Celery**.

### CSV Generation

Blog data can be exported to CSV through a background task:

```python
@shared_task(bind=True)
def create_csv(self):
    ...
```

The generated file is saved with a task-specific filename:

```text
blog_data_<task_id>.csv
```

### Email Notifications

The application also supports asynchronous email tasks:

```python
@shared_task(ignore_result=True)
def email_remainder(to, subject, content):
    send_email(to, subject, content)
```

### Scheduled Tasks

Celery Beat is used to schedule recurring tasks such as:

* Periodic reminders
* Daily reminders
* Weekly reminders

---

## 🗄️ Database Model

The main database entities are:

```text
┌──────────────┐
│     User     │
├──────────────┤
│ id           │
│ email        │
│ password     │
│ active       │
└──────┬───────┘
       │
       │ 1 ──────── N
       ▼
┌──────────────┐
│     Blog     │
├──────────────┤
│ id           │
│ title        │
│ caption      │
│ image_url    │
│ timestamp    │
│ user_id      │
└──────────────┘

User ──────── User
       │
    Followers
    Relationship

User ──────── Role
       │
   UserRoles
```

---

## 📁 Project Structure

A simplified representation of the backend structure:

```text
blog-lite/
│
├── backend/
│   ├── models.py
│   │
│   ├── celery/
│   │   ├── celery_factory.py
│   │   ├── celery_schedule.py
│   │   ├── tasks.py
│   │   └── mail_service.py
│   │
│   └── ...
│
├── frontend/
│   └── ...
│
├── app.py
├── requirements.txt
├── .gitignore
└── README.md
```

> Update the structure above if your actual folder structure is different.

---

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/21f2000783/blog-lite_1.git
cd blog-lite_1
```

### 2. Create a virtual environment

```bash
python3 -m venv menv
```

Activate it:

**Linux / macOS**

```bash
source menv/bin/activate
```

**Windows**

```bash
menv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Start Redis

Make sure Redis is installed and running:

```bash
redis-server
```

The project currently uses:

```text
redis://localhost:6379/0
```

as the Celery broker and:

```text
redis://localhost:6379/1
```

as the result backend.

### 5. Configure environment variables

Create a `.env` file for sensitive configuration such as:

```text
SECRET_KEY=your_secret_key
DATABASE_URL=your_database_url
```

**Do not commit `.env` to GitHub.**

### 6. Start the Flask application

Run your project's Flask startup command here.

Example:

```bash
python app.py
```

> Replace this command if your project uses a different entry point.

---

## 🔄 Running Celery

Start a Celery worker:

```bash
celery -A backend.celery.celery_factory.celery_app worker --loglevel=INFO
```

If you are using Celery Beat for scheduled tasks, run it separately according to your project configuration.

---

## 📸 Screenshots

Add screenshots of your application here to make the repository more visually appealing.

### 🏠 Home / Feed

![Home Page](screenshots/home.png)

### 📝 Blog Creation

![Create Blog](screenshots/create-blog.png)

### 👤 User / Profile

![User Profile](screenshots/profile.png)

### 🔎 User Search

![User Search](screenshots/user-search.png)

> Create a `screenshots/` folder in the repository and place your application screenshots there.

---

## 🎯 Project Highlights

The project demonstrates practical implementation of:

* RESTful API design
* Authentication and authorization
* Relational database modeling
* Many-to-many relationships
* Social graph implementation
* API caching
* Asynchronous task processing
* Scheduled jobs
* Email automation
* Background data export
* Modular Flask application architecture

---

## 🔮 Future Improvements

Potential improvements include:

* Real-time notifications
* Pagination for blogs and users
* Improved API validation
* Rate limiting
* Advanced blog search
* Image upload and storage
* Better error handling
* Automated testing with Pytest
* Docker-based deployment
* Production deployment with CI/CD

---

## 👨‍💻 Author

**Kaushik Raj**

Built as a full-stack application to explore backend development, REST APIs, database design, caching, and asynchronous task processing.

---

## ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.
