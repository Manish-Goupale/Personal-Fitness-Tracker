from flask import Flask, render_template, request, redirect, url_for, session, flash # type: ignore
from database import db, User, Workout, WorkoutPlan, Progress
import os
from datetime import datetime

app = Flask(__name__)
# MySQL with XAMPP configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/fitness_app'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.urandom(24)
app.config['PERMANENT_SESSION_LIFETIME'] = 604800  # 7 days in seconds
db.init_app(app)

# Instead of using @app.before_first_request, use this approach:
# Create a function that creates a Flask app context and creates tables
def create_tables():
    with app.app_context():
        db.create_all()

# Rest of your code remains the same
@app.route('/', methods=['GET', 'POST'])
def login():
    if 'username' in session:
        return redirect(url_for('dashboard'))
        
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        remember = 'remember' in request.form
        
        user = User.query.filter_by(username=username).first()
        
        if user and user.check_password(password):
            session['username'] = username
            session['user_id'] = user.id
            
            # Update last login time
            user.update_last_login()
            
            # Handle "remember me" functionality
            if remember:
                session.permanent = True
            
            return redirect(url_for('dashboard'))
        else:
            return render_template('login.html', error='Invalid username or password')
    
    return render_template('login.html', error=None)

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if 'username' in session:
        return redirect(url_for('dashboard'))
        
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        email = request.form.get('email', '')
        
        # Check if username or email already exists
        existing_user = User.query.filter_by(username=username).first()
        existing_email = User.query.filter_by(email=email).first() if email else None
        
        if existing_user:
            return render_template('signup.html', error='Username already exists')
        
        if existing_email:
            return render_template('signup.html', error='Email already registered')
            
        # Validate password strength (basic validation)
        if len(password) < 6:
            return render_template('signup.html', error='Password must be at least 6 characters long')
            
        # Create new user
        new_user = User(username=username, email=email)
        new_user.set_password(password)
        
        try:
            db.session.add(new_user)
            db.session.commit()
            flash('Account created successfully! Please log in.', 'success')
            return redirect(url_for('login'))
        except Exception as e:
            db.session.rollback()
            return render_template('signup.html', error=f'Error creating account: {str(e)}')
        
    return render_template('signup.html', error=None)

@app.route('/dashboard')
def dashboard():
    if 'username' not in session:
        return redirect(url_for('login'))
        
    # Get the user from database
    user = User.query.filter_by(username=session['username']).first()
    
    if not user:
        session.clear()
        return redirect(url_for('login'))
    
    # Fetch real workout plans for this user from database
    workout_plans = WorkoutPlan.query.filter_by(user_id=user.id).all()
    
    # If no workout plans exist yet, use sample data
    if not workout_plans:
        workout_plans = [
            {
                'title': 'Full Body Workout',
                'description': 'Focus on strength and endurance for the entire body.',
                'progress': 60
            },
            {
                'title': 'Cardio Blast',
                'description': 'High-intensity cardio workout for fat burning.',
                'progress': 40
            },
            {
                'title': 'Strength Training',
                'description': 'Build muscle and increase strength with weights.',
                'progress': 80
            }
        ]
    
    # Fetch upcoming workouts from database
    upcoming_workouts = Workout.query.filter_by(
        user_id=user.id, 
        completed=False
    ).order_by(Workout.date).limit(5).all()
    
    # If no upcoming workouts exist yet, use sample data
    if not upcoming_workouts:
        current_year = datetime.now().year
        upcoming_workouts = [
            {
                'date': f'{current_year}-10-10',
                'workout': 'Full Body Workout',
                'duration': '1 hr',
                'status': 'Pending'
            },
            {
                'date': f'{current_year}-10-11',
                'workout': 'Cardio Blast',
                'duration': '45 mins',
                'status': 'Pending'
            },
            {
                'date': f'{current_year}-10-12',
                'workout': 'Strength Training',
                'duration': '1 hr 30 mins',
                'status': 'Pending'
            }
        ]
        
    return render_template(
        'dashboard.html',
        user=user,
        username=user.username,
        workout_plans=workout_plans,
        upcoming_workouts=upcoming_workouts
    )

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out successfully.', 'info')
    return redirect(url_for('login'))

@app.route('/forgot_password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        email = request.form.get('email', '')
        user = User.query.filter_by(email=email).first()
        
        if user:
            # In a real application, you would send a password reset email here
            # For this demo, we'll just show a success message
            flash('Password reset instructions have been sent to your email.', 'success')
            return redirect(url_for('login'))
        else:
            return render_template('forgot_password.html', error='Email not found')
            
    return render_template('forgot_password.html', error=None)

@app.route('/profile', methods=['GET', 'POST'])
def profile():
    if 'username' not in session:
        return redirect(url_for('login'))
        
    user = User.query.filter_by(username=session['username']).first()
    
    if not user:
        session.clear()
        return redirect(url_for('login'))
        
    if request.method == 'POST':
        # Update profile logic would go here
        pass
        
    return render_template('profile.html', user=user)

if __name__ == '__main__':
    # Call the create_tables function before running the app
    create_tables()
    app.run(debug=True)