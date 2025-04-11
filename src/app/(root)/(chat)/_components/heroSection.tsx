import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { FaPaperclip, FaUpload, FaGlobe, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import { useGoogleLogin } from '@react-oauth/google';
import { useAppDispatch } from '@/redux/hooks';
import GlowButton from '@/components/ui/glowButton';
import toast from 'react-hot-toast';
import { Loader2, SparklesIcon } from 'lucide-react';
import JobSearchResults from './job-result';
import QueryLimitPopup from './QueryLimitPopup'; 
import ResumeUploadPopup from './ResumeUploadPopup'; // Import the new component
import ChatInput from './chatinput';
import { Button } from '@/components/ui/button';
import { fetchJobs } from "@/actions/chat_actions"

const QUERY_LIMIT = 5;
const STORAGE_KEY = 'userQueryCount';

const HeroSection = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [queryCount, setQueryCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false); // State to control query limit popup
  const [showResumePopup, setShowResumePopup] = useState(false); // New state for resume popup
  const [jobApiData, setJobApiData] = useState<any>(null)
  const [isApiLoading, setIsApiLoading] = useState(false)
  const buttonItems = [
    { text: 'NEW', secondaryText: 'Build a mobile app with Expo', icon: null },
    { text: 'Recharts dashboard', secondaryText: null, icon: null },
    { text: 'Habit tracker', secondaryText: null, icon: null },
    { text: 'Real estate listings', secondaryText: null, icon: null },
    { text: 'Developer portfolio', secondaryText: null, icon: null }
  ];

  useEffect(() => {
    const storedCount = localStorage.getItem(STORAGE_KEY);
    if (storedCount) {
      setQueryCount(parseInt(storedCount, 10));
    }
  }, []);
  
  console.log("Results state:", showResults);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, queryCount.toString());
  }, [queryCount]);

  const handleCloseResults = () => {
    console.log("Closing job results");
    setShowResults(false);
    setQuery('');
    setJobApiData(null);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleCloseResumePopup = () => {
    setShowResumePopup(false);
  };

  const handleChatSubmit = async (inputText: string) => {
    console.log("Chat submit triggered with text:", inputText);
    setQuery(inputText);
    setIsApiLoading(true);
    
    try {
      console.log("Calling fetchJobs with:", inputText);
      // Call the API with the chat input
      const data = await fetchJobs(inputText);
      console.log("Job data received in component:", data);
      setJobApiData(data);
    } catch (error) {
      console.error("Error fetching job data:", error);
      toast.error("Failed to fetch job results");
    } finally {
      console.log("API loading completed");
      setIsApiLoading(false);
      setShowResults(true);
    }
    
    setQueryCount(prevCount => {
      const newCount = prevCount + 1;
      console.log("New query count:", newCount);
      if (newCount >= QUERY_LIMIT) {
        setShowPopup(true);
      }
      return newCount;
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Ray Container with multiple light rays */}
      <div 
          className="fixed inset-0 pointer-events-none select-none"
          style={{
            '--gradient-opacity': '.85',
            '--ray-gradient': 'radial-gradient(rgb(83 255 233 / 85%) 0%, rgba(43, 166, 255, 0) 100%)',
            transition: 'opacity 0.25s linear',
          } as React.CSSProperties}
        >
        {/* Light Ray 1 */}
        <div className="absolute rounded-full" 
          style={{
            background: 'var(--ray-gradient)',
            width: '480px',
            height: '680px',
            transform: 'rotate(80deg)',
            top: '-540px',
            left: '250px',
            filter: 'blur(110px)'
          }}
        />
        {/* Light Ray 2 */}
        <div className="absolute rounded-full" 
          style={{
            background: 'var(--ray-gradient)',
            width: '110px',
            height: '400px',
            transform: 'rotate(-20deg)',
            top: '-280px',
            left: '350px',
            mixBlendMode: 'overlay',
            opacity: '0.6',
            filter: 'blur(60px)'
          }}
        />
        {/* Light Ray 3 */}
        <div className="absolute rounded-full" 
          style={{
            background: 'var(--ray-gradient)',
            width: '400px',
            height: '370px',
            transform: 'rotate(95deg)',
            top: '-350px',
            left: '200px',
            mixBlendMode: 'overlay',
            opacity: '0.6',
            filter: 'blur(21px)'
          }}
        />
        {/* Light Ray 4 */}
        <div className="absolute rounded-full" 
          style={{
            background: 'var(--ray-gradient)',
            position: 'absolute',
            width: '330px',
            height: '370px',
            transform: 'rotate(75deg)',
            top: '-330px',
            left: '50px',
            mixBlendMode: 'overlay',
            opacity: '0.5',
            filter: 'blur(21px)'
          }}
        />
        {/* Light Ray 5 */}
        <div className="absolute rounded-full" 
          style={{
            background: 'var(--ray-gradient)',
            position: 'absolute',
            width: '110px',
            height: '400px',
            transform: 'rotate(-40deg)',
            top: '-280px',
            left: '-10px',
            mixBlendMode: 'overlay',
            opacity: '0.8',
            filter: 'blur(60px)'
          }}
        />
      </div>

      {/* Conditional Rendering for Hero Content or Job Search Results */}
      {showResults && queryCount < QUERY_LIMIT ? (
        <>
          <JobSearchResults 
            query={query} 
            onClose={handleCloseResults} 
            apiData={jobApiData}
            isLoading={isApiLoading}
          />
          {/* Chat input below job results */}
          <div className='w-[60%] mx-auto mt-4'>
            <ChatInput 
              isLoggedIn={isLoggedIn} 
              onSubmit={handleChatSubmit} 
              setShowResumePopup={setShowResumePopup} // Pass the first signup handler
            />
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center text-center mt-2 px-4">
      {!showResults || queryCount >= QUERY_LIMIT ? (
        // Show hero content when no results or query limit reached
        <>
          <div className="flex justify-center mt-4 mb-[10%]">
            <Button variant="outline" className="rounded-full bg-black/50 border-gray-700 hover:bg-black/70 text-white">
              <SparklesIcon className="w-4 h-4 mr-2" />
              Introducing Chrome Extension for Contextual AutoFilling 
            </Button>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Find and apply jobs in seconds.
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl">
            Jobflow is your JobGpt. Start for free today.
          </p>
        </>
      ) : (
        // Show job results when results should be displayed
        <div className="w-full mb-8">
          <JobSearchResults 
            query={query} 
            onClose={handleCloseResults} 
            apiData={jobApiData}
            isLoading={isApiLoading}
          />
        </div>
      )}
      
      {/* Chat input always visible */}
      <div className='w-[60%]'>
        <ChatInput 
          isLoggedIn={isLoggedIn} 
          onSubmit={handleChatSubmit} 
          setShowResumePopup={setShowResumePopup} // Pass the first signup handler
        />
      </div>
      
      {/* Only show suggestion buttons when no results */}
      {(!showResults || queryCount >= QUERY_LIMIT) && (
        <div className="flex flex-wrap justify-center gap-3 mt-6">
        {buttonItems.slice(1).map((item) => (
          <GlowButton
            key={item.text}
            size="sm"
            variant="secondary"
          >
            {item.text}
          </GlowButton>
        ))}
      </div>
      )}
      </div>
      )}
      
      {/* Query Limit Popup */}
      {showPopup && <QueryLimitPopup onClose={handleClosePopup} />}
      
      {/* Resume Upload Popup - show only after first signup */}
      {showResumePopup && <ResumeUploadPopup onClose={handleCloseResumePopup} />}
      
      {/* Loading overlay */}
      {isApiLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-6 rounded-xl flex items-center gap-3">
            <Loader2 className="animate-spin text-[#53ffe9]" />
            <span className="text-white">Searching for jobs...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;