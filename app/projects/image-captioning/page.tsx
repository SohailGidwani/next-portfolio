"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"
import { Github, ArrowLeft, ExternalLink, Code, Brain, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import imagecaption from '@/public/images/BE-Project.jpg'
import ProjectSkeleton from "@/app/components/ProjectSkeleton"
import ProjectDetailStructuredData from "@/app/components/ProjectDetailStructuredData"

export default function ImageCaptioningPage() {
  const project = {
    title: "Image Feature Detection & Captioning",
    description: "Trained a CNN + Transformer pipeline that generates captions for images. The Transformer model scored 0.80 BLEU. Built a Streamlit UI so you can try it yourself.",
    longDescription: `I wanted to build something that could look at an image and describe what's in it. The idea was straightforward, but getting it to actually work well took some effort.

I used VGG-16 as the image encoder to extract feature vectors, then fed those into two different decoders: an LSTM and a Transformer. The LSTM got a BLEU score of 0.65, which was decent, but the Transformer with attention hit 0.80 and generated noticeably better captions. The attention mechanism really helped the model focus on the right parts of the image.

I wrapped the whole thing in a Streamlit app so you can upload any image and get a caption back in a few seconds. It's a simple UI, but it makes the model feel real instead of just numbers in a notebook.

The hardest part was honestly the training pipeline. VGG-16 is memory-hungry, the Transformer needed careful hyperparameter tuning, and I spent more time on data preprocessing than I'd like to admit.`,
    image: imagecaption,
    tags: ["Python", "TensorFlow", "CNN", "Transformer", "LSTM", "StreamLit", "Computer Vision", "NLP"],
    github: "https://github.com/SohailGidwani/Image-Caption",
    features: [
      {
        icon: <Brain className="w-6 h-6" />,
        title: "Advanced AI Models",
        description: "VGG-16 for image feature extraction, then LSTM and Transformer decoders for generating captions"
      },
      {
        icon: <Zap className="w-6 h-6" />,
        title: "High Performance",
        description: "LSTM hit 0.65 BLEU, Transformer got 0.80. The attention mechanism made a real difference"
      },
      {
        icon: <Code className="w-6 h-6" />,
        title: "User-Friendly Interface",
        description: "Streamlit app where you upload an image and get a caption back in seconds"
      },
      {
        icon: <ExternalLink className="w-6 h-6" />,
        title: "Real-time Processing",
        description: "Tuned the pipeline so inference runs fast enough to feel instant"
      }
    ],
    technicalDetails: [
      "CNN and VGG-16 for pulling features out of images",
      "LSTM decoder with attention",
      "Transformer decoder that outperformed the LSTM by 15 BLEU points",
      "Evaluated with BLEU scores across both architectures",
      "Streamlit frontend for uploading images and viewing captions",
      "Image preprocessing and augmentation during training",
      "Model optimization to keep inference time reasonable"
    ],
    challenges: [
      "The Transformer gave better captions but was noticeably slower, had to find the right size/speed tradeoff",
      "The model struggled with unusual image compositions that weren't well represented in training data",
      "Getting BLEU above 0.70 on the LSTM took a lot of hyperparameter tuning before I switched to the Transformer",
      "Making the Streamlit UI responsive enough that it didn't feel like you were waiting forever",
      "VGG-16 is memory-hungry, had to be strategic about batch sizes during training"
    ],
    learnings: [
      "Transformers really do outperform LSTMs on sequence tasks once you get the training right",
      "Connecting a vision encoder to a language decoder is tricky, the feature vector interface matters a lot",
      "Attention maps are useful for debugging, not just for boosting scores",
      "Even a simple Streamlit UI makes a model way more convincing in a demo",
      "BLEU is a useful metric but doesn't always match how good a caption actually reads"
    ]
  }

  return (
    <>
      <ProjectDetailStructuredData
        title={project.title}
        description={project.description}
        slug="image-captioning"
        image="/images/BE-Project.jpg"
        keywords={project.tags}
        github={project.github}
      />
      <Suspense fallback={<ProjectSkeleton />}>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
          <div className="py-20">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto"
              >
                <Link 
                  href="/projects" 
                  className="inline-flex items-center text-xs font-body font-medium uppercase tracking-[0.2em] text-white/40 hover:text-white mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Projects
                </Link>
                
                <h1 className="font-display italic text-4xl md:text-6xl mb-6 text-white">
                  {project.title}
                </h1>
                
                <p className="font-body text-base text-white/35 mb-8">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-0.5 font-mono text-[10px] text-white/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Project Content */}
          <div className="py-20">
            <div className="container mx-auto">
              <div className="max-w-4xl mx-auto">
                {/* Hero Image */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-12"
                >
                  <div className="relative h-96 rounded-2xl overflow-hidden glass">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 800px"
                      priority
                    />
                  </div>
                </motion.div>

                {/* Detailed Description */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mb-12"
                >
                  <h2 className="font-display italic text-3xl mb-6 text-white">
                    Project Overview
                  </h2>
                  <div className="max-w-none">
                    <p className="font-body text-sm text-white/35 leading-relaxed whitespace-pre-line">
                      {project.longDescription}
                    </p>
                  </div>
                </motion.div>

                {/* Key Features */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mb-12"
                >
                  <h2 className="font-display italic text-3xl mb-8 text-white">
                    Key Features
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    {project.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                        className="p-6 glass rounded-xl transition"
                      >
                        <div className="flex items-center mb-4">
                          <div className="p-2 bg-white/[0.05] rounded-lg mr-4 text-white/40">
                            {feature.icon}
                          </div>
                          <h3 className="font-display italic text-xl text-white">
                            {feature.title}
                          </h3>
                        </div>
                        <p className="font-body text-sm text-white/30">
                          {feature.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Technical Details */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="mb-12"
                >
                  <h2 className="font-display italic text-3xl mb-6 text-white">
                    Technical Implementation
                  </h2>
                  <div className="glass rounded-xl p-6">
                    <ul className="space-y-3">
                      {project.technicalDetails.map((detail, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-white/20 rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span className="font-body text-sm text-white/35">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                {/* Challenges & Learnings */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="mb-12"
                >
                  <div className="grid gap-8 md:grid-cols-2">
                    <div>
                      <h3 className="font-display italic text-2xl mb-4 text-white">
                        Challenges Faced
                      </h3>
                      <ul className="space-y-3">
                        {project.challenges.map((challenge, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-white/15 rounded-full mt-2 mr-3 flex-shrink-0" />
                            <span className="font-body text-sm text-white/30">{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-display italic text-2xl mb-4 text-white">
                        Key Learnings
                      </h3>
                      <ul className="space-y-3">
                        {project.learnings.map((learning, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-white/20 rounded-full mt-2 mr-3 flex-shrink-0" />
                            <span className="font-body text-sm text-white/35">{learning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.05] px-8 py-3 font-body text-sm font-medium text-white transition hover:bg-white/[0.1]"
                  >
                    <Github className="mr-2 h-5 w-5" />
                    View Source Code
                  </a>
                  <Link
                    href="/projects"
                    className="inline-flex items-center justify-center rounded-full border border-white/[0.06] px-8 py-3 font-body text-sm text-white/40 transition hover:text-white/60 hover:border-white/[0.12]"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to Projects
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
      </div>
      </Suspense>
    </>
  )
}
