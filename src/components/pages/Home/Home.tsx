import { useState } from 'react';

import { useForm } from '#/forms/hooks';
import { SubmitHandler } from '#/forms/types';

import { Container, Typography, TextField, Button } from '@/components/common';

const fieldName = 'question';

interface FormFields {
  [fieldName]: string;
}

const Home = () => {
  const { register, handleSubmit } = useForm<FormFields>();
  const [aiAnswer, setAiAnswer] = useState();

  const onSubmit: SubmitHandler<FormFields> = async ({ question }) => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: question }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setAiAnswer(data.result);
    } catch (error) {
      // Consider implementing your own error handling logic here
      // alert(error.message);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography
        variant="h3"
        sx={{
          fontWeight: 600,
          mb: 3,
        }}
        component="h1"
      >
        Question
      </Typography>
      <TextField {...register(fieldName)} />
      <br />
      <br />
      <Button onClick={handleSubmit(onSubmit)} size="large">
        Send
      </Button>
      <Typography>{aiAnswer}</Typography>
    </Container>
  );
};

export default Home;
