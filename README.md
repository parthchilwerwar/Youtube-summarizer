![VideoInsight Logo](app/favicon.ico) 

# VideoInsight

VideoInsight is a web application that summarizes YouTube videos using Gemini AI. It allows users to input a YouTube video URL and receive a concise summary of the video's content, making it easier to grasp the main points without watching the entire video.

## Features

- Summarize YouTube videos by simply entering the video URL.
- Displays recent summaries for quick access.
- Responsive design for both desktop and mobile users.
- Easy-to-use interface with a modern look.

## Technologies Used

- **React**: For building the user interface.
- **Next.js**: For server-side rendering and API routes.
- **NextUI**: For UI components.
- **Google Generative AI**: For generating video summaries.
- **Tailwind CSS**: For styling the application.

## Installation

To get started with VideoInsight, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/parthchilwerwar/Youtube-summarizer.git
   cd Youtube-summarizer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root of the project and add your API keys:
   ```plaintext
   GEMINI_API_KEY=your_gemini_api_key
   YOUTUBE_API_KEY=your_youtube_api_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:3000`.

## Usage

1. Enter a valid YouTube video URL in the input field.
2. Click the "Summarize Video" button.
3. The summary will be displayed below the input field along with a disclaimer.
4. You can copy the summary to your clipboard using the "Copy Summary" button.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.

