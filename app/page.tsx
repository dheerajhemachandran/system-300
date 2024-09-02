'use client'
import { useEffect, useState } from "react";
import { Auth } from "./context/AuthContext";
import { useRouter } from "next/navigation";
import { createProfile, getTask, submitDailyTask } from "./utils/services";
import CountdownTimer from "./component/countDown";

export default function Home() {
  const { user } = Auth();
  const router = useRouter()
  const [tasks, settasks] = useState<any>(null)
  const [showpopup, setshowpopup] = useState(false)
  const [loading, setloading] = useState(false)


  const loadingCell=[]

  for (let i = 0; i < 7; i++) {
    loadingCell.push(<div className="w-100 bg-slate-700 animate-pulse h-20 p-2 flex gap-2 items-stretch cursor-pointer rounded-sm" key={i}></div>);
  }

  const handleClick=(index:number)=>{
    console.log(tasks.tasks[index])
    if(!tasks.tasks.submitted)
    {
      const tempTask={... tasks}
      tempTask.tasks[index].completed=!tempTask.tasks[index].completed
      settasks(tempTask)
    }
  }

  const handleSubmit=()=>{
    setshowpopup(false)
    setloading(true)
    if(user){
      submitDailyTask(user?.uid,tasks).then(()=>{
        setloading(false)
        getTask(user.uid).then((response:any)=>{
          settasks(response)
        })
      })
    }
  }

  useEffect(()=>{
    if(user){
      getTask(user.uid).then((response:any)=>{
          if(!response){
            createProfile(user.uid).then(()=>{
              getTask(user.uid).then((response:any)=>{
                settasks(response)
              })
            })
          }
          else{
            settasks(response)
          }
      })
      }
  },[user,router])


  if (!user) return null;

  return (
      <div className="my-2 md:my-5 lg:my-10">
      <div className="flex justify-center md:text-xl lg:text-2xl mb-1">
          <div className="border-b-2 pb-1">Daily Quest</div>
        </div>
      {tasks? 
      <>
      <CountdownTimer/>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 md:mb-10">
          {tasks.tasks.map((task:any,index:number)=>{
            return(
              <div className="w-100 bg-gray-900/50 hover:bg-gray-700/50 min-h-20 p-2 flex gap-2 items-stretch cursor-pointer rounded-sm" onClick={()=>handleClick(index)} key={task.name}>
                {task.completed?
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-sky-400 ">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  :
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-sky-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>                     
                }
                <div className="leading-none grow flex flex-col justify-between">
                  <div className="mb-2">
                    <div className={`text-sky-400 font-bold mb-1 ${task.completed && 'line-through'}`}>{task.name}</div>
                    <small className={`${task.completed && 'line-through'}`}>{task.description}</small>
                  </div>
                  <div className="text-end text-xs">
                    {!task.completed && task.stats.map((stat:string)=>{
                      return(
                        <span className={`ms-2 ${getColor(stat)} lowercase`} key={stat}>
                          {stat}+
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </>
      :
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-2 mb-5 md:mb-10">
        {loadingCell}
      </div>
      }
      {tasks && <div className="flex justify-center">
          {(!tasks.submitted)?<button className="px-3 py-1 font-bold bg-sky-500 hover:bg-sky-600 disabled:opacity-75 rounded" disabled={!tasks} onClick={()=>setshowpopup(true)}>{loading?'Submitting':'Submit'}</button>:<div className="text-sky-400">*Task already submitted for today</div>}
      </div>}
      {showpopup && <div className="absolute flex justify-center items-center top-0 left-0 h-screen w-screen bg-gray-900/75">
      <div className="border-2 border-sky-400 p-5">
        <div className="text-center text-xl mb-2">Are you sure you want to sumbit?</div>
        {tasks && tasks.tasks.map((task:any)=>{
          return (
          <div className="flex justify-between px-4" key={task.name}>
            <span className={`${!task.completed && 'line-through text-red-400'}`}>
              {task.name}
            </span>
            {task.completed && <span>✔️</span>}
          </div>)
        })}
        <div className="flex justify-center mt-4">
          <button className="px-3 py-1 font-bold bg-red-500 hover:bg-red-600 disabled:opacity-75 rounded me-2" onClick={()=>setshowpopup(false)}>Cancel</button>
          <button className="px-3 py-1 font-bold bg-green-500 hover:bg-green-600 disabled:opacity-25 rounded" onClick={handleSubmit} disabled={loading}>{loading?'Submitting':'Submit'}</button>
        </div>
        </div>
      </div>}
      </div>
  )
}


const getColor=(stat:string)=>{
  switch (stat) {
    case 'Health':
      return 'text-green-400'
    case 'Intellect':
      return 'text-purple-400'
    case 'Spirit':
      return 'text-yellow-400'
  
    default:
      break;
  }
}