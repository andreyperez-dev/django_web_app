from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("logout", views.logout_view, name="logout"),
    path("peludo/<str:name>", views.dog, name="dog"),
    path("perfil/<str:username>", views.profile, name="profile"),
    path("peludos", views.dogs, name="dogs"),
    
    #API's
    path("login", views.login_user, name="login"),
    path("register", views.register, name="register"),
    path("edit_session", views.edit_session, name="edit_session"),
    path("edit_course", views.edit_course, name="edit_course"),
    path("edit_human", views.edit_human, name="edit_human"),
    path("add_session", views.add_session, name="add_session")
]
