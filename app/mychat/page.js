'use client';
import React from 'react'

import { Button } from '@/components/ui/button';
import { useChat } from 'ai/react';
import { useState, useEffect, useRef} from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faRobot, faUser } from '@fortawesome/free-solid-svg-icons';

export default function Page() {
  const { messages, input, stop, isLoading, setMessages, handleInputChange, handleSubmit } = useChat()
  const handleDelete = (id) => {
    setMessages(messages.filter(message => message.id !== id));
  };
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
              <div key={m.id} className={`whitespace-pre-wrap my-2 ${m.role === 'user' ? 'bg-green-500 bg-opacity-50' : 'bg-slate-300'} rounded p-4`}>
                {m.role === 'user' ? (
                  <>
                    <FontAwesomeIcon icon={faUser} className='mr-2' />
                    {m.content}
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faRobot} className='mr-2' />
                    <span className='mx-2'>{m.content}</span>
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
        <form  onSubmit={handleSubmit} className=' flex flex-col h-24 bg-muted'>
          <input
              className=" mt-2 mx-auto w-[70vw] p-2 border border-gray-300 rounded shadow-xl"
              value={input}
              placeholder="Say something..."
              onChange={handleInputChange}
            />
        </form>
    </div>
  )
}
