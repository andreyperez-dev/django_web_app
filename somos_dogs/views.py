from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import render, redirect
import json

from .models import User, Dog, Race, Human, Course, CourseInfo, Session

def index(request):
    if request.user.is_authenticated:

        if request.method == 'POST':
            first_name = request.POST["first_name"]
            last_name = request.POST["last_name"]
            phone_number = request.POST["phone_number"]

            new_human= human(
	    	first_name = first_name,
            	last_name = last_name,
		phone_number = phone_number
	    )
            new_human.save()
            request.user.is_complete = True
            request.user.save()
            return redirect("index")
        else:
	    human = Human.objects.get(user=request.user) 
            plural = True if Dog.objects.filter(owner=request.user).count() > 1 else False
            return render(request, "somos_dogs/index.html", {
                "human": human,
                "plural": plural
            })
    else:
        return render(request, 'somos_dogs/login-register.html')

def login_user(request):
    if request.method == 'POST':
        
        data = json.loads(request.body)
        username = data["username"]
        password = data["password"]
        user = authenticate(request, username=username.lower(), password=password)

        if user is not None:
            login(request, user)
            return JsonResponse({"success": f"Logged in {request.user}"}, status=200)
        else:
            return JsonResponse({"error": "Usuario y/o contraseña invalida"
            }, status=401)
    else:
        return JsonResponse({"error": "Must submit using POST request"})

def logout_view(request):
    logout(request)
    return redirect('index')

def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data["username"]
        email = data["email"]

        password = data["password"]
        confirmation = data["confirmation"]
        if password != confirmation:
            return JsonResponse({"error": "Las contraseñas deben coincidir"}, status = 401)
        
        try:
            user = User.objects.create_user(username.lower(), email, password)
            user.save()
        except IntegrityError:
            return JsonResponse({"error": "Ese nombre de usuario ya existe, intenta con otro"}, 
                                status = 401)
        login(request, user)
        return JsonResponse({"success" : "User registered"}, status = 200)
    else:
        return JsonResponse({request, "Must submit using a POST request"}, status = 401)

def dogs(request):
    dogs = Dog.objects.filter(owner=request.user)
    return render(request, "somos_dogs/human_dogs.html", {
        "dogs": dogs
    })

def dog(request, name):
    dog = Dog.objects.get(name__iexact=name, owner=request.user)
    users = dog.owner.prefetch_related('human').all()
    owners = []
    human = Human.objects.get(user=dog.owner.first())
    for user in users:
        owners.append(f'<b>{user.human.first_name}</b>')

    if len(owners) == 1:
        phrase = f"y mi tutor es {owners[0]}"
    elif len(owners) == 2:
        phrase = f"y mis tutores son {owners[0]} y {owners[1]}"
    else:
        all_but_last = owners[:-1]
        last = owners[-1]
        phrase = f"y mis tutores son {', '.join(all_but_last)} y {last}"

    courses = CourseInfo.objects.filter(dog=dog).order_by('enrollment_date')
    sessions_by_course = {}
    for course in courses:
        sessions_in_course = Session.objects.filter(dog=dog, course=course.course).order_by('date')
        sessions_by_course[course] = sessions_in_course

    return render(request, 'somos_dogs/dog.html', {
        "dog": dog,
        "phrase": phrase,
        "sessions": sessions_by_course,
        "human": human
    })

def profile(request, username):
    user = User.objects.get(username=username)
    human = Human.objects.get(user=user)
    dogs = Dog.objects.filter(owner=user)

    return render(request, "somos_dogs/human.html", {
        "human": human,
        "dogs": dogs
    })

def edit_session(request):
    if request.method == 'POST':

        data = json.loads(request.body)
        session_id = data["id"]
        description = data["description"]
        session = Session.objects.get(pk=int(session_id))
        session.description = description
        session.save()
        return JsonResponse({"success": "Session edited"}, status=200)
    
    else:
        return JsonResponse({"error": "Request must be made via POST"}, status=401)
    
def edit_course(request):
    if request.method == 'POST':

        data= json.loads(request.body)
        id = data["id"]
        course = CourseInfo.objects.get(pk=int(id))
        status = data["status"]
        course.status = status
        course.save()
        return JsonResponse({"success": "Course status modified"}, status = 200)
    else:
        return JsonResponse({"error": "Request must be made via POST"}, status=401)

def edit_human(request):
    if request.method == 'POST':
        
        data = json.loads(request.body)
        username = data.get("username")
        first_name = data.get("first_name")
        last_name = data.get("last_name")
        phone_number = data.get("phone_number")
        user = User.objects.get(username__iexact=username)
        human = Human.objects.get(user=user)
        human.first_name = first_name
        human.last_name = last_name
        human.phone_number = phone_number
        human.save()
        return JsonResponse({"success": "Human data modified correctly"}, status = 200)
    else:
        return JsonResponse({"error": "Request must be made via POST"}, status = 403)
    
def add_session(request):
    if request.method == 'POST':

        data = json.loads(request.body)
        courseId = data["id"]
        course = CourseInfo.objects.get(pk=courseId)
        human = data["human"]
        user = User.objects.get(username__iexact=human)
        status = data["status"]
        approved = True if status == "Aprobado" else False
        level = int(data["level"])
        description = data["description"]
        new_session = Session(course=course.course, dog=course.dog, human=user, approved=approved, level=level, description=description)
        new_session.save()
        return JsonResponse({"success": "Session added successfully"}, status=200)
    else:
        return JsonResponse({"error": "Request must be made via POST"}, status=403)
