'use client'

import { useState, useEffect } from 'react';
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

export default function Home() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scrolled, setScrolled] = useState(false);

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
                className="text-white"
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
                  <h2 className="text-xl font-semibold mb-2 flex items-center">
                    <FaInfoCircle className="mr-2" /> Video Summary:
                  </h2>
                  <p className="whitespace-pre-line">{summary}</p>
                  <Button
                    onClick={copyToClipboard}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <FaCopy className="mr-2" /> Copy Summary
                  </Button>
                  <p className="text-yellow-400 mt-4 text-sm">
                    Disclaimer: This is the AI-based summary. It may be accurate or may not be.
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
