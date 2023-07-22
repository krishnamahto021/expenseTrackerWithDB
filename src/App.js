import { useState, useReducer, useEffect } from "react";
import { db } from "./firebaseinit";
import { getDocs,setDoc } from "firebase/firestore";
import "./App.css";

// components imports
import ExpenseForm from "./components/ExpenseForm/ExpenseForm";
import ExpenseInfo from "./components/ExpenseInfo/ExpenseInfo";
import ExpenseList from "./components/ExpenseList/ExpenseList";

// react toasts
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { collection, deleteDoc, doc, getDoc } from "firebase/firestore";

// import firebase methods here

const reducer = (state, action) => {
  const { payload } = action;
  switch (action.type) {
    case "ADD_EXPENSE": {
      return {
        expenses: [payload.expense, ...state.expenses]
      };
    }
    case "REMOVE_EXPENSE": {
      async function deleteFunction() {
        const docRef = doc(db, 'expenseData', payload.id);
        await deleteDoc(docRef);
      }
      deleteFunction();
      return state;
    }
    case "UPDATE_EXPENSE": {
      const expensesDuplicate = [...state.expenses];
      expensesDuplicate[payload.expensePos] = payload.expense;
      return {
        expenses: expensesDuplicate
      };
    }
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, { expenses: [] });
  const [expenseToUpdate, setExpenseToUpdate] = useState(null);

  const useExpenseData = () => {
    const [expenseData, setExpenseData] = useState([]);
    useEffect(() => {
      const fetchData = async () => {
        const docRef = collection(db, 'expenseData');
        const snapShot = await getDocs(docRef);
        const data = snapShot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data()
          };
        });
        setExpenseData(data);
      };
      fetchData();
    }, [expenseData]);
    return expenseData;
  };

  const expenseData = useExpenseData();

  const addExpense = async (expense) => {
    // add expense to firestore here

    dispatch({
      type: "ADD_EXPENSE",
      // add the new document id to the payload expense object below
      payload: { expense: { ...expense } }
    });
    toast.success("Expense added successfully.");
  };

  const deleteExpense = async (id) => {
    // const docRef = doc(db, 'expenseData', id);
    // await deleteDoc(docRef);
    dispatch({ type: "REMOVE_EXPENSE", payload: { id } });
  };

  const resetExpenseToUpdate = () => {
    setExpenseToUpdate(null);
  };

  // const updateExpense = async (expense) => {
  //   const expensePos = expenseData.findIndex((exp) => exp.id === expense.id);

  //   if (expensePos === -1) {
  //     return false;
  //   }

  //   // update expense in firestore here
  //   const docRef = doc(db, 'expenseData', expense.id);
  //   await docRef.update(expense);

  //   dispatch({ type: "UPDATE_EXPENSE", payload: { expensePos, expense } });
  //   toast.success("Expense updated successfully.");
  // };

  const updateExpense = async (expense) => {
    const expensePos = expenseData.findIndex((exp) => exp.id === expense.id);
  
    if (expensePos === -1) {
      return false;
    }
  
    // Update the expense in firestore here
    const docRef = doc(db, 'expenseData', expense.id);
    await setDoc(docRef, expense); // Use setDoc instead of update
  
    dispatch({ type: "UPDATE_EXPENSE", payload: { expensePos, expense } });
    toast.success("Expense updated successfully.");
  };



  return (
    <>
      <ToastContainer />
      <h2 className="mainHeading">Expense Tracker</h2>
      <div className="App">
        <ExpenseForm
          addExpense={addExpense}
          expenseToUpdate={expenseToUpdate}
          updateExpense={updateExpense}
          resetExpenseToUpdate={resetExpenseToUpdate}
        />
        <div className="expenseContainer">
          <ExpenseInfo expenses={state.expenses} />
          <ExpenseList
            expenses={state.expenses}
            deleteExpense={deleteExpense}
            changeExpenseToUpdate={setExpenseToUpdate}
          />
        </div>
      </div>
    </>
  );
}

export default App;
