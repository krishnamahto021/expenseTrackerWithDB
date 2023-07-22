import React from "react";
import styles from "./ExpenseList.module.css";
import Transaction from "../Transaction/Transaction";
import {useState,useEffect} from 'react'
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseinit";

// fetch data from the database
const useExpenseData = () =>{
  const [expenseData,setExpenseData] = useState([]);
  useEffect(()=>{
    const fetchData = async () => {
      const docRef = collection(db,'expenseData');
      const snapShot = await getDocs(docRef);
      const data = snapShot.docs.map((doc) => {
        return {
          id:doc.id,
          ...doc.data()
        }
      });
      setExpenseData(data);
    };
    fetchData();
  },[expenseData]);
  return {expenseData};
}

const ExpenseList = ({deleteExpense, changeExpenseToUpdate }) => {
  const {expenseData} = useExpenseData();
  return (
    <div className={styles.expenseListContainer}>
      <h3>Transactions</h3>
      <ul className={styles.transactionList}>
        {expenseData.map((expense, i) => {
          return (
            <Transaction
              index={i}
              key={expense.id}
              expense={expense}
              deleteExpense={deleteExpense}
              changeExpenseToUpdate={changeExpenseToUpdate}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default ExpenseList;
