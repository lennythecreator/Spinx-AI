"use client";
import React from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useChat } from 'ai/react';
import JobCard from '@/components/ui/JobCard';
import axios from 'axios'; // Import axios for making HTTP requests
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faPaperPlane, faRobot, faUser } from '@fortawesome/free-solid-svg-icons';
import {ToolInvocation} from 'ai';
import Link from 'next/link';

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
        <header className='flex flex-row items-center p-4 border-b'>
        <Link className="flex items-center justify-center" href="#"> 
          
          <span className=" flex gap-2 items-center ml-2 text-2xl font-bold text-primary sm:flex-row"> <Image src='/lion_head_silhouette_ByzJz.svg'
          height={30} width={30} alt="lion head silhouette"
          /> Spinx-AI</span>
        </Link>
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
              <div key={m.id} className={`whitespace-pre-wrap my-2 shadow-sm border ${m.role === 'user' ? 'bg-white-100' : 'bg-slate-200'} rounded-xl p-4`}>
                {m.role === 'user' ? (
                  <>
                    <FontAwesomeIcon icon={faUser} className='mr-2' />
                    {m.content}
                  </>
                ) : (
                  <>
                    {/* <FontAwesomeIcon icon={faRobot} className='mr-2' /> */}
                    <div className='flex mb-2'>
                      <Image src='/lion_head_silhouette_ByzJz.svg'
            height={25} width={25} alt="lion head silhouette"
            className='mr-2 mb-auto'/>
                      <span className='mx-2'>{m.content}</span>
                    </div>
                    
                    {m.toolInvocations && m.toolInvocations[0] && m.toolInvocations[0].result && (
                      <>
                         <span>{m.toolInvocations[0].result.message}</span>
                         <a href={m.toolInvocations[0].result.link} target='_blank' className='w-28 p-4 bg-slate-900 rounded-md mr-2 text-white font-semibold block'>Apply</a>
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
              className=" mt-2 h-11 mx-auto w-[60vw] p-1  border border-gray-300 rounded shadow-xl outline-none "
              value={input}
              placeholder="Say something..."
              onChange={handleInputChange}
            />
          <Button onClick={handleSubmit} className='hover:bg-slate-500 my-auto'><FontAwesomeIcon icon={faPaperPlane} className='hover:text-gray-900'/></Button>
        </form>
    </div>
  )
}
