
import { streamUI } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';
import { tool } from 'ai';
import { z } from 'zod';

const { getJson } = require("serpapi");


//grab job data from the api
const getJobData = async (job) => {
  const apiKey = process.env.NEXT_PUBLIC_SERP_API_KEY;
  if (!apiKey) {
    throw new Error('API key is not available');
  }
  return new Promise((resolve, reject) => {
    getJson({
      engine: "google_jobs",
      q: job,
      hl: "en",
      api_key: apiKey,
    }, (json) => {
      if (json.error) {
        reject(json.error);
      } else {
        const jobResults = json["jobs_results"];
        if (jobResults && jobResults.length > 0) {
          resolve(jobResults[0]); // Return only the first result
        } else {
          resolve(null); // No jobs found
        }
      }
    });
  });
};

const getYearlySalary = async (job) => {
  getJson({
    engine: "google_jobs_listing",
    q: "eyJqb2JfdGl0bGUiOiJCYXJpc3RhIiwiaHRpZG9jaWQiOiJ5Vy1laV9FQ3Y3Z0FBQUFBQUFBQUFBPT0iLCJnbCI6InVzIiwiaGwiOiJlbiIsImZjIjoiRXZjQkNyY0JRVUYwVm14aVJETmtXVmxsYm5SNVNqZFVNM3BEVkd0d1drcFdZVXRzTTNOQmFIaHVPVEpXWWsxbGVsRldiMGxYVjBWdUxVdzNYMlF5V0VKTVpEaDRMVkZ6Umtwek5qSklaRkJtVTJReU5FbGxZa0ZDWnpCemVUY3lYemc1UkU5blNIWlpRVnBRU1doMFJHMXljRk50VkhCemJsOUxjbUprYURKNU4ybE5hMmt5Vmpkc2RuUmpORnB3VkcwemEzUmFTV3RZYWxGcmFHRjJkek0yTVcxeGNGbGliM2xCWmtveVl6ZDJRMTlrYTB0alYzQkpjbVZ2RWhkSVNHVnNXVFpFY2toTU1tOXhkSE5RYms1MVIzRkJaeG9pUVVSVmVVVkhaV2xpVmxaaVgxRnRkbXRrVmpaVWQxVnVhbWsxYW5KT2QyaE9adyIsImZjdiI6IjMiLCJmY19pZCI6ImZjXzEiLCJhcHBseV9saW5rIjp7InRpdGxlIjoiLm5GZzJlYntmb250LXdlaWdodDo1MDB9LkJpNkRkY3tmb250LXdlaWdodDo1MDB9QXBwbHkgZGlyZWN0bHkgb24gSW5kZWVkIiwibGluayI6Imh0dHBzOi8vd3d3LmluZGVlZC5jb20vdmlld2pvYj9qaz03ZTA0YWYyNmIyZGE2NjljXHUwMDI2dXRtX2NhbXBhaWduPWdvb2dsZV9qb2JzX2FwcGx5XHUwMDI2dXRtX3NvdXJjZT1nb29nbGVfam9ic19hcHBseVx1MDAyNnV0bV9tZWRpdW09b3JnYW5pYyJ9fQ",
    api_key: "82a7c06e9d00810bdf8bf10f355f8788378b958eae5ce1fb476d4a1725478970"
  }, (json) => {
    if (json.error) {
      reject(json.error);
    }else{
      const payResults = json["salaries"];
      if (payResults && payResults.length > 0) {
        resolve(payResults[1]); // Return only the first result
      } else {
        resolve(null); // No jobs found
      }

    }
    console.log(json["salaries"]);
  });
}
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req) {
  // const {setLink} = useLink();
  // const [link,setLink] = useState('');
try{
    const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages: convertToCoreMessages(messages),
    system: 'You are a conversational AI assistant Spinx, meant to help students navigate their careers and majors. You can answer questions about majors, careers, and the job market. You can also provide advice on how to succeed in college and the workforce. Another one of your features is the ability to generate a road map showing users the skills and tools they need to learn for a particualr career. Do not answer anything unrelated to these topics. Don\'t give super lenghty responses, keep it short and sweet. avoid using \'*\' in your responses. return any links you find in a way that the user can click on them.',
    temperature: 0.8,
    tools:{// client-side tool that starts user interaction:
        askForConfirmation: {
          description: 'Ask the user for confirmation.',
          parameters: z.object({
            message: z.string().describe('The message to ask for confirmation.'),
          }),
        },
        // server-side tool that searches for jobs:
        searchJob: {
          description: 'Search for jobs based on a query and give information about the title, location and summarize to 2 sentences job description.',
          parameters: z.object({
            job: z.string().describe('The job title or keywords to search for.'),
          }),
          execute: async ({ job }) => {
            console.log(`Searching for job: ${job}`);
            try {
              const jobData = await getJobData(job);
              //console.log(`Job data: ${JSON.stringify(jobData)}`);
              // console.log(`Job url: ${JSON.stringify(jobData.share_link)}`);
              if (jobData) {
                // setLink(jobData.apply_options[0].link);
                return {
                  message: `Job found ${jobData.title} at ${jobData.location} with description: ${jobData.description} \n`,
                  link: jobData.apply_options[0].link,
                };
              } else {
                return { message: 'No jobs found' };
              }
            } catch (error) {
              console.error(`Error fetching job data: ${error}`);
              throw new Error('Failed to fetch job data');
            }
          },
        },
        findJobSalary:{
          description: 'Find the average salary for a job',
          parameters: z.object({
            job: z.string().describe('The job title or keywords to search for.'),
          }),
          execute: async ({ job }) => {
            console.log(`Searching for job: ${job}`);
            try {
              const salaryData = await getYearlySalary(job);
              if (salaryData) {
                return {
                  message: `The average salary for ${job} is ${salaryData.salary_from} to ${salaryData.salary_to} based on ${salaryData.source} \n`,
                };
              } else {
                return { message: 'No salary data found' };
              }
            } catch (error) {
              console.error(`Error fetching salary data: ${error}`);
              throw new Error('Failed to fetch salary data');
            }
          },
        },
      }
  });

  if (result.toolResults && result.toolCalls) {
    const searchJobResult = result.toolResults.searchJob;
    const findJobSalaryResult = result.toolResults.findJobSalary;
    if (searchJobResult && searchJobResult.message) {
      console.log(`Tool results: ${JSON.stringify(searchJobResult.message)}`);
      const jobResult = await streamText({
        model: openai('gpt-4-turbo'),
        system: `Show this job to the user: ${searchJobResult.message}`,
      });
      return jobResult.toDataStreamResponse();
    } else if ( findJobSalaryResult && findJobSalaryResult.message){
      console.log(`Tool results: ${JSON.stringify(findJobSalaryResult.message)}`);
      const salaryResult = await streamText({
        model: openai('gpt-4-turbo'),
        system: `Show this salary to the user: ${findJobSalaryResult.message}`,
      });
      console.error('searchJobResult or searchJobResult.message is undefined');
    } else {
      console.error('searchJobResult or searchJobResult.message is undefined');
    }

  }

  return result.toDataStreamResponse();
}catch (error) {
    console.error('Error in POST /api/chat:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
}