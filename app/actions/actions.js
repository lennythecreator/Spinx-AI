import JobCard from "@/components/ui/JobCard";
import { getMutableAIState, streamUI } from "ai/rsc/dist";
const { getJson } = require("serpapi");

const getJobData = async (job) => {
    return new Promise((resolve, reject) => {
      getJson({
        engine: "google_jobs",
        q: job,
        hl: "en",
        api_key: "82a7c06e9d00810bdf8bf10f355f8788378b958eae5ce1fb476d4a1725478970"
      }, (json) => {
        if (json.error) {
          reject(json.error);
        } else {
          resolve(json["jobs_results"]);
        }
      });
    });
  };

export async function continueConveration(input){
    "use server";

    const history = getMutableAIState();
    const result = await streamUI({
        model: 'gpt-4-turbo',
        messages: [...history, {role: 'user', content: input}],
        text:({content, done})=>{
            if (done){
                history.done((messages)=>[
                    ...messages,
                    {role: 'assistant', content}
                ]);
            }
            return <div>{content}</div>;
        },
        tools:{
           findJob:{
            description:'Search for jobs based on a query.',
            parameters: z.object({
                job: z.string().describe('The job title or keywords to search for.'),
            }),
            generate: async function* ({job}) {
                yield <div>Loading Job...</div>;
                const jobData = await getJobData(job);
                return <JobCard job={jobData[0]} />;
            }
           } 
        }
        
    });

    return {
        id: nanoid(),
        role: "assistant",
        display: result.value,
      };
}

export const AI = createAI({
    actions: {
      continueConversation,
    },
    initialAIState: [],
    initialUIState: [],
  });