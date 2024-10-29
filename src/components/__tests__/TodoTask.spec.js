import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import TodoDetails from "../TodoDetails.vue";
import { useTodoStore } from "@/stores/todoStore";

//dscribe is used to group related tests
describe("TodoDetails component", () => {
  let wrapper, todoStore;

  //beforeeach and Aftereach set up and  clean up before and after each test
  beforeEach(() => {
    setActivePinia(createPinia());
    todoStore = useTodoStore();
    wrapper = mount(TodoDetails, {
      global: {
        plugins: [createPinia()],
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  //It defines a single test case
  it("adds a new todo item when addItem is called", async () => {
    todoStore.addTodo({
      id: 1,
      value: "New Task",
      completed: false,
    });

    //Verify todo was added to the store
    expect(todoStore.todos).toHaveLength(1); //expect is used for assertions i.e check if conditions are met
    expect(todoStore.todos[0].value).toBe("New Task");
  });

  it("does not add an empty todo item", async () => {
    wrapper.vm.userInput = ""; // vm allow have access to the component instance
    await wrapper.find(".btn-success").trigger("click");
    expect(todoStore.todos.length).toBe(0);
  });

  it("editing an existing todo item", async () => {
    todoStore.addTodo({
      id: 1,
      value: "Edit Task",
      completed: false,
    });
    wrapper.vm.editItem(0);
    await wrapper.vm.$nextTick();

    expect(todoStore.todos[0].value).toBe("Edit Task");
  });

  it("delete a todo item when deleteItem is called", async () => {
    // vi is a vitest object for mocking functions, which is useful for simulating behaviour (e.g browser confirmations)

    window.confirm = vi.fn(() => true); // mock confirm dialog
    wrapper.vm.deleteItem(0);

    expect(todoStore.todos.length).toBe(0);
  });

  // write testing for toggleCompleted
  it("toggle between completed and undo", async () => {
    todoStore.addTodo({
      id: 1,
      value: "Toggled Task",
      completed: false,
    });
    todoStore.toggleCompleted(0);
    expect(todoStore.todos[0].completed).toBe(true);

    todoStore.toggleCompleted(0);
    expect(todoStore.todos[0].completed).toBe(false);
  });

  //testing for loadTodoFromStorage
  describe("loadTodosFromStorage", () => {
    it("get tasks from localStorage", async () => {
      //data for test
      const checkTodos = [
        { id: 1, value: "Todo 1", completed: false },
        { id: 2, value: "Todo 2", completed: true },
      ];

      //mock localStorage
      localStorage.setItem("todos", JSON.stringify(checkTodos));
      //load from LS
      todoStore.loadTodosFromStorage();

      expect(todoStore.todos).toHaveLength(2);
      expect(todoStore.todos[0].value).toBe("Todo 1");
      expect(todoStore.todos[1].completed).toBe(true);
    });
  });
});
