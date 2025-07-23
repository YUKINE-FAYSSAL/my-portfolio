import os
import uuid
import bcrypt
import jwt
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId, json_util
from werkzeug.utils import secure_filename
from functools import wraps
import smtplib
from email.mime.text import MIMEText
from datetime import datetime, timezone  



# ========== INITIALIZATION ========== #
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]}})

# Database setup
client = MongoClient("mongodb://localhost:27017/")
db = client.vibecanvas

# Collections
collections = {
    'skills': db.skills,
    'projects': db.projects,
    'education': db.education,
    'experience': db.experience,
    'certificates': db.certificates,
    'blog': db.blog,
    'users': db.users,
    'settings': db.settings,
    'messages': db.messages
}

# ========== CONFIGURATION ========== #
SECRET_KEY = "your_ultra_secure_secret_key_here"
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'svg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize default admin
if collections['users'].count_documents({'role': 'admin'}) == 0:
    hashed_pw = bcrypt.hashpw('Admin@1234'.encode('utf-8'), bcrypt.gensalt())
    collections['users'].insert_one({
        'username': 'admin',
        'email': 'admin@vibecanvas.com',
        'password': hashed_pw.decode('utf-8'),
        'role': 'admin',
        'created_at': datetime.utcnow(),
        'verified': True
    })

# Initialize settings
if collections['settings'].count_documents({}) == 0:
    collections['settings'].insert_one({
        'site_title': 'VibeCanvas',
        'theme': 'light',
        'maintenance_mode': False,
        'analytics_enabled': False
    })

# ========== AUTHENTICATION ========== #
def generate_token(user_id):
    return jwt.encode({
        'user_id': str(user_id),
        'exp': datetime.datetime.utcnow() + datetime(days=7)
    }, SECRET_KEY, algorithm='HS256')

def token_required(roles=None):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None
            if 'Authorization' in request.headers:
                token = request.headers['Authorization'].split(' ')[1]
            
            if not token:
                return jsonify({'message': 'Token is missing!'}), 401
                
            try:
                data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
                current_user = collections['users'].find_one({'_id': ObjectId(data['user_id'])})
                
                if not current_user:
                    return jsonify({'message': 'User not found!'}), 404
                
                if roles and current_user['role'] not in roles:
                    return jsonify({'message': 'Insufficient permissions!'}), 403
                    
            except jwt.ExpiredSignatureError:
                return jsonify({'message': 'Token has expired!'}), 401
            except Exception as e:
                return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401
                
            return f(current_user, *args, **kwargs)
        return decorated
    return decorator

# In your app.py, update the login route:
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = collections['users'].find_one({'email': data.get('email'), 'role': 'admin'})
    
    if not user or not bcrypt.checkpw(data.get('password').encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({'message': 'Invalid credentials or not an admin'}), 401
        
    token = generate_token(user['_id'])
    return jsonify({
        'token': token,
        'user': {
            'id': str(user['_id']),
            'username': user['username'],
            'email': user['email'],
            'role': user['role']
        }
    })

# ========== CRUD ROUTES ========== #


# ========== BLOG ROUTES ========== #

# Get all blog posts (public)
@app.route('/api/blog/posts', methods=['GET'])
def get_blog_posts():
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        skip = (page - 1) * per_page
        
        # Get optional filters
        category = request.args.get('category')
        search = request.args.get('search')
        featured = request.args.get('featured')
        
        query = {}
        if category and category != 'all':
            query['categories'] = category
        if search:
            query['$or'] = [
                {'title': {'$regex': search, '$options': 'i'}},
                {'content': {'$regex': search, '$options': 'i'}}
            ]
        if featured:
            query['featured'] = featured.lower() == 'true'
        
        total = collections['blog'].count_documents(query)
        posts = list(collections['blog'].find(query)
                    .sort('createdAt', -1)
                    .skip(skip)
                    .limit(per_page))
        
        return jsonify({
            'data': json_util.dumps(posts),
            'total': total,
            'page': page,
            'per_page': per_page,
            'total_pages': (total + per_page - 1) // per_page
        })
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Get blog categories
@app.route('/api/blog/categories', methods=['GET'])
def get_blog_categories():
    try:
        categories = collections['blog'].distinct('categories')
        return jsonify(categories or ['technology', 'design', 'business'])
    except Exception as e:
        return jsonify(['technology', 'design', 'business']), 200

# Get single blog post by ID (public)
@app.route('/api/blog/posts/<id>', methods=['GET'])
def get_blog_post(id):
    try:
        post = collections['blog'].find_one({'_id': ObjectId(id)})
        if not post:
            return jsonify({'message': 'Post not found'}), 404
        
        # Increment view count
        collections['blog'].update_one(
            {'_id': ObjectId(id)},
            {'$inc': {'views': 1}}
        )
        
        return json_util.dumps(post)
    except:
        return jsonify({'message': 'Invalid ID format'}), 400

# Get single blog post by slug (public)
@app.route('/api/blog/posts/slug/<slug>', methods=['GET'])
def get_blog_post_by_slug(slug):
    try:
        post = collections['blog'].find_one({'slug': slug})
        if not post:
            return jsonify({'message': 'Post not found'}), 404
            
        # Increment view count
        collections['blog'].update_one(
            {'slug': slug},
            {'$inc': {'views': 1}}
        )
        
        return json_util.dumps(post)
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Like a blog post
@app.route('/api/blog/posts/<id>/like', methods=['POST'])
def like_blog_post(id):
    try:
        result = collections['blog'].update_one(
            {'_id': ObjectId(id)},
            {'$inc': {'likes': 1}}
        )
        if result.modified_count == 0:
            return jsonify({'message': 'Post not found'}), 404
        return jsonify({'message': 'Post liked successfully'})
    except:
        return jsonify({'message': 'Invalid ID format'}), 400

# Admin - Get all posts (with auth)
@app.route('/api/admin/blog/posts', methods=['GET'])
@token_required(roles=['admin'])
def admin_get_blog_posts(current_user):
    try:
        posts = list(collections['blog'].find({}).sort('createdAt', -1))
        return json_util.dumps(posts)
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Admin - Create new post
@app.route('/api/admin/blog/posts', methods=['POST'])
@token_required(roles=['admin'])
def admin_create_blog_post(current_user):
    data = request.json
    required_fields = ['title', 'content']
    
    if not all(field in data for field in required_fields):
        return jsonify({'message': 'Missing required fields'}), 400
    
    try:
        # Generate slug from title if not provided
        if 'slug' not in data:
            slug = data['title'].lower().replace(' ', '-')
            # Ensure slug is unique
            counter = 1
            while collections['blog'].find_one({'slug': slug}):
                slug = f"{slug}-{counter}"
                counter += 1
            data['slug'] = slug
        
        # Set default values if not provided
        if 'excerpt' not in data:
            excerpt = data['content'][:150] + '...' if len(data['content']) > 150 else data['content']
            data['excerpt'] = excerpt.replace('\n', ' ').strip()
        
        if 'readTime' not in data:
            word_count = len(data['content'].split())
            read_time = max(1, round(word_count / 200))  # 200 wpm reading speed
            data['readTime'] = f'{read_time} min read'
        
        if 'date' not in data:
            data['date'] = datetime.utcnow()
        
        data['author'] = {
            'id': str(current_user['_id']),
            'name': current_user['username']
        }
        data['createdAt'] = datetime.utcnow()
        data['updatedAt'] = datetime.utcnow()
        data['views'] = 0
        data['likes'] = 0
        
        result = collections['blog'].insert_one(data)
        return jsonify({
            'id': str(result.inserted_id),
            'message': 'Blog post created successfully'
        }), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Admin - Update post
@app.route('/api/admin/blog/posts/<id>', methods=['PUT'])
@token_required(roles=['admin'])
def admin_update_blog_post(current_user, id):
    try:
        data = request.json
        if not data:
            return jsonify({'message': 'No data provided'}), 400

        # Validate the ID first
        try:
            obj_id = ObjectId(id)
        except:
            return jsonify({'message': 'Invalid ID format'}), 400

        # Get existing post
        existing_post = collections['blog'].find_one({'_id': obj_id})
        if not existing_post:
            return jsonify({'message': 'Post not found'}), 404

        # Prepare update data
        update_data = {
            'updatedAt': datetime.utcnow()
        }

        if 'title' in data:
            update_data['title'] = data['title']
            if 'slug' not in data:  # Only update slug if title changed and slug not explicitly provided
                slug = data['title'].lower().replace(' ', '-')
                # Ensure slug is unique
                if slug != existing_post.get('slug'):
                    counter = 1
                    while collections['blog'].find_one({'slug': slug, '_id': {'$ne': obj_id}}):
                        slug = f"{slug}-{counter}"
                        counter += 1
                    update_data['slug'] = slug
        
        if 'content' in data:
            update_data['content'] = data['content']
            # Auto-generate excerpt if not provided
            if 'excerpt' not in data:
                excerpt = data['content'][:150] + '...' if len(data['content']) > 150 else data['content']
                update_data['excerpt'] = excerpt.replace('\n', ' ').strip()
            # Update read time if content changed
            word_count = len(data['content'].split())
            read_time = max(1, round(word_count / 200))
            update_data['readTime'] = f'{read_time} min read'

        if 'excerpt' in data:
            update_data['excerpt'] = data['excerpt']
        
        if 'readTime' in data:
            update_data['readTime'] = data['readTime']
        
        if 'date' in data:
            update_data['date'] = data['date']
        
        if 'featuredImage' in data:
            update_data['featuredImage'] = data['featuredImage']
        
        if 'categories' in data:
            update_data['categories'] = data['categories']
        
        if 'featured' in data:
            update_data['featured'] = data['featured'] == 'true'

        # Perform the update
        result = collections['blog'].update_one(
            {'_id': obj_id},
            {'$set': update_data}
        )

        if result.modified_count == 0:
            return jsonify({'message': 'No changes made'}), 200
            
        return jsonify({'message': 'Post updated successfully'})

    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Admin - Delete post
@app.route('/api/admin/blog/posts/<id>', methods=['DELETE'])
@token_required(roles=['admin'])
def admin_delete_blog_post(current_user, id):
    try:
        result = collections['blog'].delete_one({'_id': ObjectId(id)})
        if result.deleted_count == 0:
            return jsonify({'message': 'Post not found'}), 404
        return jsonify({'message': 'Post deleted successfully'})
    except:
        return jsonify({'message': 'Invalid ID format'}), 400

# Admin - Upload blog images
@app.route('/api/admin/blog/upload', methods=['POST'])
@token_required(roles=['admin'])
def admin_upload_blog_image(current_user):
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'}
    if not ('.' in file.filename and file.filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS):
        return jsonify({'message': 'File type not allowed'}), 400
        
    try:
        filename = secure_filename(f"blog_{uuid.uuid4().hex}.{file.filename.rsplit('.', 1)[1].lower()}")
        filepath = os.path.join(UPLOAD_FOLDER, 'blog', filename)
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        file.save(filepath)
        return jsonify({
            'url': f'/uploads/blog/{filename}',
            'message': 'File uploaded successfully'
        })
    except Exception as e:
        return jsonify({'message': f'Upload failed: {str(e)}'}), 500

# =============== SKILLS ROUTES ================
@app.route('/api/skills', methods=['GET', 'POST'])
@token_required(roles=['admin'])
def skills(current_user):
    if request.method == 'GET':
        try:
            skills = list(db.skills.find({}).sort('name', 1))
            return json_util.dumps(skills)
        except Exception as e:
            return jsonify({'message': str(e)}), 500

    elif request.method == 'POST':
        try:
            # Handle both JSON and form data
            if request.content_type == 'application/json':
                data = request.json
            else:
                data = request.form.to_dict()

            if not data.get('name'):
                return jsonify({'message': 'Skill name is required'}), 400

            skill_data = {
                'name': data['name'],
                'level': data.get('level', 'Beginner'),
                'category': data.get('category', 'Technical'),
                'years': float(data.get('years', 0)),
                'description': data.get('description', ''),
                'icon': data.get('icon', ''),
                'created_at': datetime.now(timezone.utc),
                'updated_at': datetime.now(timezone.utc),
                'created_by': str(current_user['_id'])
            }

            # Handle file upload if present
            if 'image' in request.files:
                file = request.files['image']
                if file and allowed_file(file.filename):
                    filename = secure_filename(f"{uuid.uuid4().hex}.{file.filename.rsplit('.', 1)[1].lower()}")
                    filepath = os.path.join(UPLOAD_FOLDER, filename)
                    file.save(filepath)
                    print(f"File saved to: {filepath}")  # Debug logging
                    if os.path.exists(filepath):
                        print("File exists after saving")  # Verify
                    project_data['image_url'] = f'/uploads/{filename}'

            result = db.skills.insert_one(skill_data)
            return jsonify({
                'id': str(result.inserted_id),
                'message': 'Skill created successfully'
            }), 201

        except Exception as e:
            return jsonify({'message': str(e)}), 500


@app.route('/api/skills/<id>', methods=['GET', 'PUT', 'DELETE'])
@token_required(roles=['admin'])
def skill(current_user, id):
    try:
        if not ObjectId.is_valid(id):
            return jsonify({'message': 'Invalid ID format'}), 400
            
        obj_id = ObjectId(id)
        
        if request.method == 'GET':
            skill = db.skills.find_one({'_id': obj_id})
            if not skill:
                return jsonify({'message': 'Skill not found'}), 404
            return json_util.dumps(skill)
            
        elif request.method == 'PUT':
            # Handle both JSON and form data
            if request.content_type == 'application/json':
                data = request.json
            else:
                data = request.form.to_dict()

            if not data.get('name'):
                return jsonify({'message': 'Skill name is required'}), 400

            update_data = {
                'name': data['name'],
                'level': data.get('level', 'Beginner'),
                'category': data.get('category', 'Technical'),
                'years': float(data.get('years', 0)),
                'description': data.get('description', ''),
                'icon': data.get('icon', ''),
                'updated_at': datetime.now(timezone.utc)
            }

            # Handle file upload if new image is provided
            if 'image' in request.files:
                file = request.files['image']
                if file and allowed_file(file.filename):
                    # Delete old image if exists
                    old_skill = db.skills.find_one({'_id': obj_id})
                    if old_skill and 'imageUrl' in old_skill:
                        old_filename = old_skill['imageUrl'].split('/')[-1]
                        old_path = os.path.join(UPLOAD_FOLDER, old_filename)
                        if os.path.exists(old_path):
                            os.remove(old_path)
                    
                    # Save new image
                    filename = secure_filename(f"{uuid.uuid4().hex}.{file.filename.rsplit('.', 1)[1].lower()}")
                    file.save(os.path.join(UPLOAD_FOLDER, filename))
                    update_data['imageUrl'] = f'/uploads/{filename}'

            result = db.skills.update_one(
                {'_id': obj_id},
                {'$set': update_data}
            )
            
            if result.matched_count == 0:
                return jsonify({'message': 'Skill not found'}), 404
                
            return jsonify({'message': 'Skill updated successfully'}), 200

        elif request.method == 'DELETE':
            # First get the skill to delete its image
            skill = db.skills.find_one({'_id': obj_id})
            if not skill:
                return jsonify({'message': 'Skill not found'}), 404
                
            # Delete associated image if exists
            if 'imageUrl' in skill:
                filename = skill['imageUrl'].split('/')[-1]
                filepath = os.path.join(UPLOAD_FOLDER, filename)
                if os.path.exists(filepath):
                    os.remove(filepath)
            
            # Delete the skill
            result = db.skills.delete_one({'_id': obj_id})
            if result.deleted_count == 0:
                return jsonify({'message': 'Skill not found'}), 404
                
            return jsonify({'message': 'Skill deleted successfully'}), 200
            
    except Exception as e:
        return jsonify({'message': f'Server error: {str(e)}'}), 500

from datetime import datetime, timezone  



# ===== PROJECTS ROUTES =====
@app.route('/api/projects', methods=['GET'])
@token_required(roles=['admin'])
def get_projects(current_user):
    """Get paginated list of projects (admin only)"""
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        skip = (page - 1) * per_page
        
        total = collections['projects'].count_documents({})
        projects = list(collections['projects'].find({})
                      .sort('created_at', -1)
                      .skip(skip)
                      .limit(per_page))
        
        # Convert ObjectId to string for each project
        for project in projects:
            project['_id'] = str(project['_id'])
            if 'created_by' in project:
                project['created_by'] = str(project['created_by'])
        
        return jsonify({
            'data': projects,  # Direct array
            'total': total,
            'page': page,
            'per_page': per_page,
            'total_pages': (total + per_page - 1) // per_page
        })
    except Exception as e:
        return jsonify({'message': f'Error fetching projects: {str(e)}'}), 500

@app.route('/api/projects', methods=['POST'])
@token_required(roles=['admin'])
def create_project(current_user):
    """Create a new project"""
    try:
        data = request.form.to_dict()
        
        # Validate required fields
        if not data.get('title') or not data.get('description'):
            return jsonify({'message': 'Title and description are required'}), 400
            
        # Handle technologies array
        technologies = request.form.getlist('technologies[]')
        
        project_data = {
            'title': data['title'],
            'description': data['description'],
            'link': data.get('link', ''),
            'technologies': technologies,
            'status': data.get('status', 'active'),
            'featured': data.get('featured', 'false') == 'true',
            'created_by': str(current_user['_id']),
            'created_at': datetime.now(timezone.utc),
            'updated_at': datetime.now(timezone.utc)
        }
        
        # Handle file upload
        if 'image' in request.files:
            file = request.files['image']
            if file and allowed_file(file.filename):
                filename = secure_filename(f"project_{uuid.uuid4().hex}.{file.filename.rsplit('.', 1)[1].lower()}")
                file.save(os.path.join(UPLOAD_FOLDER, filename))
                project_data['image_url'] = f'/uploads/{filename}'
        
        result = collections['projects'].insert_one(project_data)
        
        return jsonify({
            'id': str(result.inserted_id),
            'message': 'Project created successfully',
            'image_url': project_data.get('image_url', '')
        }), 201
        
    except Exception as e:
        return jsonify({'message': f'Error creating project: {str(e)}'}), 500

@app.route('/api/projects/<id>', methods=['GET'])
@token_required(roles=['admin'])
def get_project(current_user, id):
    """Get a single project by ID"""
    try:
        # Validate ID format first
        if not ObjectId.is_valid(id):
            return jsonify({'message': 'Invalid project ID format'}), 400
            
        obj_id = ObjectId(id)
        experience = collections['experience'].find_one({'_id': obj_id})
        
        if not project:
            return jsonify({'message': 'Project not found'}), 404
            
        return json_util.dumps(project)
        
    except Exception as e:
        return jsonify({'message': f'Error fetching project: {str(e)}'}), 500

@app.route('/api/projects/<id>', methods=['PUT'])
@token_required(roles=['admin'])
def update_project(current_user, id):
    """Update an existing project"""
    try:
        # Validate ID format first
        if not ObjectId.is_valid(id):
            return jsonify({'message': 'Invalid project ID format'}), 400
            
        obj_id = ObjectId(id)
        data = request.form.to_dict()
        
        # Get existing project
        existing_project = collections['projects'].find_one({'_id': obj_id})
        if not existing_project:
            return jsonify({'message': 'Project not found'}), 404
            
        update_data = {
            'title': data.get('title', existing_project['title']),
            'description': data.get('description', existing_project['description']),
            'link': data.get('link', existing_project.get('link', '')),
            'technologies': request.form.getlist('technologies[]') or existing_project['technologies'],
            'status': data.get('status', existing_project.get('status', 'active')),
            'featured': data.get('featured', str(existing_project.get('featured', False))) == 'true',
            'updated_at': datetime.now(timezone.utc)
        }

        # Handle file upload if new image is provided
        if 'image' in request.files:
            file = request.files['image']
            if file and allowed_file(file.filename):
                # Delete old image if exists
                if 'image_url' in existing_project:
                    old_filename = existing_project['image_url'].split('/')[-1]
                    old_path = os.path.join(UPLOAD_FOLDER, old_filename)
                    if os.path.exists(old_path):
                        os.remove(old_path)
                
                # Save new image
                filename = secure_filename(f"project_{uuid.uuid4().hex}.{file.filename.rsplit('.', 1)[1].lower()}")
                file.save(os.path.join(UPLOAD_FOLDER, filename))
                update_data['image_url'] = f'/uploads/{filename}'

        result = collections['projects'].update_one(
            {'_id': obj_id},
            {'$set': update_data}
        )
        
        if result.modified_count == 0:
            return jsonify({'message': 'No changes made to project'}), 200
            
        return jsonify({
            'message': 'Project updated successfully',
            'image_url': update_data.get('image_url', existing_project.get('image_url', ''))
        })
        
    except Exception as e:
        return jsonify({'message': f'Error updating project: {str(e)}'}), 500

@app.route('/api/projects/<id>', methods=['DELETE'])
@token_required(roles=['admin'])
def delete_project(current_user, id):
    """Delete a project"""
    try:
        # Validate ID format first
        if not ObjectId.is_valid(id):
            return jsonify({'message': 'Invalid project ID format'}), 400
            
        obj_id = ObjectId(id)
        
        # First get the project to delete its image
        project = collections['projects'].find_one({'_id': obj_id})
        if not project:
            return jsonify({'message': 'Project not found'}), 404
            
        # Delete associated image if exists
        if 'image_url' in project:
            filename = project['image_url'].split('/')[-1]
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            if os.path.exists(filepath):
                os.remove(filepath)
        
        # Delete the project
        result = collections['projects'].delete_one({'_id': obj_id})
        
        if result.deleted_count == 0:
            return jsonify({'message': 'Project not found'}), 404
            
        return jsonify({'message': 'Project deleted successfully'})
        
    except Exception as e:
        return jsonify({'message': f'Error deleting project: {str(e)}'}), 500

# Public route for projects
@app.route('/api/public/projects', methods=['GET'])
def get_public_projects():
    """Get public projects (no auth required)"""
    try:
        # Add filtering by status and featured
        status = request.args.get('status', 'active')
        featured = request.args.get('featured', None)
        
        query = {'status': status}
        if featured is not None:
            query['featured'] = featured.lower() == 'true'
            
        projects = list(collections['projects'].find(
            query,
            {
                '_id': 1,
                'title': 1,
                'description': 1,
                'link': 1,
                'technologies': 1,
                'image_url': 1,
                'created_at': 1,
                'featured': 1
            }
        ).sort('created_at', -1))
        
        return json_util.dumps(projects)
    except Exception as e:
        return jsonify({'message': f'Error fetching public projects: {str(e)}'}), 500
    

# ===== EDUCATION ROUTES =====
@app.route('/api/education', methods=['GET'])
def get_educations():
    """Get paginated list of educations"""
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        skip = (page - 1) * per_page
        
        total = collections['education'].count_documents({})
        educations = list(collections['education'].find({})
                      .sort('start_date', -1)
                      .skip(skip)
                      .limit(per_page))
        
        return jsonify({
            'data': json_util.dumps(educations),
            'total': total,
            'page': page,
            'per_page': per_page,
            'total_pages': (total + per_page - 1) // per_page
        })
    except Exception as e:
        return jsonify({'message': f'Error fetching educations: {str(e)}'}), 500

@app.route('/api/education', methods=['POST'])
@token_required(roles=['admin'])
def create_education(current_user):
    """Create a new education"""
    try:
        data = request.form.to_dict()
        
        # Validate required fields
        if not data.get('degree') or not data.get('institution'):
            return jsonify({'message': 'Degree and institution are required'}), 400
            
        education_data = {
            'degree': data['degree'],
            'institution': data['institution'],
            'field_of_study': data.get('field_of_study', ''),
            'start_date': data.get('start_date', ''),
            'end_date': data.get('end_date', ''),
            'description': data.get('description', ''),
            'courses': request.form.getlist('courses[]') or [],
            'gpa': float(data.get('gpa', 0)) if data.get('gpa') else None,
            'website': data.get('website', ''),
            'featured': data.get('featured', 'false') == 'true',
            'created_by': str(current_user['_id']),
            'created_at': datetime.now(timezone.utc),
            'updated_at': datetime.now(timezone.utc)
        }
        
        # Handle file upload
        if 'image' in request.files:
            file = request.files['image']
            if file and allowed_file(file.filename):
                filename = secure_filename(f"edu_{uuid.uuid4().hex}.{file.filename.rsplit('.', 1)[1].lower()}")
                file.save(os.path.join(UPLOAD_FOLDER, filename))
                education_data['image_url'] = f'/uploads/{filename}'
        
        result = collections['education'].insert_one(education_data)
        
        return jsonify({
            'id': str(result.inserted_id),
            'message': 'Education created successfully',
            'image_url': education_data.get('image_url', '')
        }), 201
        
    except Exception as e:
        return jsonify({'message': f'Error creating education: {str(e)}'}), 500

@app.route('/api/education/<id>', methods=['GET'])
def get_education(id):
    """Get a single education by ID"""
    try:
        # Validate ID format first
        if not ObjectId.is_valid(id):
            return jsonify({'message': 'Invalid education ID format'}), 400
            
        obj_id = ObjectId(id)
        education = collections['education'].find_one({'_id': obj_id})
        
        if not education:
            return jsonify({'message': 'Education not found'}), 404
            
        return json_util.dumps(education)
        
    except Exception as e:
        return jsonify({'message': f'Error fetching education: {str(e)}'}), 500

@app.route('/api/education/<id>', methods=['PUT'])
@token_required(roles=['admin'])
def update_education(current_user, id):
    """Update an existing education"""
    try:
        # Validate ID format first
        if not ObjectId.is_valid(id):
            return jsonify({'message': 'Invalid education ID format'}), 400
            
        obj_id = ObjectId(id)
        data = request.form.to_dict()
        
        # Get existing education
        existing_edu = collections['education'].find_one({'_id': obj_id})
        if not existing_edu:
            return jsonify({'message': 'Education not found'}), 404
            
        update_data = {
            'degree': data.get('degree', existing_edu['degree']),
            'institution': data.get('institution', existing_edu['institution']),
            'field_of_study': data.get('field_of_study', existing_edu.get('field_of_study', '')),
            'start_date': data.get('start_date', existing_edu.get('start_date', '')),
            'end_date': data.get('end_date', existing_edu.get('end_date', '')),
            'description': data.get('description', existing_edu.get('description', '')),
            'courses': request.form.getlist('courses[]') or existing_edu.get('courses', []),
            'gpa': float(data.get('gpa', 0)) if data.get('gpa') else existing_edu.get('gpa'),
            'website': data.get('website', existing_edu.get('website', '')),
            'featured': data.get('featured', str(existing_edu.get('featured', False))) == 'true',
            'updated_at': datetime.now(timezone.utc)
        }

        # Handle file upload if new image is provided
        if 'image' in request.files:
            file = request.files['image']
            if file and allowed_file(file.filename):
                # Delete old image if exists
                if 'image_url' in existing_edu:
                    old_filename = existing_edu['image_url'].split('/')[-1]
                    old_path = os.path.join(UPLOAD_FOLDER, old_filename)
                    if os.path.exists(old_path):
                        os.remove(old_path)
                
                # Save new image
                filename = secure_filename(f"edu_{uuid.uuid4().hex}.{file.filename.rsplit('.', 1)[1].lower()}")
                file.save(os.path.join(UPLOAD_FOLDER, filename))
                update_data['image_url'] = f'/uploads/{filename}'

        result = collections['education'].update_one(
            {'_id': obj_id},
            {'$set': update_data}
        )
        
        if result.modified_count == 0:
            return jsonify({'message': 'No changes made to education'}), 200
            
        return jsonify({
            'message': 'Education updated successfully',
            'image_url': update_data.get('image_url', existing_edu.get('image_url', ''))
        })
        
    except Exception as e:
        return jsonify({'message': f'Error updating education: {str(e)}'}), 500

@app.route('/api/education/<id>', methods=['DELETE'])
@token_required(roles=['admin'])
def delete_education(current_user, id):
    """Delete an education"""
    try:
        # Validate ID format first
        if not ObjectId.is_valid(id):
            return jsonify({'message': 'Invalid education ID format'}), 400
            
        obj_id = ObjectId(id)
        
        # First get the education to delete its image
        education = collections['education'].find_one({'_id': obj_id})
        if not education:
            return jsonify({'message': 'Education not found'}), 404
            
        # Delete associated image if exists
        if 'image_url' in education:
            filename = education['image_url'].split('/')[-1]
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            if os.path.exists(filepath):
                os.remove(filepath)
        
        # Delete the education
        result = collections['education'].delete_one({'_id': obj_id})
        
        if result.deleted_count == 0:
            return jsonify({'message': 'Education not found'}), 404
            
        return jsonify({'message': 'Education deleted successfully'})
        
    except Exception as e:
        return jsonify({'message': f'Error deleting education: {str(e)}'}), 500

# Public route for educations
@app.route('/api/public/education', methods=['GET'])
def get_public_educations():
    """Get public educations (no auth required)"""
    try:
        featured = request.args.get('featured', None)
        
        query = {}
        if featured is not None:
            query['featured'] = featured.lower() == 'true'
            
        educations = list(collections['education'].find(
            query,
            {
                '_id': 1,
                'degree': 1,
                'institution': 1,
                'field_of_study': 1,
                'start_date': 1,
                'end_date': 1,
                'description': 1,
                'image_url': 1,
                'created_at': 1,
                'featured': 1
            }
        ).sort('start_date', -1))
        
        return json_util.dumps(educations)
    except Exception as e:
        return jsonify({'message': f'Error fetching public educations: {str(e)}'}), 500
    
@app.route('/api/public/education/<id>', methods=['GET'])
def get_public_education(id):
    """Get public education details (no auth required)"""
    try:
        if not ObjectId.is_valid(id):
            return jsonify({'message': 'Invalid education ID format'}), 400
            
        obj_id = ObjectId(id)
        education = collections['education'].find_one({'_id': obj_id})
        
        if not education:
            return jsonify({'message': 'Education not found'}), 404
            
        # Convert ObjectId to string
        education['_id'] = str(education['_id'])
        return json_util.dumps(education)
        
    except Exception as e:
        return jsonify({'message': f'Error fetching education: {str(e)}'}), 500

# ===== EXPERIENCE =====
@app.route('/api/experience', methods=['GET'])
@token_required(roles=['admin'])
def get_experiences(current_user):
    """Get paginated list of experiences (admin only)"""
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        skip = (page - 1) * per_page
        
        total = collections['experience'].count_documents({})
        experiences = list(collections['experience'].find({})
                          .sort('created_at', -1)
                          .skip(skip)
                          .limit(per_page))
        
        # Convert ObjectId to string for each experience
        for exp in experiences:
            exp['_id'] = str(exp['_id'])
            if 'created_by' in exp:
                exp['created_by'] = str(exp['created_by'])
        
        return jsonify({
            'data': experiences,
            'total': total,
            'page': page,
            'per_page': per_page,
            'total_pages': (total + per_page - 1) // per_page
        })
    except Exception as e:
        return jsonify({'message': f'Error fetching experiences: {str(e)}'}), 500

@app.route('/api/experience', methods=['POST'])
@token_required(roles=['admin'])
def create_experience(current_user):
    """Create a new experience"""
    try:
        data = request.form.to_dict()
        
        # Validate required fields
        if not data.get('position') or not data.get('company') or not data.get('description'):
            return jsonify({'message': 'Position, company and description are required'}), 400
            
        # Handle technologies array
        technologies = request.form.getlist('technologies[]')
        
        experience_data = {
            'position': data['position'],
            'company': data['company'],
            'duration': data.get('duration', ''),
            'location': data.get('location', ''),
            'description': data['description'],
            'technologies': technologies,
            'responsibilities': request.form.getlist('responsibilities[]') or [],
            'website': data.get('website', ''),
            'featured': data.get('featured', 'false') == 'true',
            'created_by': str(current_user['_id']),
            'created_at': datetime.now(timezone.utc),
            'updated_at': datetime.now(timezone.utc)
        }
        
        # Handle file upload
        if 'image' in request.files:
            file = request.files['image']
            if file and allowed_file(file.filename):
                filename = secure_filename(f"exp_{uuid.uuid4().hex}.{file.filename.rsplit('.', 1)[1].lower()}")
                file.save(os.path.join(UPLOAD_FOLDER, filename))
                experience_data['image_url'] = f'/uploads/{filename}'
        
        result = collections['experience'].insert_one(experience_data)
        
        return jsonify({
            'id': str(result.inserted_id),
            'message': 'Experience created successfully',
            'image_url': experience_data.get('image_url', '')
        }), 201
        
    except Exception as e:
        return jsonify({'message': f'Error creating experience: {str(e)}'}), 500

@app.route('/api/experience/<id>', methods=['GET'])
@token_required(roles=['admin'])
def get_experience(current_user, id):
    """Get a single experience by ID"""
    try:
        # Validate ID format first
        if not ObjectId.is_valid(id):
            return jsonify({'message': 'Invalid experience ID format'}), 400
            
        obj_id = ObjectId(id)
        experience = collections['experience'].find_one({'_id': obj_id})
        
        if not experience:
            return jsonify({'message': 'Experience not found'}), 404
            
        return json_util.dumps(experience)
        
    except Exception as e:
        return jsonify({'message': f'Error fetching experience: {str(e)}'}), 500

@app.route('/api/experience/<id>', methods=['PUT'])
@token_required(roles=['admin'])
def update_experience(current_user, id):
    """Update an existing experience"""
    try:
        # Validate ID format first
        if not ObjectId.is_valid(id):
            return jsonify({'message': 'Invalid experience ID format'}), 400
            
        obj_id = ObjectId(id)
        data = request.form.to_dict()
        
        # Get existing experience
        existing_exp = collections['experience'].find_one({'_id': obj_id})
        if not existing_exp:
            return jsonify({'message': 'Experience not found'}), 404
            
        update_data = {
            'position': data.get('position', existing_exp['position']),
            'company': data.get('company', existing_exp['company']),
            'duration': data.get('duration', existing_exp.get('duration', '')),
            'location': data.get('location', existing_exp.get('location', '')),
            'description': data.get('description', existing_exp['description']),
            'technologies': request.form.getlist('technologies[]') or existing_exp.get('technologies', []),
            'responsibilities': request.form.getlist('responsibilities[]') or existing_exp.get('responsibilities', []),
            'website': data.get('website', existing_exp.get('website', '')),
            'featured': data.get('featured', str(existing_exp.get('featured', False))) == 'true',
            'updated_at': datetime.now(timezone.utc)
        }

        # Handle file upload if new image is provided
        if 'image' in request.files:
            file = request.files['image']
            if file and allowed_file(file.filename):
                # Delete old image if exists
                if 'image_url' in existing_exp:
                    old_filename = existing_exp['image_url'].split('/')[-1]
                    old_path = os.path.join(UPLOAD_FOLDER, old_filename)
                    if os.path.exists(old_path):
                        os.remove(old_path)
                
                # Save new image
                filename = secure_filename(f"exp_{uuid.uuid4().hex}.{file.filename.rsplit('.', 1)[1].lower()}")
                file.save(os.path.join(UPLOAD_FOLDER, filename))
                update_data['image_url'] = f'/uploads/{filename}'

        result = collections['experience'].update_one(
            {'_id': obj_id},
            {'$set': update_data}
        )
        
        if result.modified_count == 0:
            return jsonify({'message': 'No changes made to experience'}), 200
            
        return jsonify({
            'message': 'Experience updated successfully',
            'image_url': update_data.get('image_url', existing_exp.get('image_url', ''))
        })
        
    except Exception as e:
        return jsonify({'message': f'Error updating experience: {str(e)}'}), 500

@app.route('/api/experience/<id>', methods=['DELETE'])
@token_required(roles=['admin'])
def delete_experience(current_user, id):
    """Delete an experience"""
    try:
        # Validate ID format first
        if not ObjectId.is_valid(id):
            return jsonify({'message': 'Invalid experience ID format'}), 400
            
        obj_id = ObjectId(id)
        
        # First get the experience to delete its image
        experience = collections['experience'].find_one({'_id': obj_id})
        if not experience:
            return jsonify({'message': 'Experience not found'}), 404
            
        # Delete associated image if exists
        if 'image_url' in experience:
            filename = experience['image_url'].split('/')[-1]
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            if os.path.exists(filepath):
                os.remove(filepath)
        
        # Delete the experience
        result = collections['experience'].delete_one({'_id': obj_id})
        
        if result.deleted_count == 0:
            return jsonify({'message': 'Experience not found'}), 404
            
        return jsonify({'message': 'Experience deleted successfully'})
        
    except Exception as e:
        return jsonify({'message': f'Error deleting experience: {str(e)}'}), 500

# Public route for experiences
@app.route('/api/public/experience', methods=['GET'])
def get_public_experiences():
    """Get public experiences (no auth required)"""
    try:
        featured = request.args.get('featured', None)
        
        query = {}
        if featured is not None:
            query['featured'] = featured.lower() == 'true'
            
        experiences = list(collections['experience'].find(
            query,
            {
                '_id': 1,
                'position': 1,
                'company': 1,
                'duration': 1,
                'location': 1,
                'description': 1,
                'technologies': 1,
                'image_url': 1,
                'created_at': 1,
                'featured': 1
            }
        ).sort('created_at', -1))
        
        return json_util.dumps(experiences)
    except Exception as e:
        return jsonify({'message': f'Error fetching public experiences: {str(e)}'}), 500
    
@app.route('/api/public/experience/<id>', methods=['GET'])
def get_public_experience(id):
    """Get public experience details (no auth required)"""
    try:
        if not ObjectId.is_valid(id):
            return jsonify({'message': 'Invalid experience ID format'}), 400
            
        obj_id = ObjectId(id)
        experience = collections['experience'].find_one({'_id': obj_id})
        
        if not experience:
            return jsonify({'message': 'Experience not found'}), 404
            
        # Convert ObjectId to string
        experience['_id'] = str(experience['_id'])
        return json_util.dumps(experience)
        
    except Exception as e:
        return jsonify({'message': f'Error fetching experience: {str(e)}'}), 500


# ===== CERTIFICATES =====
@app.route('/api/certificates', methods=['GET', 'POST'])
@token_required(roles=['admin'])
def certificates(current_user):
    if request.method == 'GET':
        certificates = list(collections['certificates'].find({}))
        return json_util.dumps(certificates)
    elif request.method == 'POST':
        data = request.json
        data['created_by'] = str(current_user['_id'])
        data['created_at'] = datetime.datetime.utcnow()
        result = collections['certificates'].insert_one(data)
        return jsonify({'id': str(result.inserted_id)}), 201

@app.route('/api/certificates/<id>', methods=['GET', 'PUT', 'DELETE'])
@token_required(roles=['admin'])
def certificate(current_user, id):
    if request.method == 'GET':
        certificate = collections['certificates'].find_one({'_id': ObjectId(id)})
        if not certificate:
            return jsonify({'message': 'Certificate not found'}), 404
        return json_util.dumps(certificate)
    elif request.method == 'PUT':
        data = request.json
        result = collections['certificates'].update_one(
            {'_id': ObjectId(id)},
            {'$set': data}
        )
        if result.modified_count == 0:
            return jsonify({'message': 'No changes made'}), 400
        return jsonify({'message': 'Certificate updated successfully'})
    elif request.method == 'DELETE':
        result = collections['certificates'].delete_one({'_id': ObjectId(id)})
        if result.deleted_count == 0:
            return jsonify({'message': 'Certificate not found'}), 404
        return jsonify({'message': 'Certificate deleted successfully'})



# ========== FILE UPLOAD ========== #
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload', methods=['POST'])
@token_required(roles=['admin'])
def upload_file(current_user):
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'message': 'File type not allowed'}), 400
        
    try:
        filename = secure_filename(f"{uuid.uuid4().hex}_{file.filename}")
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        return jsonify({
            'url': f'/uploads/{filename}',
            'message': 'File uploaded successfully'
        })
    except Exception as e:
        return jsonify({'message': f'Upload failed: {str(e)}'}), 500

@app.route('/uploads/<filename>')
def serve_upload(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# ========== CONTACT FORM ========== #
@app.route('/api/contact', methods=['POST'])
def handle_contact():
    data = request.json
    message = {
        'name': data.get('name'),
        'email': data.get('email'),
        'message': data.get('message'),
        'created_at': datetime.datetime.utcnow(),
        'read': False
    }
    
    collections['messages'].insert_one(message)
    
    try:
        msg = MIMEText(f"""
        Name: {message['name']}
        Email: {message['email']}
        Message: {message['message']}
        """)
        msg['Subject'] = 'New Contact Form Submission'
        msg['From'] = 'noreply@vibecanvas.com'
        msg['To'] = 'admin@vibecanvas.com'
        
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login('your_email@gmail.com', 'your_password')
            server.send_message(msg)
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
    
    return jsonify({'message': 'Thank you for your message!'})

# ========== PUBLIC API ========== #
@app.route('/api/public/portfolio', methods=['GET'])
def public_portfolio():
    portfolio = {
        'skills': list(collections['skills'].find({}, {'_id': 1, 'name': 1, 'level': 1})),
        'projects': list(collections['projects'].find({}, {'_id': 1, 'title': 1, 'description': 1, 'image_url': 1})),
        'education': list(collections['education'].find({}, {'_id': 1, 'degree': 1, 'institution': 1, 'year': 1})),
        'experience': list(collections['experience'].find({}, {'_id': 1, 'position': 1, 'company': 1, 'duration': 1})),
        'certificates': list(collections['certificates'].find({}, {'_id': 1, 'name': 1, 'issuer': 1, 'date': 1})),
        'blog': list(collections['blog'].find({}, {'_id': 1, 'title': 1, 'excerpt': 1, 'date': 1, 'slug': 1}))
    }
    return json_util.dumps(portfolio)

# ========== SETTINGS ========== #
@app.route('/api/settings', methods=['GET'])
def get_settings():
    settings = collections['settings'].find_one({}, {'_id': 0})
    return jsonify(settings)

@app.route('/api/settings', methods=['PUT'])
@token_required(roles=['admin'])
def update_settings(current_user):
    data = request.json
    collections['settings'].update_one({}, {'$set': data})
    return jsonify({'message': 'Settings updated'})

# ========== ERROR HANDLERS ========== #
@app.errorhandler(404)
def not_found(e):
    return jsonify({'message': 'Resource not found'}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({'message': 'Internal server error'}), 500

# ========== START SERVER ========== #
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)