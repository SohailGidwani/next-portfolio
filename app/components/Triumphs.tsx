"use client"

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Award } from 'lucide-react'
import Carousel from './Carousel'
import AskPandaAI from "@/public/images/AskPandaAI-Certificate.jpg"
import fullstack from "@/public/images/0-100 Full stack dev course.png"
import ctc from "@/public/images/crack_the_code_JaiHind.jpg"
import feynwick from "@/public/images/FeynwickCertificate.jpg"
import rubix from "@/public/images/Rubix-hackathon.png"
import techathon from "@/public/images/Tech-a-thon-IIFL.jpg"
import trident from "@/public/images/Trident_Tsec.jpg"

interface TriumphsProps {
  setActiveSection: (section: string) => void;
}

export default function Triumphs({ setActiveSection }: TriumphsProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setActiveSection('triumphs')
        }
      },
      { threshold: 0.5 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [setActiveSection])

  const certificates = [
    {
      title: "Certificate Of Achievement - AskPandaAI",
      issuer: "CTO | IIFL Finance Ltd",
      date: "Jun 13th, 2024",
      description: "Designed and implemented NLP-powered chatbot for real-time internal employee access to financial data, improving employee support efficiency. Used: Python, Flask, Qdrant(VectorDB), Azure-OpenAI-service, Blob storage,PostgreSQL, Zoho ticketing service, ReactJS.",
      image: AskPandaAI
    },
    {
      title: "0-100 Full Stack Web Development Course",
      issuer: "Harkirat Singh",
      date: "Apr 2024",
      description: "Mastered full-stack web development, including frontend frameworks, backend architecture, databases, DevOps practices, and cloud deployment.",
      image: fullstack
    },
    {
      title: "Tech-a-thon (Hackathon)",
      issuer: "IIFL",
      date: "Oct 6th & 7th, 2023",
      description: "Won 1st prize for making AI-powered Customer support chatbot",
      image: techathon
    },
    {
      title: "Feynwick Certificate",
      issuer: "CSI - KJSIEIT",
      date: "April 24th, 2021",
      description: "Participated in an Inter-College code contest, brushing up DSA skills.",
      image: feynwick
    },
    {
      title: "Rubix-Hackathon",
      issuer: "CSI - TSEC",
      date: "Jan 18th - 20th , 2022",
      description: "Participated in Intra-College Hacakthon, creating a Healthcare & consulation web app, using MERN stack.",
      image: rubix
    },
    {
      title: "Trident",
      issuer: "Code Cell - TSEC",
      date: "Sept 28, 2019",
      description: "Participated in a code event which had 3 rounds, 1.Blind-code, 2.Pattern problem & 3.Complexity based.",
      image: trident
    },
    {
      title: "Crack-The-Code",
      issuer: "Dot Com Club, Jai Hind College",
      date: "Nov, 2017",
      description: "Won 2nd prize at a coding contest in my 11th grade.",
      image: ctc
    }
  ]

  const certificateCards = certificates.map((cert, index) => (
    <Card key={index} className="w-full flex flex-col md:flex-row dark:bg-gray-700 overflow-hidden shadow-lg">
      <div className="md:w-1/2">
        <Image
          src={cert.image}
          alt={cert.title}
          width={400}
          height={300}
          className="w-full h-64 md:h-full object-cover"
        />
      </div>
      <div className="md:w-1/2 flex flex-col p-6">
        <CardHeader className="flex-shrink-0 p-0 mb-4">
          <CardTitle className="text-2xl md:text-3xl flex items-center text-blue-900 dark:text-blue-400">
            <Award className="mr-2 h-6 w-6 md:h-8 md:w-8 text-blue-600 dark:text-blue-400" />
            {cert.title}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300 text-base md:text-lg mt-2">{cert.issuer} - {cert.date}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto p-0">
          <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg">{cert.description}</p>
        </CardContent>
      </div>
    </Card>
  ))

  return (
    <section id="triumphs" ref={sectionRef} className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center text-blue-900 dark:text-blue-400">Triumphs & Certifications</h2>
        <Carousel items={certificateCards} />
      </div>
    </section>
  )
}