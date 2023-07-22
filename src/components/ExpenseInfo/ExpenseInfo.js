import React from "react";
import {useState,useEffect} from 'react';
import styles from "./ExpenseInfo.module.css";
import { collection,getDocs } from "firebase/firestore";
import { db } from "../../firebaseinit";

// to fetch data from the database
const useExpenseData = () => {
  const [expenseData,setExpenseData] = useState([]);

  useEffect(()=>{
    const fetchData = async()=> {
      const docRef = collection(db,'expenseData');
      const snapShot = await getDocs(docRef);
      const data = snapShot.docs.map((doc)=>{
        return {
          id:doc.id,
          ...doc.data()
        }
      });
      setExpenseData(data);
    };
    fetchData();
  },[expenseData]);
  return{expenseData};
}

const ExpenseInfo = () => {
  const {expenseData} = useExpenseData();
  let profitAmount = 0;
  let lossAmount = 0;
  const grandTotal = expenseData.reduce((acc, currentExpense) => {
    const currentExpenseAmount = parseInt(currentExpense.amount);
    if (currentExpenseAmount < 0) {
      lossAmount += currentExpenseAmount;
    } else {
      profitAmount += currentExpenseAmount;
    }
    return currentExpenseAmount + acc;
  }, 0);

  return (
    <div className={styles.expenseInfoContainer}>
      <div className={styles.balance}>
        <h4>YOUR BALANCE</h4>
        <h1>${grandTotal.toFixed(2)}</h1>
      </div>
      <div className={styles.incomeExpenseContainer}>
        <div>
          <h4>Income</h4>
          <p id="money-plus" className={`${styles.money} ${styles.plus}`}>
          +${Math.abs(profitAmount).toFixed(2)}
          </p>
        </div>
        <div>
          <h4>Expense</h4>
          <p id="money-minus" className={`${styles.money} ${styles.minus}`}>
          -${Math.abs(lossAmount).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpenseInfo;
