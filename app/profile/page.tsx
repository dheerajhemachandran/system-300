'use client'
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getProfile, updateReward } from "../utils/services";
import { getAuth, signOut } from "firebase/auth";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter()
  const [userInfo,setuserInfo] = useState<any>(null)
  const [stats,setstats] = useState<any>(null)
  const [history,sethistory] = useState<any>(null)
  const [rewards,setrewards] = useState<any>(null)
  const [showhistory,setshowhistory]=useState<{[key: string]: { show: boolean; value: any }}>({})
 


  const getBGcolor=(tasks:any):string=>{
    let completed=true
    tasks.map((task:any)=>{
      if(task.completed===false)
        completed=false
    })
    if(completed)
      return 'bg-green-400/50'
    else
    return 'bg-gray-900/50'
  }

  const logout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log("User signed out successfully.");
      router.push('/login')
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  useEffect(()=>{
    if(user){
      setuserInfo(user)
      getProfile(user.uid).then((response)=>{
        // console.log(response)
        response.map((res:any)=>{
          if(res.id==='stats')
            setstats(res)
          if(res.id==='history'){
            sethistory(res)
            console.log(history,res)

            Object.entries(res.history).map(([key,value])=>{
              setshowhistory((prevState) => ({
                ...prevState,
                [key]: {
                  show: false,
                  value
                }
              }));
            })

            console.log("show",showhistory)
          }
          if(res.id==='rewards')
            setrewards(res)
        })
      })
      // console.log(user)
    }
  },[user,router])

  const handlemouseenter=(key:string)=>{
    let tempvalue={... showhistory}
    tempvalue[key].show=true
    setshowhistory(tempvalue)
  }

  const handlemouseout=(key:string)=>{
    let tempvalue={... showhistory}
    tempvalue[key].show=false
    setshowhistory(tempvalue)
  }

  const claimReward=(index:any)=>{
    const temprewards=rewards
    temprewards.rewards[index].claim-=1
    setrewards((prevstate:any)=>({
      ...prevstate,
      temprewards
    }))
    if(user)
    updateReward(user?.uid,rewards)
  }

  
  // console.log(user)

  if (!user) return null;

  else{ 
    // setdisplayName(user.displayName?user.displayName:'')
    return (
     <div className="my-2 md:my-5 lg:my-10">
      {user && stats ? 
      <div className="md:grid grid-cols-3 gap-3">
        <div className="bg-gray-900/50 flex flex-col justify-center items-center py-5 rounded-md mb-3 md:mb-0">
        {user?.photoURL ? 
                <img src={user.photoURL} className='rounded-full flex justify-center items-center w-20 h-20 mb-2' alt="" />:
                user?.displayName ?
                    <div className='uppercase rounded-full flex justify-center items-center w-20 h-20 mb-2 text-3xl bg-red-700'>
                        {user?.displayName[0]}
                    </div>:
                    user?.email ?
                    <div className='uppercase rounded-full flex justify-center items-center w-20 h-20 mb-2 text-3xl bg-red-700'>
                        {user.email[0]}
                    </div>:
                <div></div>
            }
          <small className="text-slate-200 text-center p-0">{user.email}</small> 
          <div className="text-sky-400 font-bold text-center p-0">{user.displayName}</div>
          {stats && stats.streak>0 && <small className="mb-2">streak: {stats.streak}🔥</small>}
          <div className="flex">
            <button className="bg-red-600 flex items-center gap-2 justify-start rounded hover:bg-red-700 px-3 py-1 mt-4" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
        <div className="col-span-2 bg-gray-900/50 rounded-md p-5 mb-3 md:mb-0">
            <div className="text-xl font-bold text-center mb-2">Stats</div>
            <div className="px-2">
            {stats && stats.stats.map((stat:any)=>{
              return(
                <div key={stat.name}>
                  <div className="leading-none">
                    {stat.name}:
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    <div className="h-1 grow bg-gray-500 rounded-full">
                      <div className={`h-1 ${getColor(stat.name)} rounded-full`} style={{width:`${stat.value/300}%`}}></div>
                    </div>
                    <div className={`${stat.value>0 && getTextColor(stat.name)}`}>
                      {stat.value}
                    </div>
                  </div>
                </div>
              )
            })}
            </div>
            <div className="flex justify-center">
            <small className="text-center text-sky-400">*Missing Cold Shower will reset all stats</small>
            </div>
        </div>
        <div className="col-span-2 bg-gray-900/50 p-5 rounded-lg max-h-[800px] overflow-auto">
          <div className="text-xl text-center mb-5 font-bold">History</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-2">
            {Object.keys(history.history).sort().reverse().map((key)=>{
              return(
                <div className="relative" key={key}>
                   <div key={key} className={`p-2 ${getBGcolor(history.history[key].tasks)} text-center rounded bottom-0 cursor-pointer`} onMouseEnter={()=>handlemouseenter(key)} onMouseLeave={()=>handlemouseout(key)}>
                    {key}
                  </div>
                  {showhistory[key]?.show && <div className="absolute mt-1 bg-blue-700 border-[1px] border-sky-400 px-4 py-3 rounded z-10">
                    {showhistory[key].value.tasks.map((task:any)=>{
                      return(
                        <div key={task.name} className="flex justify-between gap-4 whitespace-nowrap">
                            <div>{task.name}</div>
                            <div>{task.completed?'✔️':'❌'}</div>
                        </div>
                      )
                    })}
                  </div>}
                </div>
              )
            })}                 
          </div>
        </div>
        <div className="py-5 px-2 rounded-lg">
          <div className="text-center text-xl font-bold mb-3">Rewards</div>
          {rewards && rewards.rewards.map((reward:any,index:number)=>{
            return (
            <div className="text-slate-50 bg-gray-900/50 rounded-md px-2 py-3 mb-2" key={reward.name}>
                <div className="text-sky-400 font-bold leading-none inline">{reward.name} - </div>
                <small className="capitalize leading-none inline">
                  {reward.description}
                </small>
                <small className="block text-end"><span className="text-sky-400 justify-self-end">[{reward.requirement.task}]</span> {reward.count}/{reward.requirement.days}</small>
                {/* <small className="capitalize mb-2">
                  {reward.description}
                </small> */}
                <small>*Missing these tasks will reset this reward:</small>
                <ul className="list-disc list-inside ps-3 text-xs">
                  {reward.reset.map((reset:string)=>{
                    return(<li key={reset}>{reset}</li>)
                  })}
                  <li>Cold Shower</li>
                </ul>
                {reward.claim>0 && <div className="flex justify-end mt-1">
                  <button className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs" onClick={()=>claimReward(index)}>Claim {reward.claim}</button>
                </div>}
            </div>
          )
          })}
        </div>
      </div>:
      <div>
        loading
      </div>
      }
     </div>
  );
}
}


const getColor=(stat:string)=>{
  switch (stat) {
    case 'Health':
      return 'bg-green-500'
    case 'Intellect':
      return 'bg-purple-500'
    case 'Spirit':
      return 'bg-yellow-500'
  
    default:
      break;
  }
}
const getTextColor=(stat:string)=>{
  switch (stat) {
    case 'Health':
      return 'text-green-500'
    case 'Intellect':
      return 'text-purple-500'
    case 'Spirit':
      return 'text-yellow-500'
  
    default:
      break;
  }
}

