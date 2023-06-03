"use client"; // this is a client component 👈🏽

import Image from "next/image";
import { useState, useMemo } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import MicRecorder from "mic-recorder-to-mp3";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [audio, setAudio] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [blobURL, setBlobURL] = useState("");
  const [transcript, setTranscript] = useState();
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const recorder = useMemo(() => new MicRecorder({ bitRate: 128 }), []);

  const startRecording = () => {
    if (isBlocked) {
      console.log("Permission Denied");
      setIsBlocked(true);
    } else {
      recorder
        .start()
        .then(() => {
          setIsRecording(true);
        })
        .catch((e: React.ChangeEvent<HTMLInputElement>) => console.error(e));
    }
  };

  const stopRecording = async () => {
    console.log("Stopping recording...");
    try {
      setIsRecording(false);
      const [buffer, blob]: [any, Blob] = await recorder.stop().getMp3();
      const audioFile: File = new File([buffer], "audio.mp3", {
        type: blob.type,
        lastModified: Date.now(),
      });
      // setBlobURL(URL.createObjectURL(audioFile))
      // // Convert to base64
      // const base64String = await convertBlobToBase64(file)
      // setAudio(base64String)
      console.log("Sending audio to whisper...");

      setLoading(true);
      console.log("file: ", audioFile);
      const formData = new FormData();
      formData.append("file", blob, "audio.mp3");
      console.log("formData: ", formData);

      const response = await fetch("/api/transcribe", {
        method: "POST",
        headers: {
          "Content-Type": `multipart/form-data`,
        },
        body: formData,
      });
      console.log("response: ", response);

      const data = await response.json();
      setLoading(false);
      const transcript = data.modelOutputs[0].text;
      setTranscript(transcript);
      console.log("Transcript: ", transcript);
    } catch (error) {
      console.error(error);
    }
  };

  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result as string | null | undefined;
        if (!base64data) {
          reject(new Error("Failed to convert blob to base64"));
        } else {
          const base64String = base64data.split(",")[1];
          resolve(base64String);
        }
      };
      reader.onerror = () => {
        reject(new Error("Failed to convert blob to base64"));
      };
    });
  };

  const handleRecordButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-end justify-end p-8 bg-white">
      <header className="absolute inset-x-0 top-0 z-50 shadow-lg">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <h3 className="text-black font-bold text-xl">🦾 fastpixels</h3>
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Log out <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>
      </header>
      <div className="bg-white py-16 sm:py-24 lg:py-32 flex w-full">
        <div className="w-2/3 flex items-center justify-center">
          <Image
            src={"/images/mermaid-diagram.png"}
            alt="Image generated with mermaid"
            width={380}
            height={575}
          ></Image>
        </div>
        <div className="mx-auto w-1/3 px-6 lg:px-8">
          <div className="max-w-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            <h2 className="inline sm:block text-2xl">The Plan</h2>{" "}
            <p className="inline sm:block"></p>
          </div>
          <div className="mt-10 relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400">
            <div className="flex-shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
            </div>
            <div className="min-w-0 flex-1">
              <a href="#" className="focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">
                  Sourasis Roy
                </p>
                <p className="text-sm text-gray-500">
                  Please create a flowchart that can manage inventory stored in
                  DynamoDB and handles both the transaction failures and
                  transaction succeeds scenarios.
                </p>
              </a>
            </div>
          </div>
          <form className="mt-10">
            <div className="flex gap-x-4">
              <label htmlFor="email-address" className="sr-only">
                Flowchart description
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="min-w-0 flex-auto rounded-md border-0 px-5 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Describe your flowchart"
              />
              <button
                onClick={handleRecordButtonClick}
                className="bg-indigo-500 p-2 rounded"
              >
                Audio
              </button>
              <button
                type="submit"
                className="flex-none rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
