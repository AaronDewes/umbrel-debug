import { GeistProvider, CssBaseline } from '@geist-ui/react';
import '@/styles/base.scss';

import { useEffect, useState } from 'react';
import { loader } from '@monaco-editor/react';
import { useRouter } from 'next/router';

import Mousetrap from 'mousetrap';
import globalKeyBind from '@/lib/globalKeyBind';

import Head from 'next/head';

const Fastbin = ({ Component, pageProps }) => {
  const router = useRouter();

  useEffect(() => {
    globalKeyBind(Mousetrap);
    Mousetrap.bindGlobal('ctrl+i', () => router.push('/'));

    loader.init()
      .then(instance => {
        instance.languages.register({ id: 'tsc' });
        instance.languages.setMonarchTokensProvider('tsc', {
          tokenizer: {
            root: [
              // events
              [/#.+/, 'number'],

              // commands
              [/<([A-Z0-9+-]{3})/, 'tag'],

              // arguments
              [/[V0-9][0-9]{3}/, 'attribute.value'],

              // comments
              [/\/\/.+/, 'comment']
            ]
          }
        });

        instance.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: true,
          noSyntaxValidation: true,
          noSuggestionDiagnostics: true
        });
      })
      .catch(console.error);

    return () => {
      (Mousetrap as any).unbindGlobal('ctrl+i');
    };
  }, []);

  const [themeType] = useState('light');
  return (
    <GeistProvider themeType={themeType}>
      <CssBaseline />
      <Component {...pageProps} />

      <Head>
        <title>Umbrel debug logs</title>
        <meta name="charset" content="utf-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta name="title" content="Umbrel debug logs server" />
        <meta name="description" content="Umbrel's server for hosting the debug logs of users" />
      </Head>
    </GeistProvider>
  );
};

export default Fastbin;
