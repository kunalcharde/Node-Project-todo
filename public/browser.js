document.addEventListener("click", function (event) {
  if (event.target.classList.contains("add_item")) {
    //event.preventDefault();
    console.log("click");

    const todoText = document.getElementById("create_field").value;
    console.log(todoText);

    if (todoText.value === "") {
      alert("Please enter the todo text");
    }

    axios
      .post("/create-item", { todo: todoText })
      .then((res) => {
        if (res.data.status !== 201) {
          alert(res.data.message);
          return;
        }
        console.log(res);
        document.getElementById("create_field").value = "";
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  }
  //edit
  else if (event.target.classList.contains("edit-me")) {
    const id = event.target.getAttribute("data-id");
    const newData = prompt("Enter your new todo text");

    console.log(id, newData);
    axios
      .post("/edit-item", { id, newData })
      .then((res) => {
        if (res.data.status !== 200) {
          alert(res.data.message);
          return;
        }
        console.log(res);
        event.target.parentElement.parentElement.querySelector(
          ".item-text"
        ).innerHTML = newData;
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  }
  //delete
  else if (event.target.classList.contains("delete-me")) {
    const id = event.target.getAttribute("data-id");

    axios
      .post("/delete-item", { id })
      .then((res) => {
        if (res.data.status !== 200) {
          alert(res.data.message);
          return;
        }
        event.target.parentElement.parentElement.remove();
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

window.onload = function () {
  genrateTodos();
};

function genrateTodos() {
  //axios get, return todos
  console.log("window load");

  axios
    .get("/read-item")
    .then((res) => {
      console.log(res.data.data);
      const todos = res.data.data;

      document.getElementById("item_list").insertAdjacentHTML(
        "beforeend",
        todos
          .map((item) => {
            return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
          <span class="item-text">${item.todo}</span>
          <div>
          <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
          <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
      </div>
      </li>`;
          })
          .join("")
      );
    })
    .catch((err) => {
      console.log(err);
    });
}

//client (axios)<---REST API---->BACKEND(express)<----->Database(mongodb)
