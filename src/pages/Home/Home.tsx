import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import qs from 'qs';

import { Wrapper, Card, Templates, Form, Button } from './styles';
import logo from '../../images/logo.svg';

interface ITemplates {
  id: string;
  url: string;
  name: string;
  box_count: number;
}

interface ISelectedTemplates {
  id: string;
  url: string;
  name: string;
  box_count: number;
}

const Home: React.FC = () => {
  const [templates, setTemplates] = useState<ITemplates[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<ISelectedTemplates | null>(null);
  const [boxes, setBoxes] = useState<string[]>([]);
  const [generatedMeme, setGeneratedMeme] = useState<string | null>(null);

  const handleInputChange =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const newValues = boxes;
      newValues[index] = e.target.value;
      setBoxes(newValues);
    };

  function handleSelectedTemplate(template: ISelectedTemplates) {
    setSelectedTemplate(template);
    setBoxes([]);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const params = qs.stringify({
      template_id: selectedTemplate?.id,
      username: 'vikayel543',
      password: 'vikayel543',
      boxes: boxes.map((text) => ({ text })),
    });

    const resp = await fetch(`https://api.imgflip.com/caption_image?${params}`);
    const {
      data: { url },
    } = await resp.json();

    setGeneratedMeme(url);
  }

  function handleReset() {
    setSelectedTemplate(null);
    setBoxes([]);
    setGeneratedMeme(null);
  }

  useEffect(() => {
    (async () => {
      const resp = await fetch('https://api.imgflip.com/get_memes');
      const {
        data: { memes },
      } = await resp.json();
      setTemplates(memes);
    })();
  }, []);

  return (
    <Wrapper>
      <img src={logo} alt='MemeMaker' />

      <Card>
        {generatedMeme && (
          <>
            <img src={generatedMeme} alt='generated meme' />
            <Button type="button" onClick={handleReset}>Create another meme</Button>
          </>
        )}
        {!generatedMeme && (
          <>
            <h2>Selecione um template</h2>
        <Templates>
          {templates.map((template) => (
            <button
              key={template.id}
              type='button'
              onClick={() => {
                handleSelectedTemplate(template);
              }}
              className={template.id === selectedTemplate?.id ? 'selected' : ''}
            >
              <img src={template.url} alt={template.name} />
            </button>
          ))}
        </Templates>

        {selectedTemplate && (
          <>
            <h2>Textos</h2>
            <Form onSubmit={handleSubmit}>
              {new Array(selectedTemplate.box_count)
                .fill('')
                .map((_, index) => (
                  <input
                    key={String(Math.random())}
                    placeholder={`Text #${index + 1}`}
                    onChange={handleInputChange(index)}
                  />
                ))}

              <Button type='submit'>MakeMyMeme!</Button>
            </Form>
          </>
        )}
          </>
        )}
      </Card>
    </Wrapper>
  );
};

export default Home;
