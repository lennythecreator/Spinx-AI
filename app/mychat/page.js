"use client";
import React from 'react'
import { Button } from '@/components/ui/button';
import { useChat } from 'ai/react';
import JobCard from '@/components/ui/JobCard';
import axios from 'axios'; // Import axios for making HTTP requests
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faPaperPlane, faRobot, faUser } from '@fortawesome/free-solid-svg-icons';
import {ToolInvocation} from 'ai';
import Link from 'next/link';
// ok
// import { useLink } from '../customHooks';
// export const JobButton = ()=>{
//   const {link} = useLink();
//   console.log(link);
//   return(
//     <a href={link}>Apply here</a>
//   )
// }
export default function Page() {
  const { messages, input, stop, isLoading, setMessages, handleInputChange, handleSubmit } = useChat()
  const handleDelete = (id) => {
    setMessages(messages.filter(message => message.id !== id));
  };
  console.log(messages);
  useChat({
    onToolCall: async ({toolCall}) => {
      if (toolCall.tool === 'jobSearch') {
        return <JobCard job={toolCall.parameters.job} />;
      }
    }
  });
  

  return (
    <div className='flex flex-col h-full'>
        <header className='flex flex-row items-center p-4'>
          <h1 className='font-semibold text-xl'>🦁 Spinx</h1>
          <nav className='ml-auto '>
            <ul className='flex flex-row gap-4'>
              <li><a href="/">Home</a></li>
              <li><a href="/Chat">Chat</a></li>
              <li><a href="/about">Leave a review!</a></li>
            </ul>
          </nav>
        </header>
        <div className='flex flex-col h-full w-[70vw] overflow-y-auto mx-auto'>
          {messages.map(m => (
              <div key={m.id} className={`whitespace-pre-wrap my-2 shadow-sm border ${m.role === 'user' ? 'bg-white-100' : 'bg-slate-300'} rounded-xl p-4`}>
                {m.role === 'user' ? (
                  <>
                    <FontAwesomeIcon icon={faUser} className='mr-2' />
                    {m.content}
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faRobot} className='mr-2' />
                    <span className='mx-2'>{m.content}</span>
                    {m.toolInvocations && m.toolInvocations[0] && m.toolInvocations[0].result && (
                      <>
                         <span>{m.toolInvocations[0].result.message}</span>
                         <a href={m.toolInvocations[0].result.link} target='_blank' className='p-2 bg-slate-900 rounded-md mr-2 text-white font-semibold'>Apply</a>
                         {/* <JobButton/> */}
                      </>
                     
                  
                )}
                    <Button variant="outline" size="icon" className='ml-auto' onClick={() => handleDelete(m.id)}><FontAwesomeIcon icon={faClose} className='h-4 w-4' /></Button>
                  </>
                )}
              </div>
            ))}
            {isLoading && (
              <Button variant="desturctive" onClick={() => stop()} className='bg-red-600 w-24 text-white mx-auto'>
                Stop
              </Button>
            )} 
        </div>
        <form  onSubmit={handleSubmit} className=' flex  p-3 w-[80vw] mx-auto h-24 bg-muted items-center border rounded-t-xl sm:w-[60vw] gap-4'>
          <input
              className=" mt-2 h-11 mx-auto w-[60vw] p-1 border border-gray-300 rounded shadow-xl"
              value={input}
              placeholder="Say something..."
              onChange={handleInputChange}
            />
          <Button onClick={handleSubmit} className='hover:bg-slate-500 my-auto'><FontAwesomeIcon icon={faPaperPlane} className='hover:text-gray-900'/></Button>
        </form>
    </div>
  )
}
