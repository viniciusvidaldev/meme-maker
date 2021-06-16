import React, { useState, useEffect } from 'react';

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
        <h2>Selecione um template</h2>
        <Templates>
          {templates.map((template) => (
            <button
              key={template.id}
              type='button'
              onClick={() => {
                setSelectedTemplate(template);
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
            <Form>
              {(new Array(selectedTemplate.box_count)).fill('').map((_, index) => (
                  <input key={String(Math.random())} placeholder={`Text #${index + 1}`} />
                ))
              }

              <Button>MakeMyMeme!</Button>
            </Form>
          </>
        )}
      </Card>
    </Wrapper>
  );
};

export default Home;
