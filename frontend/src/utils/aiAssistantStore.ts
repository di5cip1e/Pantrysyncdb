import { create } from "zustand";

type AssistantStatus = "idle" | "listening" | "processing" | "speaking";

interface AIAssistantState {
  status: AssistantStatus;
  isMicOn: boolean;
  transcript: string;
  response: string;
  setStatus: (status: AssistantStatus) => void;
  toggleMic: () => void;
  setTranscript: (transcript: string) => void;
  setResponse: (response: string) => void;
  reset: () => void;
}

export const useAIAssistantStore = create<AIAssistantState>((set) => ({
  status: "idle",
  isMicOn: false,
  transcript: "",
  response: "",
  setStatus: (status) => set({ status }),
  toggleMic: () => set((state) => ({ isMicOn: !state.isMicOn })),
  setTranscript: (transcript) => set({ transcript }),
  setResponse: (response) => set({ response }),
  reset: () => set({ status: "idle", transcript: "", response: "" }),
}));
