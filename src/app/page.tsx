"use client" // this is a client component 👈🏽

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bars3Icon, MicrophoneIcon } from "@heroicons/react/24/outline"
import { MicrophoneIcon as MicroPhoneSolidIcon } from "@heroicons/react/24/solid"
import { useAudioRecorder } from "react-audio-voice-recorder"

import MermaidChart from "@/components/mermaid-chart"
import useSession from "@/hooks/useSession"
import { API_BASE_URL } from "@/config"

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isLoggedIn, session, logout } = useSession()
  const [currentChart, setCurrentChart] = useState<string>("pie")
  const [currentJSONSchema, setCurrentJSONSchema] = useState<string>("")
  const [prompt, setPrompt] = useState<string>("")
  const [previousPrompts, setPreviousPrompts] = useState<string[]>([])
  const router = useRouter()

  const options = ["Piechart", "Flowchart"]

  const { startRecording, stopRecording, recordingBlob, isRecording } =
    useAudioRecorder()

  const getTranscript = async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/transcribe/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session}`,
      },
      body: formData,
    })

    const data = await response.json()
    console.log("data: ", data)
    setPrompt(data.transcript.text)
  }

  const handleLogoutClick = () => {
    router.push("/login")
    logout()
  }

  useEffect(() => {
    if (!recordingBlob) return

    // Call the Transcript API
    const formData = new FormData()
    const mp3Blob = new Blob([recordingBlob], { type: "audio/mp3" })
    console.log("mp3Blob: ", mp3Blob)
    formData.append("file", mp3Blob, "audio.mp3")
    console.log("formData: ", formData)
    getTranscript(formData)
    // recordingBlob will be present at this point after 'stopRecording' has been called
  }, [recordingBlob])

  const handleRecordButtonClick = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const handlePromptSubmitClick = async () => {
    console.log("prompt: ", prompt)

    // Call the Prompt API
    const response = await fetch(`${API_BASE_URL}/piechart/schema`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${session}`,
      },
      body: JSON.stringify({
        prompt,
        latest_schema: currentJSONSchema,
      }),
    })

    if (response.ok) {
      const response_json = await response.json()
      const data = response_json.data
      setCurrentChart(data.schema)
      setCurrentJSONSchema(data.json)
      setPreviousPrompts((previousPrompts) => [...previousPrompts, prompt])
      setPrompt("")
    }
  }

  return (
    <main className="flex flex-col items-end justify-end min-h-screen p-8 bg-white">
      <header className="absolute inset-x-0 top-0 z-50 shadow-lg">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <h3 className="text-xl font-bold text-black">🦾 flowbolo</h3>
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <button
              onClick={() => handleLogoutClick()}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Log out <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </nav>
      </header>
      <div className="flex w-full py-16 bg-white sm:py-24 lg:py-32">
        <div className="flex items-center justify-center w-2/3">
          <MermaidChart chart={currentChart} />
        </div>
        <div className="w-1/3 px-6 mx-auto lg:px-8">
          <div className="max-w-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            <h2 className="inline text-2xl sm:block">Create your chart</h2>{" "}
            <p className="inline sm:block"></p>
          </div>
          <div className="mt-8">
            <label
              htmlFor="location"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Type of chart
            </label>
            <select
              id="location"
              name="location"
              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              defaultValue="Canada"
            >
              {options.map((option, index) => (
                <option key={index}>{option}</option>
              ))}
            </select>
          </div>
          {previousPrompts.map((prompt, index) => (
            <div
              key={index}
              className="relative flex items-center px-6 py-5 mt-10 space-x-3 bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
            >
              <div className="flex-shrink-0">
                <img
                  className="w-10 h-10 rounded-full"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </div>
              <div className="flex-1 min-w-0">
                <a href="#" className="focus:outline-none">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="text-sm font-medium text-gray-900">
                    Amelia Harper
                  </p>
                  <p className="text-sm text-gray-500">{prompt}</p>
                </a>
              </div>
            </div>
          ))}
          <div className="mt-10">
            <div className="flex gap-x-4">
              <label htmlFor="email-address" className="sr-only">
                Flowchart description
              </label>
              <input
                id="prompt"
                name="prompt"
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
                className="flex-auto min-w-0 px-5 py-3 text-gray-900 border-0 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Describe your flowchart"
              />
              <button
                onClick={handleRecordButtonClick}
                className="px-4 py-2 text-gray-900 border border-gray-200 rounded"
              >
                {isRecording ? (
                  <MicroPhoneSolidIcon className="w-6 h-6 text-red-500" />
                ) : (
                  <MicrophoneIcon className="w-6 h-6" />
                )}
              </button>
            </div>
            <div className="w-full mt-4">
              <button
                onClick={handlePromptSubmitClick}
                className="w-full flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
