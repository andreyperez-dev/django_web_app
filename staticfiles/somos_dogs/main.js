document.addEventListener('DOMContentLoaded', () =>{
    
    window.onscroll = function() {headerShadow()};
    
    // HUMAN MODAL
    const humanEditButton = document.querySelector(".edit-human-data");
    if (humanEditButton) {
        humanEditButton.addEventListener('click', () => {
            openModal("#human-modal");
    })
    }

    // COURSE MODALS
    const coursesBox = document.querySelectorAll(".courses-box")
    coursesBox.forEach(box => {
        box.addEventListener('click', () => {
            openModal(`#course-container_${box.dataset.id}`);
        })
    })

    // ALL CLOSE BUTTONS
    // BUTTONS WITH NO ID ARE THE NON-COURSES MODALS
    const closeBtn = document.querySelectorAll(".cls-btn");
    closeBtn.forEach(button => {
        if (button.dataset.id){
            button.addEventListener('click', () => {
                closeModal(`#course-container_${button.dataset.id}`);
            })
        }
        else{
            button.addEventListener('click', () => {
                closeModal("#human-modal");
            })
        }
    })

    // NAV MENU BUTTON
    navMenuButton = document.querySelector("#nav-menu-btn");
    navMenuButton.addEventListener('click',() =>
        myMenuFunction()); 

    // MODIFY SESSION BUTTONS
    const sessionEditButtons = document.querySelectorAll(".modifySession");
    sessionEditButtons.forEach(button => {
        button.addEventListener('click', () => {
            activate_edit_session(button.dataset.id);
        })
    })

    // ADD SESSION BUTTONS
    const sessionAddButtons = document.querySelectorAll(".add-session-btn");
    sessionAddButtons.forEach(button => {
        button.addEventListener('click', () =>{
            activate_add_session(button.dataset.id)
        })
    })

    // COURSE EDIT BUTTONS
    const courseEditButton = document.querySelectorAll(".modify-course-status");
    courseEditButton.forEach(button => {
        button.addEventListener('click', () => {
            activate_edit_course(button.dataset.id);
        })
    })

    // HUMAN SAVE EDIT BUTTON
    const humanSaveEditBtn = document.querySelector(".human-edit-btn");
    if (humanSaveEditBtn) {
        humanSaveEditBtn.addEventListener('click', () => {
            const modal = document.querySelector("#human-modal");
            edit_human(modal.dataset.username);
        })
    }

    
    // FUNCTIONS
    function getCsrfToken(formId){
        const form = document.querySelector(`#${formId}`)
        if (form){
            const token = form.querySelector('input[name=csrfmiddlewaretoken]');
            return token.value;
        }
        return null;
    }

    // MODIFY SESSION VIEW
    function activate_edit_session(id){
        // DESCRIPTION
        const previousDescription = document.querySelector(`#session-description_${id}`);
        const editDescription = document.createElement("textarea");
        editDescription.textContent = previousDescription.textContent;
        editDescription.className = "sessionTextArea";
        previousDescription.replaceWith(editDescription);
        
        // BUTTON
        previousButton = document.querySelector(`#session-edit-btn_${id}`);
        saveButton = document.createElement("button");
        saveButton.className = "cbtn";
        saveButton.textContent = "Guardar";
        saveButton.id = `save-edit-btn_${id}`;
        // SAVE EDIT
        saveButton.addEventListener('click', (event) =>{
            event.preventDefault();
            save_edit_session(id);
        });
        previousButton.replaceWith(saveButton);
    }

    // SAVE EDIT SESSION
    function save_edit_session (id){
        const form = document.querySelector(`#session-edit-form_${id}`);
        const csrfToken = getCsrfToken(form.id);
        const newDescription = form.querySelector("textarea");
        
        fetch("/somos_dogs/edit_session", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({
                id: id,
                description: newDescription.value
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result)

            if (result.error){
                const errorDiv = document.querySelector(".errorInEdition");
                errorDiv.textContent = result.error;
            }
            else if (result.success){
                // DESCRIPTION
                const newDescriptionP = document.createElement("p");
                newDescriptionP.id = `session-description_${id}`;
                newDescriptionP.textContent = newDescription.value
                newDescription.replaceWith(newDescriptionP);
                // BUTTONS
                const saveButton = document.querySelector(`#save-edit-btn_${id}`);
                const newButton = document.createElement("button");
                newButton.id = `session-edit-btn_${id}`;
                newButton.classList.add("cbtn","modifySession")
                newButton.dataset.id = id;
                newButton.textContent = "Modificar sesión"
                newButton.addEventListener('click', () => {
                    activate_edit_session(id);
                })
                saveButton.replaceWith(newButton);
            }
        })
    }

    // MODIFY COURSE VIEW
    function activate_edit_course(id){
        // DESCRIPTION
        const previousStatus = document.querySelector(`#course-status_${id}`);
        const newStatus = document.createElement("select");
        newStatus.id = `courseStatus_${id}`;
        newStatusOptions = ["Aprobado", "Reprobado", "Detenido","Finalizado"];
        newStatusOptions.forEach(option => {
            const newOption = document.createElement("option");
            newOption.textContent= option;
            newOption.value = option;
            newStatus.appendChild(newOption);
        })
        newStatus.value = previousStatus.textContent;
        previousStatus.replaceWith(newStatus);
        
        // BUTTON
        previousButton = document.querySelector(`#course-edit-btn_${id}`);
        saveButton = document.createElement("button");
        saveButton.classList.add("cbtn" ,"modify-course-status", "save");
        saveButton.textContent = "Guardar";
        saveButton.id = `course-save-edit-btn_${id}`;
        // SAVE EDIT
        saveButton.addEventListener('click', (event) =>{
            event.preventDefault();
            save_edit_course(id);
        });
        previousButton.replaceWith(saveButton);
    }
    // SAVE EDIT COURSE 
    function save_edit_course(id){
        const selectedStatus = document.querySelector(`#courseStatus_${id}`);
        const csrfToken = getCsrfToken(`courseStatusEditForm_${id}`);

        fetch("/somos_dogs/edit_course", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "X-CSRFtoken": csrfToken
            },
            body: JSON.stringify({
                id : id,
                status : selectedStatus.value
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            if (result.error){
                const errorDiv = document.querySelector(".errorInCourseEdition")
                errorDiv.textContent = result.error;
            }
            else if(result.success){
                // SPAN
                const courseStatusSpan = document.createElement("span");
                courseStatusSpan.id = `course-status_${id}`;
                courseStatusSpan.className ="course-status";
                courseStatusSpan.textContent = selectedStatus.value
                selectedStatus.replaceWith(courseStatusSpan)
                // BUTTON
                const saveButton = document.querySelector(`#course-save-edit-btn_${id}`);
                const newButton = document.createElement("button");
                newButton.id = `course-edit-btn_${id}`;
                newButton.dataset.id = id;
                newButton.classList.add("cbtn", "modify-course-status");
                newButton.textContent = "Modificar estado del curso";
                newButton.addEventListener('click', () => {
                    activate_edit_course(id)
                })
                saveButton.replaceWith(newButton);
            }
        })
    }

    // EDIT HUMAN 
    function edit_human(username){
        const form = document.querySelector("#human-edit-form");
        const csrfToken = getCsrfToken(form.id);
        const first_name = document.querySelector(`#${username}_first_name`).value;
        const last_name = document.querySelector(`#${username}_last_name`).value;
        const phone_number = document.querySelector(`#${username}_phone_number`).value;

        fetch('/somos_dogs/edit_human', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "X-CSRFtoken": csrfToken
            },
            body: JSON.stringify({
                username: username,
                first_name: first_name,
                last_name: last_name,
                phone_number: phone_number
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.error){
                const errorDiv = document.querySelector("#errorInHumaEdit");
                errorDiv.textContent = result.error;
            }
            else if(result.success){
                closeModal("#human-modal");
                const humanContainer = document.querySelector(".human-data-content");
                const newFirstName = humanContainer.querySelector(".first_name");
                newFirstName.textContent = first_name;
                const newLastName = humanContainer.querySelector(".last_name");
                newLastName.textContent = last_name;
                const newPhoneNumber = humanContainer.querySelector(".phone_number");
                newPhoneNumber.textContent = phone_number;
            }
        })
    }

    // ACTIVATE ADD SESSION
    function activate_add_session(id){
        const addSessionDiv = document.querySelector(`#add-session_${id}`);
        addSessionDiv.remove()
        const form = document.querySelector(`#sessionForm_${id}`);
        const csrfToken = getCsrfToken(form.id);
        const newSessionDiv = document.querySelector(`#new-session_${id}`);
        newSessionDiv.style.display= "flex";
        
        const saveButton = document.querySelector(`#save-btn_${id}`);
        
        
        
        saveButton.addEventListener('click', () => {
            const newDescription = newSessionDiv.querySelector(".sessionTextArea").value;
            const human = document.querySelector(`#session_${id}_human`).value;
            const status = document.querySelector(`#session_${id}_status`).value;
            const level = document.querySelector(`#session_${id}_level`).value;

            fetch("/somos_dogs/add_session", {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                    'X-CSRFtoken': csrfToken
                },
                body: JSON.stringify({
                    id: id,
                    human: human,
                    status: status,
                    level: level,
                    description: newDescription
                })
            })
            .then(response => response.json())
            .then(result => {
                console.log(result)
                location.reload()
                // TO DO : HANDLE result.error AND DO NOT RELOAD THE ENTIRE PAGE, INSTEAD CLOSE
                // THE MODAL AND ADD A DIV OR AN ALERT TO NOTIFY THAT THE CHANGE WAS MADE.
            })
        })
    }

    // PAGE FUNTIONALITY
    // NAVIGATION BAR FUNTION
    function myMenuFunction(){
        var menuBtn = document.querySelector("#myNavMenu");

        if (menuBtn.className === "nav-menu"){
            menuBtn.className += " responsive";
        } else {
            menuBtn.className = "nav-menu"
        }
    }

    // NAVBAR SHADOW FUNCTION
    function headerShadow(){
        const navHeader = document.querySelector("#header");
        const logo = document.querySelector("#navbar-logo");

        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50){
            navHeader.style.boxShadow = "0 1px 6px rgba(0, 0, 0, 0.1)";
            navHeader.style.height = "70px";
            navHeader.style.lineHeight = "70px";
            logo.style.height = "60px";
            logo.style.width = "60px";
        } else {
            navHeader.style.boxShadow = "none";
            navHeader.style.height = "100px";
            navHeader.style.lineHeight = "100px";
            logo.style.height = "90px";
            logo.style.width = "90px";
        }
    }

    // OPENING MODAL FUNCTION
    function openModal(modalId){
        modalInstance = document.querySelector(modalId);
        modalInstance.classList.add('show');
    }

    // CLOSING MODAL FUNCTION
    function closeModal(modalId){
        modalInstance = document.querySelector(modalId);
        modalInstance.classList.remove('show');
    }
});

