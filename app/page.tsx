'use client'

import React, { useState, useEffect } from 'react';
import { FaChevronRight, FaChevronLeft, FaGithub, FaLinkedin, FaInfoCircle, FaCopy, FaPlay, FaRocket, FaStar, FaVideo } from 'react-icons/fa';
import { RiVideoLine, RiSparklingFill } from 'react-icons/ri';
import { HiOutlineClipboardDocument, HiOutlineSparkles } from 'react-icons/hi2';
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
  Chip,
  Progress,
} from '@nextui-org/react';

interface SummaryItem {
  url: string;
  summary: string;
  timestamp: Date;
  title?: string;
}

interface RecentSummariesSidebarProps {
  summaries: SummaryItem[];
  onSummarySelect: (summary: SummaryItem) => void;
}

const stripHtml = (html: string): string => {
  if (typeof window === 'undefined') {
    // Server-side fallback - remove HTML tags with regex
    return html.replace(/<[^>]*>/g, '');
  }
  
  try {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    const text = tempElement.textContent || tempElement.innerText || '';
    // Clean up the temporary element
    tempElement.innerHTML = '';
    return text;
  } catch (error) {
    // Fallback to regex if DOM manipulation fails
    return html.replace(/<[^>]*>/g, '');
  }
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

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-1/2 -translate-y-1/2 left-0 z-50 p-3 gradient-orange text-white rounded-r-lg shadow-xl hover:shadow-orange-500/25 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
          isOpen ? 'transform translate-x-80' : ''
        }`}
        aria-label={isOpen ? "Close recent transcriptions" : "Open recent transcriptions"}
        aria-expanded={isOpen}
      >
        {isOpen ? <FaChevronLeft size={18} /> : <FaChevronRight size={18} />}
      </button>
      
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />
      
      <aside
        className={`fixed left-0 top-0 h-full w-80 bg-[#161b22]/95 backdrop-blur-xl border-r border-[#21262d] p-6 overflow-y-auto transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'transform translate-x-0' : 'transform -translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center gap-3 mb-8">
          <RiSparklingFill className="text-2xl text-[#FF6B00]" />
          <h2 className="text-xl font-bold text-white">Recent Transcripts</h2>
        </div>
        
        {summaries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No transcriptions yet.</p>
            <p className="text-gray-500 text-xs mt-2">Your history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {summaries.map((summary, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all duration-200 border ${
                  selectedSummaryIndex === index 
                    ? 'border-[#FF6B00] bg-[#FF6B00]/10 shadow-lg shadow-orange-500/20' 
                    : 'border-[#21262d] bg-[#0d1117] hover:border-[#FF6B00]/50 hover:bg-[#161b22]'
                }`}
                isPressable
                onPress={() => handleSummaryClick(index)}
              >
                <CardBody className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white text-sm line-clamp-1">
                      Transcript #{summaries.length - index}
                    </h3>
                    <Chip 
                      size="sm" 
                      variant="flat"
                      className="bg-[#FF6B00]/20 text-[#FF6B00] text-xs"
                    >
                      {formatTimeAgo(summary.timestamp)}
                    </Chip>
                  </div>
                  <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                    {stripHtml(summary.summary).substring(0, 120)}...
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
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
  const [progress, setProgress] = useState(0);

  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Progress simulation during loading
  useEffect(() => {
    if (loading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 500);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSummary('');
    setProgress(0);
    
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
        setProgress(100);
        setSummary(data.summary);
        setSummaries(prevSummaries => [
          { 
            url, 
            summary: data.summary, 
            timestamp: new Date(),
            title: `Transcript ${prevSummaries.length + 1}`
          },
          ...prevSummaries.slice(0, 9) // Keep only 10 most recent
        ]);
      } else {
        setError(data.error || 'An unexpected error occurred');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to transcribe video. Please check your connection and try again.');
    }
    
    setLoading(false);
  };

  const copyToClipboard = async () => {
    try {
      // Simple regex-based HTML stripping - no DOM manipulation
      const plainText = summary
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
        .replace(/&amp;/g, '&') // Replace HTML entities
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim(); // Remove leading/trailing whitespace
      
      await navigator.clipboard.writeText(plainText);
      
      // Simple success feedback without DOM manipulation
      console.log('Text copied to clipboard successfully');
      
      // Optional: Show a temporary success message
      if (typeof window !== 'undefined') {
        const originalTitle = document.title;
        document.title = '✓ Copied to clipboard!';
        setTimeout(() => {
          document.title = originalTitle;
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = summary.replace(/<[^>]*>/g, '').trim();
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        console.log('Text copied using fallback method');
      } catch (fallbackErr) {
        console.error('Fallback copy also failed:', fallbackErr);
        alert('Failed to copy to clipboard. Please copy manually.');
      }
    }
  };

  const handleSummarySelect = (selectedSummary: SummaryItem) => {
    setUrl(selectedSummary.url);
    setSummary(selectedSummary.summary);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Floating Centered Navbar */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
        <div className="bg-[#161b22]/50 backdrop-blur-3xl border border-[#21262d]/40 rounded-2xl shadow-2xl shadow-black/50" style={{backdropFilter: 'blur(40px) saturate(150%)'}}>
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-bold text-lg gradient-text">VideoInsight</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                href="https://github.com/parthchilwerwar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#FF6B00] transition-colors p-2 hover:bg-[#21262d] rounded-lg"
              >
                <FaGithub className="text-lg" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/parth-chilwerwar-0b8648207/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#FF6B00] transition-colors p-2 hover:bg-[#21262d] rounded-lg"
              >
                <FaLinkedin className="text-lg" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <RecentSummariesSidebar summaries={summaries} onSummarySelect={handleSummarySelect} />

      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-32 pb-12 max-w-6xl">
        <div className="text-center mb-12 animate-fade-in">          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="gradient-text">
              YouTube Video
            </span>
            <br />
            <span className="text-white">Transcriber</span>
          </h1>
          
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform YouTube videos into precise transcripts with intelligent timestamping.
          </p>
        </div>

        {/* Main Input Section */}
        <div className="max-w-4xl mx-auto mb-12 flex justify-center">
          <div className="w-full max-w-3xl">
            <Card className="bg-[#161b22]/50 backdrop-blur-xl border border-[#21262d]/50 shadow-2xl">
              <CardBody className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-3 items-end justify-center">
                    <div className="flex-1 max-w-lg">
                      <Input
                        type="url"
                        label="YouTube URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                        size="md"
                        className="text-white"
                        classNames={{
                          input: "text-white bg-[#0d1117] text-base",
                          inputWrapper: "bg-[#0d1117] border-[#21262d] hover:border-[#FF6B00] focus-within:border-[#FF6B00] h-12",
                          label: "text-gray-400 font-medium text-sm"
                        }}
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      size="md"
                      isLoading={loading}
                      className="gradient-orange text-white font-semibold text-base h-12 px-6 shadow-lg hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-300 min-w-[140px]"
                    >
                      {loading ? 'Processing...' : 'Transcribe'}
                    </Button>
                  </div>
                  
                  {loading && (
                    <div className="space-y-2 mt-4">
                      <div className="text-sm">
                        <span className="text-gray-400">Processing your video...</span>
                      </div>
                      <Progress 
                        value={progress} 
                        className="w-full"
                        classNames={{
                          indicator: "bg-gradient-to-r from-[#FF6B00] to-[#FF8533]"
                        }}
                      />
                    </div>
                  )}
                </form>

                {error && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-center font-medium text-sm">{error}</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Output Section */}
        {summary && (
          <div className="max-w-6xl mx-auto flex justify-center">
            <div className="w-full max-w-5xl">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Timeline Sidebar */}
              <div className="lg:col-span-1">
                <Card className="bg-[#161b22]/50 backdrop-blur-xl border border-[#21262d]/50 sticky top-24">
                  <CardBody className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 gradient-orange rounded-lg flex items-center justify-center">
                        <FaInfoCircle className="text-white text-xs" />
                      </div>
                      <h3 className="text-base font-bold text-white">Timeline</h3>
                    </div>
                    <p className="text-gray-400 text-xs mb-3">Click timestamps to jump to specific moments</p>
                    <div className="space-y-2">
                      {/* Timeline items will be populated by clicking timestamps */}
                      <div className="text-xs text-gray-500">
                        Timestamps will appear here when you interact with the transcript
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <Card className="bg-[#161b22]/50 backdrop-blur-xl border border-[#21262d]/50">
                  <CardBody className="p-6">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#21262d]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 gradient-orange rounded-lg flex items-center justify-center">
                          <HiOutlineSparkles className="text-white text-sm" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">Video Transcript</h3>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={copyToClipboard}
                          size="sm"
                          className="gradient-orange text-white font-medium shadow-lg hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-300 text-sm"
                          startContent={<HiOutlineClipboardDocument className="text-sm" />}
                        >
                          Copy
                        </Button>
                        
                        {url && (
                          <Button
                            as={Link}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="bordered"
                            size="sm"
                            className="border-[#21262d] text-gray-300 hover:border-[#FF6B00] hover:text-[#FF6B00] transition-all duration-300 text-sm"
                          >
                            Video
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div 
                      className="text-white transcript-content max-w-none prose prose-invert"
                      style={{ color: '#ffffff' }}
                      dangerouslySetInnerHTML={{ __html: summary }}
                    />
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </div>
        )}
      </main>

      <style jsx global>{`
        .transcript-content {
          list-style: none !important;
        }
        .transcript-content ul, .transcript-content ol {
          list-style: none !important;
          padding-left: 0 !important;
        }
        .transcript-content li {
          list-style: none !important;
          list-style-type: none !important;
        }
        .transcript-content li::before {
          display: none !important;
        }
        .transcript-content a {
          color: #FF6B00 !important;
          text-decoration: none;
          transition: all 0.3s ease;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 8px;
          background: rgba(255, 107, 0, 0.15);
          border: 1px solid rgba(255, 107, 0, 0.3);
          font-family: 'JetBrains Mono', monospace;
          display: inline-block;
          margin: 0 4px;
          font-size: 0.9rem;
        }
        .transcript-content a:hover {
          color: #FF8533 !important;
          background: rgba(255, 107, 0, 0.25);
          border-color: #FF6B00;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 107, 0, 0.4);
        }
        .transcript-content p {
          margin-bottom: 2.5rem;
          color: #ffffff !important;
          line-height: 1.8;
          font-size: 1rem;
          list-style: none !important;
        }
        .transcript-content h3 {
          color: #FF6B00 !important;
          margin: 4rem 0 2rem 0;
          font-size: 1.2rem;
          font-weight: 600;
          border-bottom: none !important;
          border-left: 4px solid #FF6B00;
          padding-left: 1rem;
          background: rgba(255, 107, 0, 0.05);
          padding: 1rem 0 1rem 1rem;
          border-radius: 0 8px 8px 0;
        }
        .transcript-content h3:first-of-type {
          margin-top: 0;
        }
        .transcript-content strong {
          color: #ffffff !important;
          border-bottom: 2px solid rgba(255, 107, 0, 0.3);
        }
        .transcript-content strong::before {
          background: #FF6B00;
        }
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        .prose {
          max-width: none;
        }
        .prose p {
          margin-bottom: 2.5rem;
          line-height: 1.8;
          font-size: 1rem;
        }
        .prose-invert p {
          margin-bottom: 2.5rem;
          line-height: 1.8;
          font-size: 1rem;
        }
        .prose ul, .prose ol {
          list-style: none !important;
          padding-left: 0 !important;
        }
        .prose li {
          list-style: none !important;
          list-style-type: none !important;
        }
        .prose li::before {
          display: none !important;
        }
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
          color: #FF6B00 !important;
          margin-top: 4rem;
          margin-bottom: 2rem;
          border-bottom: none !important;
          border-left: 4px solid #FF6B00;
          padding-left: 1rem;
          background: rgba(255, 107, 0, 0.05);
          padding: 1rem 0 1rem 1rem;
          border-radius: 0 8px 8px 0;
        }
        .prose-invert h1, .prose-invert h2, .prose-invert h3, .prose-invert h4, .prose-invert h5, .prose-invert h6 {
          color: #FF6B00 !important;
          border-bottom: none !important;
          margin-top: 4rem;
          margin-bottom: 2rem;
          border-left: 4px solid #FF6B00;
          padding-left: 1rem;
          background: rgba(255, 107, 0, 0.05);
          padding: 1rem 0 1rem 1rem;
          border-radius: 0 8px 8px 0;
        }
        .prose-invert ul, .prose-invert ol {
          list-style: none !important;
          padding-left: 0 !important;
        }
        .prose-invert li {
          list-style: none !important;
          list-style-type: none !important;
        }
        .prose-invert li::before {
          display: none !important;
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}