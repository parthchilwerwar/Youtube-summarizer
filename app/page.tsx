'use client'

import React, { useState, useEffect } from 'react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import {
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
} from '@nextui-org/react';
import { FaGithub, FaLinkedin, FaInfoCircle, FaCopy } from 'react-icons/fa';
import { RiVideoLine } from 'react-icons/ri';

interface SummaryItem {
  url: string;
  summary: string;
}

interface RecentSummariesSidebarProps {
  summaries: SummaryItem[];
  onSummarySelect: (summary: SummaryItem) => void;
}

const stripHtml = (html: string): string => {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = html;
  return tempElement.textContent || tempElement.innerText;
};

const RecentSummariesSidebar: React.FC<RecentSummariesSidebarProps> = ({ summaries, onSummarySelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSummaryIndex, setSelectedSummaryIndex] = useState<number | null>(null);

  const handleSummaryClick = (index: number) => {
    setSelectedSummaryIndex(index);
    onSummarySelect(summaries[index]);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-1/2 -translate-y-1/2 left-0 z-50 p-2 md:p-3 bg-white text-black rounded-r-md shadow-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300 ${
          isOpen ? 'transform translate-x-64 md:translate-x-80' : ''
        }`}
        aria-label={isOpen ? "Close recent transcriptions" : "Open recent transcriptions"}
        aria-expanded={isOpen}
      >
        {isOpen ? <FaChevronLeft size={16} /> : <FaChevronRight size={16} />}
      </button>
      <div
        className={`fixed inset-0 bg-black bg-opacity-70 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      ></div>
      <aside
        className={`fixed left-0 top-0 h-full w-64 md:w-80 bg-black border-r border-gray-800 p-4 overflow-y-auto transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'transform translate-x-0' : 'transform -translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <h2 className="text-xl font-bold mb-6 text-white">Recent Transcriptions</h2>
        {summaries.length === 0 ? (
          <p className="text-base text-gray-400">No recent transcriptions yet.</p>
        ) : (
          summaries.map((summary, index) => (
            <div
              key={index}
              className={`mb-6 p-3 bg-gray-900 border ${
                selectedSummaryIndex === index ? 'border-white bg-gray-800' : 'border-gray-700 hover:border-gray-500'
              } rounded-lg shadow-md cursor-pointer transition-colors duration-200`}
              onClick={() => handleSummaryClick(index)}
            >
              <h3 className="text-lg font-semibold mb-2 text-white">History {summaries.length - index}</h3>
              <p className="text-xs text-gray-400 mt-2 truncate">
                {stripHtml(summary.summary).substring(0, 100)}...
              </p>
            </div>
          ))
        )}
      </aside>
    </>
  );
};

export default function Home() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [summaries, setSummaries] = useState<SummaryItem[]>([]);
  const [disclaimer, setDisclaimer] = useState('');

  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSummary('');
    setDisclaimer('');
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (response.ok) {
        setSummary(data.summary);
        setDisclaimer(data.disclaimer);
        setSummaries(prevSummaries => [
          { url, summary: data.summary },
          ...prevSummaries
        ]);
      } else {
        setError(data.error || 'An unexpected error occurred');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to transcribe video');
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    // Create a temporary element to strip HTML tags for copying plain text
    const tempElement = document.createElement('div');
    tempElement.innerHTML = summary;
    const plainText = tempElement.textContent || tempElement.innerText;
    
    navigator.clipboard.writeText(plainText).then(() => {
      alert('Transcription copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy:', err);
    });
  };

  const handleSummarySelect = (selectedSummary: SummaryItem) => {
    setUrl(selectedSummary.url);
    setSummary(selectedSummary.summary);
  };

  return (
    <div className={`min-h-screen bg-black text-white ${scrolled ? 'navbar-scrolled' : ''}`}>
      <Navbar className={`bg-black border-b border-gray-800`} isBordered>
        <NavbarBrand>
          <img src="favicon.ico" alt="VideoInsight Logo" className="text-white mr-2 text-2xl mr-2 w-9 h-9" />
          <p className="font-bold text-white">VideoInsight</p>
        </NavbarBrand>
        <NavbarContent justify="end">
          <Link
            href="https://github.com/parthchilwerwar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white"
          >
            <FaGithub className="text-2xl" />
          </Link>
          <Link
            href="https://www.linkedin.com/in/parth-chilwerwar-0b8648207/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white ml-4"
          >
            <FaLinkedin className="text-2xl" />
          </Link>
        </NavbarContent>
      </Navbar>

      <RecentSummariesSidebar summaries={summaries} onSummarySelect={handleSummarySelect} />

      <main className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 md:px-8">
        <Card className="w-full max-w-4xl bg-gray-900 border border-gray-700 rounded-xl shadow-lg">
          <CardHeader className="flex flex-col items-center pb-0 pt-6">
            <h1 className="text-2xl font-bold mb-4 text-white">Transcribe YouTube Video</h1>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                type="url"
                label="YouTube URL"
                placeholder="Enter YouTube video URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="text-white"
                classNames={{
                  input: "text-white bg-gray-800",
                  inputWrapper: "bg-gray-800 border-gray-500 hover:border-gray-400"
                }}
              />
              <Button
                type="submit"
                color="primary"
                isLoading={loading}
                className="bg-white text-black hover:bg-gray-200"
              >
                Transcribe Video
              </Button>
            </form>
            {error && (
              <p className="text-red-500 mt-4 text-center">{error}</p>
            )}
            {summary && (
              <Card className="mt-6 bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
                <CardBody className="px-5 py-6 md:p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center text-white border-b border-gray-800 pb-3">
                    <FaInfoCircle className="mr-2" /> Video Transcription
                  </h3>
                  <div 
                    className="text-gray-200 transcript-content"
                    dangerouslySetInnerHTML={{ __html: summary }}
                  />
                  <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-gray-800">
                    <Button
                      onClick={copyToClipboard}
                      className="bg-white text-black hover:bg-gray-200"
                    >
                      <FaCopy className="mr-2" /> Copy Transcription
                    </Button>
                    {url && (
                      <Link
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white hover:text-gray-200 transition-colors"
                      >
                        <RiVideoLine className="mr-2" /> Watch Original Video
                      </Link>
                    )}
                  </div>
                  <p className="text-yellow-400 mt-6 text-sm">
                    {disclaimer}
                  </p>
                </CardBody>
              </Card>
            )}
          </CardBody>
        </Card>
      </main>

      <style jsx global>{`
        .transcript-content a {
          color: #ffffff;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .transcript-content a:hover {
          color: #e5e5e5;
          text-decoration: underline;
        }
        .transcript-content p {
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}