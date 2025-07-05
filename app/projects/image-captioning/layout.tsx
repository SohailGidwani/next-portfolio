import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Feature Detection & Captioning - Sohail Gidwani',
  description: 'An AI-powered system that automatically generates descriptive captions for images using advanced deep learning models. Features CNN, VGG-16, LSTM, and Transformer architectures.',
  keywords: 'Image Captioning, AI, Machine Learning, CNN, VGG-16, LSTM, Transformer, TensorFlow, Python, Computer Vision, NLP',
  openGraph: {
    title: 'Image Feature Detection & Captioning - Sohail Gidwani',
    description: 'An AI-powered system that automatically generates descriptive captions for images using advanced deep learning models.',
    url: 'https://portfolio-sohail-gidwanis-projects.vercel.app/projects/image-captioning',
    siteName: 'Sohail Gidwani Portfolio',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Image Captioning Project',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Feature Detection & Captioning - Sohail Gidwani',
    description: 'An AI-powered system that automatically generates descriptive captions for images using advanced deep learning models.',
    images: ['/api/og'],
    creator: '@sohailgidwani',
  },
}

export default function ImageCaptioningLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 