'use client'
import { addDoc, collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import {db} from '../firebaseConfig'
import { rewards, stats, tasks } from './config';


export const getTask=async(userId:string)=>{
  const docRef = doc(db, userId, 'dailytasks');  
  const querySnapshot = await getDoc(docRef);

  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    // Document data found, return it
    const data=docSnap.data()
    console.log("Document data:", data);
    if(data.date!==getTodaysDate()){
      data.date=getTodaysDate()
      data.submitted=false
      data.tasks.map((task:any)=>{
        task.completed=false
      })
      updateTasks(userId,data)
    }
    return data;
  } else {
    // Document does not exist
    console.log("No such document!");
    return null;
  }
}

const updateTasks=async(userId:string,data:any)=>{
  const docRef = doc(db, userId, 'dailytasks'); 
  const docSnap = await setDoc(docRef,data);
}

export const getProfile=async(userId:string)=>{
  const colRef = collection(db, userId);
    
    // Get all documents from the collection
    const snapshot = await getDocs(colRef);
    
    // Convert documents to an array
    const documents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Log or process documents
    console.log(documents);
    return documents;
}

export const createProfile=async(userId:string)=>{
  let docRef = doc(db, userId, 'stats');
  await setDoc(docRef, {
    streak:0,
    stats
  });

  docRef = doc(db, userId, 'dailytasks');
  await setDoc(docRef, {
    tasks,
    date:getTodaysDate(),
    submitted:false
  });

  docRef = doc(db, userId, 'rewards');
  await setDoc(docRef, {
    rewards,
    userId
  });

  docRef = doc(db, userId, 'history');
  await setDoc(docRef, {
    history:{}
  });
}



export const submitDailyTask=async(userId:string,tasks:any)=>{
  console.log(userId,tasks)
  let data={}
  getProfile(userId).then((response)=>{
    console.log(response)
    const tempProfile:any={... response}
    response.map(async (element:any,index:number)=>{
      if(element.id==='dailytasks'){
        tasks.submitted=true
        tempProfile[index]=tasks

        // add daily tasks 
        const docRef = doc(db, userId, 'dailytasks');
        await setDoc(docRef,tempProfile[index]);

      }
      if(element.id==='history'){
        tempProfile[index].history[getTodaysDate()]=tasks

        // add history
        const docRef = doc(db, userId, 'history');
        await setDoc(docRef,tempProfile[index]);
      }
      if(element.id==='rewards'){
        const temprewards=tempProfile[index].rewards
        const coldshower=tasks.tasks.find((task: { name: string; }) => task.name==='Cold shower')
          if(!coldshower.completed){
            temprewards.map((reward:any)=>{
              reward.count=0
            })
          }
          else{
          temprewards.map((reward:any)=>{
              tasks.tasks.map((task:any)=>{
                if(reward.requirement.task===task.name){
                  if(task.completed){
                    reward.count+=1
                  }
                  // console.log("found")
                }
                if(reward.reset.includes(task.name)){
                  if(!task.completed){
                    reward.count=0
                  }
                }
              })
              if(reward.requirement.days<=reward.count){
                reward.claim+=1
                reward.count=0
              }
            })
        }

        // adding rewards
        const docRef = doc(db, userId, 'rewards');
        await setDoc(docRef,tempProfile[index]);
      }
      if(element.id==='stats'){
        const coldshower=tasks.tasks.find((task: { name: string; }) => task.name==='Cold shower')
        if(!coldshower.completed){
          tempProfile[index].streak=0
          tempProfile[index].stats.map((stat:any)=>{
            stat.value=0
          })
        }
        else{
          let streak=true
          tasks.tasks.map((task:any)=>{
            if(task.completed){
              task.stats.map((stat:string)=>{
                tempProfile[index].stats.find((element: { name: any; }) => element.name===stat).value+=1
              })
            }
            else{
              streak=false
              task.stats.map((stat:string)=>{
                let value=tempProfile[index].stats.find((element: { name: any; }) => element.name===stat).value
                if(value!==0)
                  value-=1
              })
            }
          })
          console.log("checking",Object.keys(tempProfile[1]))
          if(streak && Object.keys(tempProfile[1].history).includes(getYesterdayDate()))
          {
            tempProfile[index].streak+=1
          }
          else if(streak && Object.keys(tempProfile[1].history).length===0){
            tempProfile[index].streak+=1
          }
          else
            tempProfile[index].streak=0
        }
        

        // adding stats
        const docRef = doc(db, userId, 'stats');
        await setDoc(docRef,tempProfile[index]);
      }
    })
  })
}

export const updateReward=async(userId:string,updatedData:any)=>{
  const docRef = doc(db, userId, 'rewards');
  await updateDoc(docRef, updatedData);
}

const getTodaysDate=()=>{
const today = new Date();
today.setDate(today.getDate());
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
const day = String(today.getDate()).padStart(2, '0'); // Pad single digits with leading zeros

const formattedDate = `${year}-${month}-${day}`;
return formattedDate
}

const getYesterdayDate=()=>{
const today = new Date();
today.setDate(today.getDate() - 1);
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
const day = String(today.getDate()).padStart(2, '0'); // Pad single digits with leading zeros

const formattedDate = `${year}-${month}-${day}`;
return formattedDate
}