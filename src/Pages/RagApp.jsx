import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, CircularProgress } from '@mui/material';
import { useRealmApp } from "../RealmApp";
import AIWriter from 'react-aiwriter';
import Markdown from 'react-markdown';

const MemoizedAIWriter = React.memo(({ response }) => (
  <AIWriter>
    <Markdown>
      {response}
    </Markdown>
  </AIWriter>
));

const SearchPage = () => {
  const app = useRealmApp();
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    setResponse('');
    const searchResult = await app.callFunction("askQuestion", query);
    setResponse(searchResult.choices[0].message.content); 
    setIsLoading(false);
  };


  const handleLogout = async () => {
      try {
          await app.logOut();
      } catch (e) {
          console.error("error logging out");
      }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4 }}>
        <Typography variant="h4" component="h4" gutterBottom>
          Ask me anything
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%'}}>
          <TextField
            label="Your question"
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
          />
          <Button 
            variant="contained"
            onClick={handleSearch}
            disabled={isLoading}  
          >
            {isLoading ? <CircularProgress size={24} /> : "Ask"}
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%', mt: 3 }}>
          <Typography variant="h5" component="h5" gutterBottom>
            The answer:
          </Typography>
          <Paper sx={{ width: '97%', mt: 3, p: 3 }}>
            <MemoizedAIWriter response={response} />
          </Paper>
        </Box>
      </Box>
      <Box sx={{ padding: 3 }}>
        <Button variant="outlined" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default SearchPage;
