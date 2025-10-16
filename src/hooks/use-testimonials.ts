'use client'

import { useState, useEffect } from 'react'

export interface Testimonial {
  id: string
  clientName: string
  displayName: string // Gizli isim (örn: "Ayşe K.")
  rating: number
  content: string
  service: string
  date: string
  avatar: string
  status: 'pending' | 'approved' | 'rejected'
  sessionId?: string
}

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    clientName: 'Ayşe Kaya',
    displayName: 'Ayşe K.',
    rating: 5,
    content: 'Emel hanımla yaptığım duygu temizliği seansları hayatımı tamamen değiştirdi. Yıllardır taşıdığım olumsuz duygulardan kurtuldum ve kendimi çok daha huzurlu hissediyorum.',
    service: 'Yaşam Koçluğu',
    date: '2024-01-15',
    avatar: '👩‍🏫',
    status: 'approved'
  },
  {
    id: '2',
    clientName: 'Mehmet Yılmaz',
    displayName: 'Mehmet Y.',
    rating: 5,
    content: 'Çocukluk travmalarım nedeniyle yaşadığım sorunlar için Emel hanıma başvurdum. Profesyonel yaklaşımı ve etkili teknikleri sayesinde kendimi yeniden keşfettim.',
    service: 'Bilinçaltı Temizliği',
    date: '2024-02-20',
    avatar: '👨‍💼',
    status: 'approved'
  },
  {
    id: '3',
    clientName: 'Zeynep Mert',
    displayName: 'Zeynep M.',
    rating: 5,
    content: 'Yaşam koçluğu seansları sayesinde hedeflerimi netleştirdim ve kariyerimde büyük adımlar attım. Emel hanımın rehberliği paha biçilemez.',
    service: 'Yaşam Koçluğu',
    date: '2024-03-10',
    avatar: '👩‍💻',
    status: 'approved'
  },
  {
    id: '4',
    clientName: 'Ali Rıza',
    displayName: 'Ali R.',
    rating: 5,
    content: 'Holistik koçluk yaklaşımı ile sadece zihinsel değil, ruhsal olarak da büyük bir dönüşüm yaşadım. Kendimi daha dengeli ve mutlu hissediyorum.',
    service: 'Holistik Koçluk',
    date: '2024-03-25',
    avatar: '👨‍⚕️',
    status: 'approved'
  },
  {
    id: '5',
    clientName: 'Fatma Şahin',
    displayName: 'Fatma S.',
    rating: 5,
    content: 'Nefes koçluğu seansları sayesinde stresimi yönetmeyi öğrendim. Günlük hayatımda çok daha sakin ve odaklı hissediyorum.',
    service: 'Nefes Koçluğu',
    date: '2024-04-05',
    avatar: '👩‍🦳',
    status: 'approved'
  },
  {
    id: '6',
    clientName: 'Can Türk',
    displayName: 'Can T.',
    rating: 5,
    content: 'Sınav kaygım ve özgüven eksikliğim için aldığım seanslar sayesinde hem akademik hem de sosyal hayatımda büyük gelişmeler yaşadım.',
    service: 'Yaşam Koçluğu',
    date: '2024-04-18',
    avatar: '👨‍🎓',
    status: 'approved'
  }
]

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // localStorage'dan testimonials'ları yükle
    const savedTestimonials = localStorage.getItem('testimonials')
    if (savedTestimonials) {
      try {
        setTestimonials(JSON.parse(savedTestimonials))
      } catch (error) {
        console.error('Testimonials parse error:', error)
        setTestimonials(defaultTestimonials)
      }
    } else {
      setTestimonials(defaultTestimonials)
    }
  }, [])

  const getApprovedTestimonials = () => {
    return testimonials.filter(t => t.status === 'approved')
  }

  const getPendingTestimonials = () => {
    return testimonials.filter(t => t.status === 'pending')
  }

  const addTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'status' | 'displayName'>) => {
    setIsLoading(true)
    try {
      // İsmi gizle (İlk isim + Soyismin ilk harfi)
      const nameParts = testimonial.clientName.split(' ')
      const displayName = nameParts.length > 1 
        ? `${nameParts[0]} ${nameParts[1].charAt(0)}.`
        : `${nameParts[0]} K.`

      const newTestimonial: Testimonial = {
        ...testimonial,
        id: Date.now().toString(),
        displayName,
        status: 'pending'
      }

      const updatedTestimonials = [...testimonials, newTestimonial]
      setTestimonials(updatedTestimonials)
      localStorage.setItem('testimonials', JSON.stringify(updatedTestimonials))
      
      return { success: true }
    } catch (error) {
      console.error('Add testimonial error:', error)
      return { success: false, error: 'Yorum eklenirken hata oluştu' }
    } finally {
      setIsLoading(false)
    }
  }

  const updateTestimonialStatus = async (id: string, status: 'approved' | 'rejected') => {
    setIsLoading(true)
    try {
      const updatedTestimonials = testimonials.map(t => 
        t.id === id ? { ...t, status } : t
      )
      setTestimonials(updatedTestimonials)
      localStorage.setItem('testimonials', JSON.stringify(updatedTestimonials))
      
      return { success: true }
    } catch (error) {
      console.error('Update testimonial status error:', error)
      return { success: false, error: 'Durum güncellenirken hata oluştu' }
    } finally {
      setIsLoading(false)
    }
  }

  const deleteTestimonial = async (id: string) => {
    setIsLoading(true)
    try {
      const updatedTestimonials = testimonials.filter(t => t.id !== id)
      setTestimonials(updatedTestimonials)
      localStorage.setItem('testimonials', JSON.stringify(updatedTestimonials))
      
      return { success: true }
    } catch (error) {
      console.error('Delete testimonial error:', error)
      return { success: false, error: 'Yorum silinirken hata oluştu' }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    testimonials,
    getApprovedTestimonials,
    getPendingTestimonials,
    addTestimonial,
    updateTestimonialStatus,
    deleteTestimonial,
    isLoading
  }
}