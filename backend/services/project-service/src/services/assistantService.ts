import OpenAI from 'openai';
import { config } from '../config';
import { ThreadResponseDTO, MessageCreateDTO, MessageResponseDTO } from '../types/assistant.types';
import { FunctionToolCall, MessageCreationStepDetails, RunStep, ToolCallsStepDetails } from 'openai/resources/beta/threads/runs/steps';
import { TextContentBlock } from 'openai/resources/beta/threads/messages';
import { createProject } from './projectService';
import { ProjectCreateDTO } from 'src/types/project.types';

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY
});

export const createThread = async (userId: string): Promise<ThreadResponseDTO> => {
  try {
    const run = await openai.beta.threads.createAndRun({
      assistant_id: config.OPENAI_ASSISTANT_ID
    });

    const message = await handleRunResponse(run.thread_id, run.id, userId);

    return {
      threadId: run.thread_id,
      content: message.content
    };
  } catch (error) {
    console.error('Error creando thread:', error);
    throw new Error('Error al crear el thread de OpenAI');
  }
};

export const processMessage = async (data: MessageCreateDTO): Promise<MessageResponseDTO> => {
  try {
    // Crear el mensaje en el thread
    await openai.beta.threads.messages.create(data.threadId, {
      role: 'user',
      content: data.message
    });

    // Ejecutar el asistente
    const run = await openai.beta.threads.runs.create(data.threadId, {
      assistant_id: config.OPENAI_ASSISTANT_ID
    });

    return await handleRunResponse(data.threadId, run.id, data.userId);
  } catch (error) {
    console.error('Error procesando mensaje:', error);
    throw new Error('Error al procesar el mensaje con OpenAI');
  }
};

const handleRunResponse = async (threadId: string, runId: string, userId: string, isComplete: boolean = false): Promise<MessageResponseDTO> => {
  // Esperar la respuesta del asistente
  let runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
    
  while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
  }
  
  const steps = await openai.beta.threads.runs.steps.list(threadId, runId);
  const lastStep = steps.data[0]; 

  if (lastStep.type === 'tool_calls') {
    return await handleToolCallResponse(lastStep, userId);
  }
  else {
    return handleMessageResponse(lastStep, isComplete);
  }
};

const handleToolCallResponse = async (step: RunStep, userId: string): Promise<MessageResponseDTO> => {
  const toolCallDetails = step.step_details as ToolCallsStepDetails;
  const lastToolCall = toolCallDetails.tool_calls[0] as FunctionToolCall;
  if (lastToolCall.function.name == 'CreateProject') {
    const projectData = JSON.parse(lastToolCall.function.arguments) as ProjectCreateDTO;
    const project = await createProject({...projectData, clientId: userId});
    if(project) {
      const run = await openai.beta.threads.runs.submitToolOutputsAndPoll(
        step.thread_id,
        step.run_id,
        { tool_outputs: [{ tool_call_id: lastToolCall.id, output: JSON.stringify(project) }] },
      )

      return await handleRunResponse(run.thread_id, run.id, userId, true);
    }
    
    throw new Error('Error al crear el proyecto');
  }

  throw new Error('Error al procesar la llamada a la función');
}

const handleMessageResponse = async (step: RunStep, isComplete: boolean = false): Promise<MessageResponseDTO> => {
  let messageId = (step.step_details as MessageCreationStepDetails).message_creation.message_id;
  const message = await openai.beta.threads.messages.retrieve(step.thread_id, messageId);
  return {
    content: (message.content[0] as TextContentBlock).text.value,
    isComplete: isComplete
  };
}
