import React, { useState, useEffect } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVolumeUp } from 'react-icons/fa';
import PropTypes from 'prop-types';

const SpeechButton = ({ onTranscribe, textToSpeak }) => {
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {
        // Check for browser compatibility
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recog = new SpeechRecognition();
            recog.continuous = false;
            recog.interimResults = false;
            recog.lang = 'en-US';

            recog.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                onTranscribe(transcript);
            };

            recog.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recog.onend = () => {
                setIsListening(false);
            };

            setRecognition(recog);
        } else {
            console.error('Speech Recognition API not supported in this browser.');
        }
    }, [onTranscribe]);

    const startListening = () => {
        if (recognition) {
            recognition.start();
            setIsListening(true);
        }
    };

    const stopListening = () => {
        if (recognition) {
            recognition.stop();
            setIsListening(false);
        }
    };

    const handleMicClick = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    // Text-to-Speech functionality
    const speakText = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            window.speechSynthesis.speak(utterance);
        } else {
            console.error('Speech Synthesis API not supported in this browser.');
        }
    };

    return (
        <div className="flex items-center gap-2">
            {/* Speech-to-Text Button */}
            <button
                onClick={handleMicClick}
                className={`flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white ${
                    isListening ? 'bg-red-500 text-white' : ''
                }`}
                title={isListening ? 'Stop Listening' : 'Start Speaking'}
            >
                {isListening ? <FaMicrophoneSlash size={20} /> : <FaMicrophone size={20} />}
            </button>

            {/* Text-to-Speech Button */}
            {textToSpeak && (
                <button
                    onClick={speakText}
                    className="flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white"
                    title="Read Message"
                >
                    <FaVolumeUp size={20} />
                </button>
            )}
        </div>
    );
};

SpeechButton.propTypes = {
    onTranscribe: PropTypes.func.isRequired,
    textToSpeak: PropTypes.string
};

export default SpeechButton;
