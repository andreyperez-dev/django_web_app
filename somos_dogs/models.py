from django.contrib.auth.models import AbstractUser
from PIL import Image
from io import BytesIO
from django.db import models
from django.core.files.base import ContentFile

# Create your models here.
class User(AbstractUser):
    is_complete = models.BooleanField(default=False, null=True, blank=True)
    is_teacher = models.BooleanField(default=False, null=True, blank=True)

class Dog(models.Model):
    name = models.CharField(max_length=65)
    race = models.ForeignKey('race', on_delete=models.CASCADE)
    owner = models.ManyToManyField(User, related_name="dogs")
    profile_picture = models.ImageField(upload_to= 'profiles', blank=True, null=True)
    
    def __str__(self):
        owners_usernames = [owner.username for owner in self.owner.all()]
        owners_list = ", ".join(owners_usernames)
        
        return f"Name: {self.name} | Owner(s): {owners_list}"
    
class Race(models.Model):
    name = models.CharField(max_length=65, unique=True)

    def __str__(self):
        return f"{self.name}"

class Human(models.Model): 
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="human")
    first_name = models.CharField(max_length=65)
    last_name = models.CharField(max_length=65)
    phone_number = models.CharField(max_length=65)
    
    def __str__(self):
       return f"This is {self.first_name} {self.last_name}. Phone number is: {self.phone_number}"
    

class Course(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name}"
    
class CourseInfo(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="info")
    dog = models.ForeignKey(Dog, on_delete=models.CASCADE, related_name="courses", null=True)
    enrollment_date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=100)

class Session(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    dog = models.ForeignKey(Dog, on_delete=models.CASCADE)
    human= models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    date = models.DateTimeField(auto_now_add=True)
    approved = models.BooleanField()
    level = models.IntegerField(null=True)
    description = models.TextField(null=True)

    def __str__(self):
        return f"Peludo: {self.dog.name}, Tutor: {self.human.all()}, Curso: {self.course.name}"
    