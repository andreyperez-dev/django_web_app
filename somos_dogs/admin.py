from django.contrib import admin
from .models import User, Dog, Race, Human, Course, CourseInfo, Session

# Register your models here.
admin.site.register(User)
admin.site.register(Dog)
admin.site.register(Race)
admin.site.register(Human)
admin.site.register(Course)
admin.site.register(CourseInfo)
admin.site.register(Session)
