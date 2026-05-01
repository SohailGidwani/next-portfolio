import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Captioning: CNN + Transformer (0.80 BLEU) | Sohail Gidwani',
  description: 'CNN/VGG-16 feature extraction + LSTM and Transformer caption generators. Transformer model achieved 0.80 BLEU, a 23% improvement over the LSTM baseline. Deployed via Streamlit.',
  keywords: ['Image Captioning', 'CNN', 'Transformer', 'VGG-16', 'BLEU', 'TensorFlow', 'Streamlit', 'Sohail Gidwani'],
  authors: [{ name: 'Sohail Gidwani', url: 'https://sohailgidwani.app' }],
  alternates: {
    canonical: '/projects/image-captioning',
  },
  openGraph: {
    title: 'Image Captioning: CNN + Transformer (0.80 BLEU) | Sohail Gidwani',
    description: 'VGG-16 features + LSTM/Transformer caption generators. Transformer hit 0.80 BLEU (+23% vs baseline). Deployed with Streamlit.',
    url: 'https://sohailgidwani.app/projects/image-captioning',
    siteName: 'Sohail Gidwani Portfolio',
    images: [
      {
        url: '/api/og?title=Image%20Captioning&description=CNN%2FVGG-16%20%2B%20Transformer%20pipeline%20hitting%200.80%20BLEU%2C%20%2B23%25%20over%20the%20LSTM%20baseline&type=project&tags=TensorFlow,CNN,Transformer,VGG-16,Streamlit',
        width: 1200,
        height: 630,
        alt: 'Image Captioning: CNN + Transformer (0.80 BLEU) | Sohail Gidwani',
      },
    ],
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Captioning: CNN + Transformer (0.80 BLEU) | Sohail Gidwani',
    description: 'CNN/VGG-16 + Transformer pipeline. 0.80 BLEU, 23% above LSTM baseline.',
    images: [
      '/api/og?title=Image%20Captioning&description=CNN%2FVGG-16%20%2B%20Transformer%20pipeline%20hitting%200.80%20BLEU%2C%20%2B23%25%20over%20the%20LSTM%20baseline&type=project&tags=TensorFlow,CNN,Transformer,VGG-16,Streamlit',
    ],
    creator: '@sohailgidwani',
  },
}

export default function ImageCaptioningLayout({ children }: { children: React.ReactNode }) {
  return children
}
