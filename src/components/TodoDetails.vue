<script setup>
import { ref, computed, onMounted } from "vue";
import { useTodoStore } from "@/stores/todoStore";

const todoStore = useTodoStore();

const userInput = ref("");
const searchInput = ref("");

//Load saved todos when the component is mounted
onMounted(() => {
  todoStore.loadTodosFromStorage();
});

const addItem = () => {
  if (userInput.value.trim() !== "") {
    const newItem = {
      id: Math.random(),
      value: userInput.value.trim(),
      completed: false,
    };

    todoStore.addTodo(newItem);
    userInput.value = "";
  }
};

const editItem = (index) => {
  //Set input field with selected todo text
  userInput.value = todoStore.todos[index].value;
  //temp remove item for re-adding purpose
  todoStore.deleteTodo(index);
};

const deleteItem = (index) => {
  const deleteTodo = confirm("Are you sure you want to delete this?");
  if (deleteTodo) {
    todoStore.deleteTodo(index);
  }
};

const toggleCompleted = (index) => {
  todoStore.toggleCompleted(index);
};

const filteredList = computed(() => {
  return todoStore.todos.filter((item) =>
    item.value.toLowerCase().includes(searchInput.value.toLowerCase())
  );
});
</script>

<template>
  <div>
    <header>
      <nav class="navbar">
        <h1>Todo App </h1>
        <div class="logo"><img src="" alt="" /></div>
      </nav>
    </header>

    <div class="container">
      <h1 class="title">Your Lists</h1>
      <hr />
      <div class="input-group">
        <input
          type="text"
          class="form-control"
          v-model="userInput"
          @keyup.enter="addItem"
          placeholder="Add your List..."
        />
        <button class="btn-success btn" @click="addItem">Add To-do</button>
      </div>

      <div class="input-group" >
         <input
          type="text"
          class="form-control"
          v-model="searchInput"
          placeholder="Search for list..."
        />
      </div>

      <div class="todo-table">
        <div class="table-header">
          <div class="table-cell">Tasks</div>
          <div class="table-cell">Actions</div>
        </div>

        <div class="table-body">
          <div
            class="table-row"
            v-for="(item, index) in filteredList"
            :key="index"
            :class="{ 'even-row': index % 2 === 0, completed: item.completed }"
          >
            <div
              class="table-cell"
              :class="{ 'completed-cell': item.completed }"
            >
              {{ item.value }}
            </div>

            <div class="table-cell">
              <button class="btn-primary btn" @click="toggleCompleted(index)">
                {{ item.completed ? "Undo" : "Complete" }}
              </button>
              <button class="btn-info btn" @click="editItem(index)">
                Edit
              </button>
              <button class="btn-danger btn" @click="deleteItem(index)">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="../assets/main.css"></style>
