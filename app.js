  import {
    initializeApp
  } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
  import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
  } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
  import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
  } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyBSKMP8ex9xmW2bS3o1Qv1EdcNJflvp9ng",
    authDomain: "practice-7cd17.firebaseapp.com",
    projectId: "practice-7cd17",
    storageBucket: "practice-7cd17.firebasestorage.app",
    messagingSenderId: "898823669518",
    appId: "1:898823669518:web:887b7c646192b3364a795f",
    measurementId: "G-WM306HHJET"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);


  // Sign Up Form

  let getSbtn = document.querySelector('#sbtn');

  if (getSbtn) {
    getSbtn.addEventListener('click', (event) => {
      event.preventDefault();
      let email = document.querySelector("#semail").value.trim();
      let password = document.querySelector("#spass").value.trim();

      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;

          Swal.fire({
            title: "Sign up successful! Redirecting to login...",
            text: "You clicked the button!",
            icon: "success"
          });

          setTimeout(() => {
            window.location.href = "./login.html";
          }, 1000);

          console.log(user.email, "user")
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "!",
          });
          console.log(errorCode, errorMessage, "error");

        });
    })
  }

  // Sign In / login Form

  let lbtn = document.querySelector("#lbtn");

  if (lbtn) {

    lbtn.addEventListener('click', (event) => {
      event.preventDefault();
      let email = document.querySelector("#lemail").value.trim();
      let password = document.querySelector("#lpass").value.trim();

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;

          Swal.fire({
            title: "login success...",
            text: "You clicked the button!",
            icon: "success"
          });

          setTimeout(() => {
            window.location.href = "./crud.html";
          }, 1000);

          console.log(`${user.email} login success`);

        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
          console.log(errorCode, errorMessage), "error";

        });
    })
  }

  //fireStore Database

  // Add User
  let submitData = document.getElementById("submitData");
  submitData.addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const title = document.getElementById("title").value.trim();

    if (!name || !email || !phone || !title) return Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Add all details!",
    });

    await addDoc(collection(db, "users"), {
      name,
      email,
      phone,
      title
    });
    Swal.fire({
    title: "Data add successfuly",
    icon: "success",
    draggable: true
  });
    showUsers(); // Refresh
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("title").value = "";
    
  
  });

  // Show Users
  async function showUsers() {
    const usersTableBody = document.getElementById("usersTableBody");
    usersTableBody.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((docSnap) => {
      const user = docSnap.data();
      const id = docSnap.id;

      const row = document.createElement("tr");
      row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td>${user.title}</td>
      <td>
        <button id="editButton" onclick="editUser('${id}', '${user.name}', '${user.email}', '${user.phone}', '${user.title}')">✏️ Edit</button>
        <button id="deleteButton" onclick="deleteUser('${id}')">🗑️ Delete</button>
      </td>
    `;
      usersTableBody.appendChild(row);
    });
  }

  // Delete Function
  window.deleteUser = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(db, "users", id));
      Swal.fire({
        title: "Deleted!",
        text: "User has been deleted.",
        icon: "success"
      });
      showUsers(); // Refresh the list
    }
  };

  // Edit Function
  window.editUser = async (id, currentName, currentEmail, currentPhone, currentTitle) => {
    const {
      value: formValues
    } = await Swal.fire({
      title: 'Edit User',
      html: `<input id="swal-name" class="swal2-input" placeholder="Name" value="${currentName}">` +
        `<input id="swal-email" class="swal2-input" placeholder="Age" value="${currentEmail}">` +
        `<input id="swal-phone" class="swal2-input" placeholder="Age" value="${currentPhone}">` +
        `<input id="swal-title" class="swal2-input" placeholder="Age" value="${currentTitle}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Update',
      preConfirm: () => {
        const name = document.getElementById('swal-name').value;
        const email = document.getElementById('swal-email').value;
        const phone = document.getElementById('swal-phone').value;
        const title = document.getElementById('swal-title').value;
        if (!name || !email || !phone || !title) {
          Swal.showValidationMessage('Both fields are required');
          return false;
        }
        return {
          name,
          email,
          phone,
          title
        };
      }
    });

    if (formValues) {
      await updateDoc(doc(db, "users", id), {
        name: formValues.name,
        email: formValues.email,
        phone: formValues.phone,
        title: formValues.title,
      });
      Swal.fire('Updated!', 'User data has been updated.', 'success');
      showUsers(); // Refresh the table
    }
  };

  showUsers();