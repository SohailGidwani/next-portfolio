import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Captioning: CNN + Transformer | Sohail Gidwani',
  description: 'CNN/VGG-16 feature extraction with LSTM and Transformer caption generators, compared in an end-to-end pipeline deployed through Streamlit.',
  keywords: ['Image Captioning', 'CNN', 'Transformer', 'VGG-16', 'TensorFlow', 'Streamlit', 'Sohail Gidwani'],
  authors: [{ name: 'Sohail Gidwani', url: 'https://sohailgidwani.app' }],
  alternates: {
    canonical: '/projects/image-captioning',
  },
  openGraph: {
    title: 'Image Captioning: CNN + Transformer | Sohail Gidwani',
    description: 'VGG-16 features with LSTM and Transformer caption generators, deployed through Streamlit.',
    url: 'https://sohailgidwani.app/projects/image-captioning',
    siteName: 'Sohail Gidwani Portfolio',
    images: [
      {
        url: '/api/og?title=Image%20Captioning&description=VGG-16%20features%20with%20LSTM%20and%20Transformer%20caption%20generators&type=project&tags=TensorFlow,CNN,Transformer,VGG-16,Streamlit',
        width: 1200,
        height: 630,
        alt: 'Image Captioning: CNN + Transformer | Sohail Gidwani',
      },
    ],
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Captioning: CNN + Transformer | Sohail Gidwani',
    description: 'CNN/VGG-16 feature extraction with LSTM and Transformer caption generators.',
    images: [
      '/api/og?title=Image%20Captioning&description=VGG-16%20features%20with%20LSTM%20and%20Transformer%20caption%20generators&type=project&tags=TensorFlow,CNN,Transformer,VGG-16,Streamlit',
    ],
    creator: '@sohailgidwani',
  },
}

export default function ImageCaptioningLayout({ children }: { children: React.ReactNode }) {
  return children
}
