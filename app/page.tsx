"use client";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";

export default function Home() {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: `Hi! I'm the Rate My Professor support assistant. How can I help you today?`,
        },
    ]);
    const [message, setMessage] = useState("");

    const sendMessage = async () => {
        if (!message.trim()) return; // Prevent sending empty messages
        setMessage(""); // Clear the input field

        // Add user message and assistant's placeholder message
        setMessages((messages) => [
            ...messages,
            { role: "user", content: message },
            { role: "assistant", content: "..." }, // Placeholder for assistant's response
        ]);

        try {
            // Fetch request to send the message to the server
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify([...messages, { role: "user", content: message }]),
            });

            if (!response.ok) {
                // If the server responds with an error status (e.g., 403 or 429)
                throw new Error(`Server Error: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let result = "";

            // Read the response stream
            const processText = async ({ done, value }) => {
                if (done) {
                    return;
                }

                const text = decoder.decode(value || new Uint8Array(), { stream: true });
                result += text;

                // Update the assistant's message with received data
                setMessages((messages) => {
                    const updatedMessages = [...messages];
                    updatedMessages[updatedMessages.length - 1] = {
                        ...updatedMessages[updatedMessages.length - 1],
                        content: result, // Update assistant's content
                    };
                    return updatedMessages;
                });

                // Continue reading the stream
                return reader.read().then(processText);
            };

            await reader.read().then(processText);

        } catch (error) {
            // If any error occurs (including API quota exhaustion), update the assistant message
            setMessages((messages) => {
                const updatedMessages = [...messages];
                updatedMessages[updatedMessages.length - 1] = {
                    ...updatedMessages[updatedMessages.length - 1],
                    content: "I have an error now. Please try again later.", // Error message
                };
                return updatedMessages;
            });

            // Log the error to the console for debugging
            console.error("Error:", error);
        }
    };


    return (
        <Box
            width="100vw"
            height="100vh"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
        >
            <Stack
                direction={"column"}
                width="500px"
                height="700px"
                border="1px solid black"
                p={2}
                spacing={3}
            >
                <Stack
                    direction={"column"}
                    spacing={2}
                    flexGrow={1}
                    overflow="auto"
                    maxHeight="100%"
                >
                    {messages.map((message, index) => (
                        <Box
                            key={index}
                            display="flex"
                            justifyContent={
                                message.role === "assistant" ? "flex-start" : "flex-end"
                            }
                        >
                            <Box
                                bgcolor={
                                    message.role === "assistant"
                                        ? "primary.main"
                                        : "secondary.main"
                                }
                                color="white"
                                borderRadius={16}
                                p={3}
                            >
                                {message.content}
                            </Box>
                        </Box>
                    ))}
                </Stack>
                <Stack direction={"row"} spacing={2}>
                    <TextField
                        label="Message"
                        fullWidth
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <Button variant="contained" onClick={sendMessage}>
                        Send
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}
