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
        className={`fixed top-1/2 -translate-y-1/2 left-0 z-50 p-2 md:p-3 bg-gray-700 text-white rounded-r-md shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 ${
          isOpen ? 'transform translate-x-64 md:translate-x-80' : ''
        }`}
        aria-label={isOpen ? "Close recent summaries" : "Open recent summaries"}
        aria-expanded={isOpen}
      >
        {isOpen ? <FaChevronLeft size={16} /> : <FaChevronRight size={16} />}
      </button>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      ></div>
      <aside
        className={`fixed left-0 top-0 h-full w-64 md:w-80 bg-gray-800 p-4 overflow-y-auto transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'transform translate-x-0' : 'transform -translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <h2 className="text-xl font-bold mb-6 text-gray-200">Recent Summaries</h2>
        {summaries.length === 0 ? (
          <p className="text-base text-gray-400">No recent summaries yet.</p>
        ) : (
          summaries.map((summary, index) => (
            <div
              key={index}
              className={`mb-6 p-3 bg-gray-700 rounded-lg shadow-md cursor-pointer transition-colors duration-200 ${
                selectedSummaryIndex === index ? 'bg-gray-600' : 'hover:bg-gray-650'
              }`}
              onClick={() => handleSummaryClick(index)}
            >
              <h3 className="text-lg font-semibold mb-2 text-gray-300">History {summaries.length - index}</h3>
              <p className="text-xs text-gray-500 mt-2 truncate">{summary.summary.substring(0, 100)}...</p>
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
      setError('Failed to summarize video');
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary).then(() => {
      alert('Summary copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy:', err);
    });
  };

  const handleSummarySelect = (selectedSummary: SummaryItem) => {
    setUrl(selectedSummary.url);
    setSummary(selectedSummary.summary);
  };

  return (
    <div className={`min-h-screen bg-gray-900 text-white ${scrolled ? 'navbar-scrolled' : ''}`}>
      <Navbar className={`bg-black`} isBordered>
        <NavbarBrand>
          <RiVideoLine className="text-white mr-2 text-2xl" />
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

      <main className="flex flex-col items-center justify-center px-6 py-12 sm:px-12">
        <Card className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-lg">
          <CardHeader className="flex flex-col items-center pb-0 pt-6">
            <h1 className="text-3xl font-bold mb-4">Summarize YouTube Video</h1>
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
                className="text-white "
              />
              <Button
                type="submit"
                color="primary"
                isLoading={loading}
                className="bg-green-500 hover:bg-green-600"
              >
                Summarize Video
              </Button>
            </form>
            {error && (
              <p className="text-red-500 mt-4 text-center">{error}</p>
            )}
            {summary && (
              <Card className="mt-6 bg-gray-700 rounded-lg">
                <CardBody>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <FaInfoCircle className="mr-2" /> Video Summary:
                  </h3>
                  <p className="whitespace-pre-line">{summary}</p>
                  <Button
                    onClick={copyToClipboard}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <FaCopy className="mr-2" /> Copy Summary
                  </Button>
                  <p className="text-yellow-400 mt-4 text-sm">
                    {disclaimer}
                  </p>
                  {url && (
                    <Link
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 mt-4 inline-block flex items-center"
                    >
                      Watch the video
                    </Link>
                  )}
                </CardBody>
              </Card>
            )}
          </CardBody>
        </Card>
      </main>
    </div>
  );
}