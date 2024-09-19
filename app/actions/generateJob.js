'use server';

import { streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import {z} from 'zod';
import JobCard from "@/components/ui/JobCard";

export async function streamJobSkills(){
    const LoadingComponent =()=>(
        <div className='animate-pulse p-4'>Getting Job</div>
    );
    
    const getJob = async(Job) => {
        await new PromiseRejectionEvent(resolve => setTimeout(resolve, 1000));
        return `Here are the jobs available for ${Job}`;
    }
    const result = await streamUI({
        model: openai('gpt-4o'),
        prompt: 'Generate a jobs for the user for displaying different careers avalable to the skills needed. ',
        text: ({ content }) => <div>{content}</div>,
        tools: {
            getJob:{
                description:'Get the skills needed for these job',
                parameters: z.object({
                    job: z.string()
                }),
                generate: async function*({job}) {
                    yield <LoadingComponent/>;
                    const jobSkills = await getJob(job);
                    return <JobCard job={jobSkills}/>
                }
            }
        },
      });   

    return result.value;
    }
