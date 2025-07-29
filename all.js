let box = document.querySelector(".students-grid");
let api = "http://localhost:3000/students";
let modal = document.querySelector(".modal");
let openBtn = document.querySelector(".open-modal");
let closeBtn = document.querySelector(".close-modal");
let form = document.querySelector("#add-form");
let edit = document.querySelector("#edit-modal");
let editForm = document.querySelector("#edit-form");
let cancel = document.querySelector("#close-edit");
let search = document.querySelector(".search");
let idx = null;

cancel.onclick = () => edit.close();

search.oninput = () => {
    getUsers()
}


editForm.onsubmit = async function (e) {
    e.preventDefault();

    let updatedStudent = {
        name: editForm.name.value,
        phone: editForm.phone.value,
        age: +editForm.age.value,
        gender: editForm.gender.value,
        group: editForm.group.value,
        date: editForm.date.value,
        status: editForm.status.value
    };

    await axios.put(`${api}/${idx}`, updatedStudent);
    editForm.reset();
    edit.close();
    getUsers();

};

function openEdit(student) {
    idx = student.id;
    editForm.name.value = student.name;
    editForm.phone.value = student.phone;
    editForm.age.value = student.age;
    editForm.gender.value = student.gender;
    editForm.group.value = student.group;
    editForm.date.value = student.date;
    editForm.status.value = student.status;

    edit.showModal();
}

openBtn.onclick = () => modal.showModal();
closeBtn.onclick = () => modal.close();

form.onsubmit = async function (e) {
    e.preventDefault();

    let student = {
        name: form.name.value,
        phone: form.phone.value,
        age: +form.age.value,
        gender: form.gender.value,
        group: form.group.value,
        date: form.date.value,
        status: form.status.value
    };

    await axios.post("http://localhost:3000/students", student);
    form.reset();
    modal.close();
    getUsers();
}


async function getUsers() {
    try {
        let res = await axios.get(api);
        allStudents = res.data;
        get(allStudents);
    } catch (err) {
        console.error(err);
    }
}


async function dell(id) {
    await axios.delete("http://localhost:3000/students/" + id)
    getUsers()
}



function get(el) {
    box.innerHTML = "";

    el
     .filter((e) => e.name.toLowerCase().includes(search.value.toLowerCase().trim()))
    .forEach(e => {
        let div = document.createElement("div");
        div.className = "student-card";

        let top = document.createElement("div");
        top.className = "top";

        let info = document.createElement("div");
        info.className = "info";
        info.innerHTML = `
      <h3>${e.name}</h3>
      <p>${e.phone} | ${e.age} year | ${e.gender}</p>
    `;

        let avatar = document.createElement("div");
        avatar.className = "avatar";
        avatar.textContent = "👤";

        top.append(info, avatar);

        let course = document.createElement("div");
        course.className = "course";
        course.innerHTML = `
      <p>${e.group}</p>
      <span>${e.date}</span>
    `;

        let bottom = document.createElement("div");
        bottom.className = "bottom";

        let status = document.createElement("p");
        let statusSpan = document.createElement("span");
        statusSpan.textContent = e.status;

        if (e.status) {
            statusSpan.innerHTML = "Active"
            statusSpan.style.color = "green"
        }
        else {
            statusSpan.innerHTML = "inActive"
            statusSpan.style.color = "red"
        }

        let btn_del = document.createElement("button")
        btn_del.innerHTML = "delete"
        btn_del.onclick = () => {
            dell(e.id)
        }

        let btn_edit = document.createElement("button");
        btn_edit.innerHTML = "edit";
        btn_edit.onclick = () => {
            openEdit(e);
        };


        status.innerHTML = `Status: `;
        status.appendChild(statusSpan);

        bottom.appendChild(status);

        bottom.appendChild(status);
        bottom.appendChild(btn_edit);
        bottom.appendChild(btn_del);

        div.append(top, course, bottom, btn_del, btn_edit);
        box.appendChild(div);
    });
}

getUsers();
