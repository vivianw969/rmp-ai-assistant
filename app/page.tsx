"use client";
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Layout from './components/Layout';
import Chat from './components/Chat';

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Chat />
      </Layout>
    </ThemeProvider>
  );
}
