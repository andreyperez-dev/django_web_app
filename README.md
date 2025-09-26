# Somos Dogs Web app

**Distinctiveness and Complexity**

This project is different from the other projects developed in the course because:

- The User interface (UI) is responsive and dynamic, enhancing the user experience when using the app.
- The app uses a single page sign in - sign up, using responsive and dynamic CSS properties, to slide from one side to another the sign in - sign up form. JavaScript was also used to address each form and to accomplish the interactive UI.
- The app uses different models for ease in the data infrastructure.
- The app uses different logics in the templates rendered by Django to allow the display of information that may vary with each user, making it scalable when having multiple users using the app.

All these features of this project comply with the distinctiveness requirements.

Regarding the Complexity requirements, those are satisfied with the implementation of:

- Project deployment in AWS EC2, allowing access to the app from any browser (url: <http://3.144.127.196/somos_dogs/>).
- Media handling, allowing dogs to have a profile picture.
- Custom CSS and JavaScript (even for modals) use, avoiding the use of Bootstrap utils.
- Frontend JavaScript use for the information sent to the backend, prepopulating fields, sending requests and refreshing applicable fields without the need of reloading the entire page, allowing a better user experience.
- Custom API's creation in the backend for the frontend requests management.
- Management of new users vs. current users.
- Modals use for information modifications instead of a single new page for each information that needs to be modified.
- App is not only responsive for mobile devices, but also for screens that are smaller than a pc (i.e. tablets)

**App Documentation**

This app was created to allow a dog trainer company to have a record of each dog being trained there and to allow the dog owners to follow the process of their dogs training.

**Content in each file of the project**

Instead of describing each file of the project, I'm going to describe the content of each folder and some important files.

**Media folder:** This folder contains all the media that the app uses. It's configured at this point only for the storage of the dog's profile picture.

**somos_dogs folder:** This folder contains all the app files including:

- **Static files:** These files are the CSS files used to allow dynamic UI and the JavaScript files, used to make requests and upload data in the applicable fields.
- **Template files:** These files contain Django placeholders to render the applicable information in accordance with the page that is being displayed. All of them inherit from a layout.html file that contains all the basic structure of the web app.
- **admin.py:** This file contains the configuration for the admin site, allowing you to make changes directly into the models.
- **models.py:** This file contains all the database models used in the app.
- **urls.py:** This file contains all the URLs that are used in the somos_dogs app (including the custom APIs)
- **views.py:** This file contains all the functions defined for each URL.

**somos2 folder:** This folder contains all the default Django files for the project. The only files that were modified were:

- **settings.py:** In this file changes were made to set the app for production (AWS deployment).
- **urls.py:** To include all the URLs located in somos_dogs/urls.py for the use in the app.

**staticfiles folder:** This folder was created using the Django built-in function collectstatics. This was created to allow the AWS server to be served with static files using gunicorn.

**db.sqlite3:** This was the default database created by Django. There was no need to create an additional database using another platform. SQLite was more than enough for the intended use of the app.

**requirements.txt:** This file contains all the required python modules that need to be installed to get the application running.

**How to run the app**

- Go to <http://3.144.127.196/somos_dogs/>.
- Click on "REGISTRATE" to create an account and be able to login.
- Enter the user, email, password and its confirmation, then click in "REGISTRARTE".
- As you're a new user the application is going to ask you for additional information, once entered, you will be allowed to access the page.
- As your user doesn't have dogs associated you won't be able to see any information. (The previous steps were for checking the sign-up process).
- To check all the functionality of the app you need to click on "Salir".
- Once in the login page, enter as username: erik and as password: 123.
- You'll be taken to the home page.
- In the upper navigation bar you can click "Mi perfil" to see all the accounts details. Inside this module you can edit the account information. You can also see the list of dogs associated to the account (if you want to see the dog profile, you just need to click the name of the dog).
- You can also click "Mis peludos" to see the dogs associated to the account in a more graphic way. Click on "Ver perfil de" to see the dog's profile.
- Once in the dog's profile page, you can see detailed information about the dog.
- At the end of the page, you'll be able to see the sessions or classes taken by the dog. You just need to click on the course box to see the course sessions.
- Inside of it you'll be able to see all the session associated with the dog and course. In this modal you can modify the session details and course status.