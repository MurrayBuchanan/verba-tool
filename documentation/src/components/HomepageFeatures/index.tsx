import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Technology-Enhanced Rehabilitation',
    description: (
      <>
        Tool to assist caregivers, therapists and health professionals additional information when supporting people living with dementia.
      </>
    ),
  },
  {
    title: 'Automatic Speech Recognition',
    description: (
      <>
        Integrated with <a href="https://azure.microsoft.com/en-us/products/ai-foundry/tools/speech" target="_blank" rel="noopener noreferrer">Azure Speech Services</a>, to allow for transcription and diarisation allowing for interchangable structured tasks.
      </>
    ),
  },
  {
    title: 'NLP and LLM Feature Extraction',
    description: (
      <>
        Extracts features from conversation using <a href="https://spacy.io/" target="_blank" rel="noopener noreferrer">spaCy</a> and <a href="https://azure.microsoft.com/en-gb/products/ai-foundry/models/openai/" target="_blank" rel="noopener noreferrer">Azure OpenAI</a> to allow for improved conversation analysis.
      </>
    ),
  },
  {
    title: 'Ethical and Privacy-aware',
    description: (
      <>
        The application is designed following ethical guidelines and privacy best practices.
      </>
    ),
  },
  {
    title: 'Secure and Scalable',
    description: (
      <>
        Protected using <a href="https://www.microsoft.com/en-gb/security/business/identity-access/microsoft-entra-id" target="_blank" rel="noopener noreferrer">Microsoft Entra ID</a> to ensure data security and developed using a modular apporach to allow for scalability.
      </>
    ),
  },
  {
    title: 'User-friendly',
    description: (
      <>
        Designed to be easily usable by caregivers, therapists and health professionals to support them in making personalised care plans.
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
