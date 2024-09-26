"use client";
import React from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useChat } from 'ai/react';
import { useState,useRef } from 'react';
import JobCard from '@/components/ui/JobCard';
import axios from 'axios'; // Import axios for making HTTP requests
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faPaperPlane, faRobot, faUser,faPlus } from '@fortawesome/free-solid-svg-icons';
import {ToolInvocation} from 'ai';
import Link from 'next/link';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';


export default function Page() {
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
  const { messages, input, stop, isLoading, setMessages, handleInputChange, handleSubmit } = useChat()
  const handleDelete = (id) => {
    setMessages(messages.filter(message => message.id !== id));
  };
  
  const handleFormSubmit = (event) => {
      event.preventDefault();

      // Prepare experimental attachments if images are present
      const experimental_attachments = images.map((imageUrl, index) => ({
          url: imageUrl,
          contentType: 'image/png',
          name: `page-${index + 1}.png`,
      }));

      // Check if there is text input or images to send
      if (!input.trim() && experimental_attachments.length === 0) {
          console.error('No input or images to send to the model.');
          return;
      }

      // Send the message and attachments
      handleSubmit(event, {
          experimental_attachments,
          text: input.trim(), // Send the text input
      });

      // Clear images and input after submission
      setImages([]);
      if (fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = async () => {
        const typedArray = new Uint8Array(fileReader.result);
        try {
          const pdf = await getDocument(typedArray).promise;

          const newImages = [];
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport }).promise;

            const imageUrl = canvas.toDataURL(); // Convert the page to an image
            newImages.push(imageUrl); // Store the image URL
          }

          setImages(newImages); // Update state with the new image URLs
        } catch (error) {
          console.error('Error processing PDF:', error);
        }
      };

      fileReader.onerror = () => {
        console.error('Error reading file:', fileReader.error);
      };
    } else {
      console.error('Please upload a valid PDF file.');
    }
  };
  function capitalizeEachWord(text) {
    if (!text) return text;
    return text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  console.log(messages)
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
                      <span className='mx-2'>{m.content}{m.toolInvocations[0].result}</span>
                    </div>
                    
                    {m.toolInvocations && m.toolInvocations[0] && m.toolInvocations[0].result && (
                      <>
                          {m.toolInvocations[0].result?.salary && (
                            <div className='p-4 bg-slate-50 rounded-xl my-1'>
                              <h1 className='text-lg font-semibold border-b py-2'>{capitalizeEachWord(m.toolInvocations[0].result.title)}</h1>
                              <p className='py-2'>{m.toolInvocations[0].result.source}</p>
                              <span>{m.toolInvocations[0].result.message}</span>
                            </div>
                          )}
                         
                         {m.toolInvocations[0].result?.link && (
                            <a 
                              href={m.toolInvocations[0].result.link} 
                              target='_blank' 
                              className='w-28 p-3 bg-slate-900 rounded-md mr-2 text-white text-center mx-2 cursor-pointer font-semibold block'
                            >
                              Apply
                            </a>
                          )}
                        
                        {m.toolInvocations[0].result?.videoId && (
                          <>
                            <div className='p-4 bg-white rounded-xl my-3 w-[550px]'>
                              <h1 className='text-xl font-medium my-3 border-b'>{m.toolInvocations[0].result.title}</h1>
                              <iframe
                              className='w-full'
                              height="315"
                              src={`https://www.youtube.com/embed/${m.toolInvocations[0].result.videoId}`}
                              title="YouTube Video"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                            </div>
                          </>
                          
                        )}
                        
                         
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
        <form  onSubmit={handleFormSubmit} className=' flex  p-3 w-[80vw] mx-auto h-24 bg-muted items-center border rounded-t-xl sm:w-[60vw] gap-4'>
        <input
          type="file"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
          accept="application/pdf"
          id='imgInput'
        />
      
        <div className="relative flex items-center w-full">
          <label className='flex items-center' htmlFor='imgInput'><FontAwesomeIcon icon={faPlus} className="absolute left-2 text-gray-500" /></label>
          <input
            className=" flex items-center my-auto h-11 mx-auto w-full p-1 border border-gray-300 rounded shadow-xl outline-none pl-10"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
        </div>
          <Button onClick={handleFormSubmit} className='hover:bg-slate-500 my-auto'><FontAwesomeIcon icon={faPaperPlane} className='hover:text-gray-900'/></Button>
        </form>
    </div>
  )
}
