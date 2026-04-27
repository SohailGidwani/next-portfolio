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
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'Image Captioning Project' }],
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Captioning: CNN + Transformer (0.80 BLEU) | Sohail Gidwani',
    description: 'CNN/VGG-16 + Transformer pipeline. 0.80 BLEU, 23% above LSTM baseline.',
    images: ['/api/og'],
    creator: '@sohailgidwani',
  },
}

export default function ImageCaptioningLayout({ children }: { children: React.ReactNode }) {
  return children
}
