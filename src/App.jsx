import { useState, useEffect, createContext, useContext } from "react";
import "./index.css";
import { MdCheck, MdDeleteOutline } from "react-icons/md";

//theme Context
const ThemeContext = createContext();

// theme Provider
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`app-container ${theme}`}>{children}</div>
    </ThemeContext.Provider>
  );
};

      // maain App
        export const App = () => {
        return (
        <ThemeProvider>
         <TodoApp />
        </ThemeProvider>
        );
       };
 
// Todo     Component
const TodoApp = () => {
  const [inputValue, setInputValue] = useState({ id: "", content: "", checked: false });

  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  const { toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);


  const handleInputChange = (value) => {
    setInputValue({id:value,content:value, checked:false});
  
  }

  const handleFormSubmit = (e) => {
     e.preventDefault();
     const{id,content,checked} = inputValue;
     if(!content) return;

      const ifTaskContentMatched =  todos.find(
      (curTask) => curTask.content === content);
      if(ifTaskContentMatched){
        setInputValue({id:"",content:"", checked:false});  
      }
      if(ifTaskContentMatched) return;
       
      setTodos((prev) => [...prev, {id,content,checked}]);
      setInputValue({id:"",content:"", checked:false});
  };

  // this part will be handleing the delete part
    const handleDeleteTodo = (value) => {
    const updatedTodos = todos.filter((todo) => todo.id !== value.id);
     setTodos(updatedTodos);
   };

     /// this part will handle the the checking part 
   const handleCheckTodo = (value) => {
        const updatedTodos = todos.map((todo) => {
        if (todo.id === value.id) {
        return { ...todo, checked: !todo.checked };
       }
    return todo;
    });
     setTodos(updatedTodos);
     };

     // variable , when all tasks are completed
    const allCompleted = todos.length >0 && todos.every((todo) => todo.checked);


  return (
    <section className="todo-container">
      <header>
        <h1>Todo List</h1>
        <button onClick={toggleTheme} className="theme-toggle-btn">
          Toggle Theme
        </button>
      </header>

      <section className="form">
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            placeholder="Enter task"
            className="todo-input"
            autoComplete="off"
            value={inputValue.content}
            onChange={(e) => handleInputChange(e.target.value)}
          />
          <button type="submit" className="todo-btn">
            Add Task
          </button>
        </form>
      </section>
 
      <section className="myUnOrdList">
        <ul>
          {todos.map((todo, i) => {
            return (
              <li key={todo.id} className={`todo-item ${todo.checked ? "checked": " "}`}>
              <span>{todo.content}</span>
              <button className="check-btn"
              onClick={()=> handleCheckTodo(todo)}
              >
                <MdCheck />
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteTodo(todo)}
                >
                <MdDeleteOutline />
              </button>
            </li>
              );
          })}
        </ul>
       </section>
            {allCompleted && <p> Completed all tasks </p>}
       </section>
  );
};

