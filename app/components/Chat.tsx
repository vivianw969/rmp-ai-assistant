import { Box, Button, Paper, Stack, TextField } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I'm the Rate My Professor support assistant. How can I help you today?`,
    },
  ]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);
    setMessage('');

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: message },
      { role: 'assistant', content: '...' },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let result = '';

      const processText = async ({ done, value }: ReadableStreamReadResult<Uint8Array>): Promise<void> => {
        if (done) {
          setIsLoading(false);
          return;
        }

        const text = decoder.decode(value || new Uint8Array(), { stream: true });
        result += text;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: result,
          };
          return updated;
        });

        return reader.read().then(processText);
      };

      await reader.read().then(processText);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: 'Sorry, I encountered an error. Please try again later.',
        };
        return updated;
      });
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        height: 'calc(100vh - 180px)',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          p: 2,
          bgcolor: 'background.default',
        }}
      >
        <Stack spacing={2}>
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: msg.role === 'assistant' ? 'flex-start' : 'flex-end',
              }}
            >
              <Box
                sx={{
                  maxWidth: '70%',
                  p: 2,
                  bgcolor: msg.role === 'assistant' ? 'background.paper' : 'primary.main',
                  color: msg.role === 'assistant' ? 'text.primary' : 'white',
                  borderRadius: 3,
                  boxShadow: 1,
                  ...(msg.role === 'assistant' 
                    ? { 
                        borderTopLeftRadius: 0,
                        border: '1px solid',
                        borderColor: 'divider',
                      } 
                    : { 
                        borderTopRightRadius: 0,
                      }
                  ),
                }}
              >
                {msg.content}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
      </Box>
      <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            multiline
            maxRows={4}
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.default',
              },
            }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={!message.trim() || isLoading}
            sx={{
              minWidth: '56px',
              height: '56px',
              borderRadius: '50%',
            }}
          >
            <SendIcon />
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
} 