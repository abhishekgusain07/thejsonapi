import { genAI} from "@/lib/gemini";
import { exec } from "child_process";
import { NextRequest, NextResponse } from "next/server";
import { ZodTypeAny, z } from "zod";
import { EXAMPLE_ANSWER, EXAMPLE_PROMPT } from "./example";

const determineSchemaType = (schema: any) => {
    if(!schema.hasOwnProperty("type")){
        if(Array.isArray(schema)) {
            return "array"
        }else {
            return typeof schema;
        }
    }
    return schema.type
}
const jsonSchemaToZod = (schema: any): ZodTypeAny=> {
    const type = determineSchemaType(schema)
    switch(type) {
        case "string":
            return z.string().nullable()
        case "number":
            return z.number().nullable()
        case "boolean":
            return z.boolean().nullable()
        case "array":
            return z.array(jsonSchemaToZod(schema.items)).nullable()
        case "object":
            const shape: Record<string, ZodTypeAny> ={}
            for (const key in schema) {
                if(key !== "type") {
                    shape[key] = jsonSchemaToZod(schema[key])
                }
            }
            return z.object(shape)
        default:
            throw new Error(`Unsupported data type ${type}`)
    }
}

type PromiseExecutor<T>= (
    resolve: (value: T) => void,
    reject: (reason?: any) => void
) => void;
class RetryablePromise<T> extends Promise<T> {
    static async retry<T>(
        retries: number,
        executor: PromiseExecutor<T>
    ): Promise<T>{
        return new RetryablePromise(executor).catch((error) => {
            console.error(`Retrying due to error: ${error}`);

            return retries > 0 ? RetryablePromise.retry(retries-1, executor) : RetryablePromise.reject()
        })
    }
}
type InputType = {
    [key: string]: {
      type: string;
      value?: any;
    };
  };
  
  type TransformedType = {
    [key: string]: any;
  };
  
  const transformObject = (input: InputType): TransformedType => {
    const result: TransformedType = {};
  
    for (const key in input) {
      if (input[key].type === 'null') {
        result[key] = null;
      } else {
        result[key] = input[key].value;
      }
    }
  
    return result; // Return the result object
  };
export const POST = async(req: NextRequest) => {
    const body = await req.json();

    //validation incoming data format using zod
    //and the format we want to send the data back again
    const genericSchema = z.object({
        data: z.string(),
        format: z.object({}).passthrough()

    })
    const {data, format} = genericSchema.parse(body);
    
    //creating a schema from the expected user format
    const dynamicSchema = jsonSchemaToZod(format);


    //retry mechanism
    

    const validationResult =  await RetryablePromise.retry<object>(5, async(resolve, reject) => {
        try{
            //cal lAI
            const content = `DATA: \n"${data}"\n\n-----------\nExpected JSON format: 
            ${JSON.stringify(format,null,2)}
            \n\n-----------\nValid JSON output in expected format:`
            const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"})
            const prompt = `You are an AI that converts data into the attached JSON format. You respond with nothing but valid JSON based on the input data. Your output should DIRECTLY be valid JSON, nothing added before and after. You will begin with the opening curly brace and end with the closing curly Braces. Only if you absolutely cannot dtermine a field, use the value null
            now here's the question ${content} give the answer as I told you`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            // console.log(typeof response.candidates?.[0].content
            console.log(typeof response.candidates?.[0].content.parts[0].text, response.candidates?.[0].content.parts[0].text)
            const jsonString = response.candidates?.[0].content.parts[0].text!
            // 
            const idk = JSON.parse(jsonString)
            const finalResult = transformObject(idk)

            // console.log(text)

            const validationResult = dynamicSchema.parse(finalResult)
            return resolve(validationResult)
        } catch(err) {
            reject(err)
        }
    })
    //console.log("res", res)
    return NextResponse.json(validationResult)
}