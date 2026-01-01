import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Feature Detection & Captioning - Sohail Gidwani',
  description: 'An AI-powered system that automatically generates descriptive captions for images using advanced deep learning models. Features CNN, VGG-16, LSTM, and Transformer architectures.',
  keywords: 'Image Captioning, AI, Machine Learning, CNN, VGG-16, LSTM, Transformer, TensorFlow, Python, Computer Vision, NLP',
  alternates: {
    canonical: '/projects/image-captioning',
  },
  authors: [{ name: 'Sohail Gidwani', url: 'https://sohailgidwani.app' }],
  creator: 'Sohail Gidwani',
  publisher: 'Sohail Gidwani',
  openGraph: {
    title: 'Image Feature Detection & Captioning - Sohail Gidwani',
    description: 'An AI-powered system that automatically generates descriptive captions for images using advanced deep learning models.',
    url: 'https://sohailgidwani.app/projects/image-captioning',
    siteName: 'Sohail Gidwani Portfolio',
    images: [
      {
        url: '/api/og?title=Image%20Captioning&description=CNN%20%2B%20Transformer%20pipeline%20for%20feature%20extraction%20and%20caption%20generation&type=project&tags=TensorFlow,CNN,Transformer,VGG-16',
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
    images: ['/api/og?title=Image%20Captioning&description=CNN%20%2B%20Transformer%20pipeline%20for%20feature%20extraction%20and%20caption%20generation&type=project&tags=TensorFlow,CNN,Transformer,VGG-16'],
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
