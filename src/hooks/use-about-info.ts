'use client'

import { useState, useEffect } from 'react'

export interface AboutInfo {
  name: string
  title: string
  description: string
  photo: string
  experience: string
  clientCount: string
  rating: string
  story: string
  approach: string
  services: string[]
  journey: string
  passion: string
}

const defaultAboutInfo: AboutInfo = {
  name: 'Emel Yeşildere',
  title: 'Duygu Temizliği Uzmanı & Yaşam Koçu',
  description: '3 yıldan fazladır duygu temizliği ve travma iyileştirme alanında çalışan, sertifikalı yaşam koçu ve holistik koçum.',
  photo: '/images/emel-profile.jpg',
  experience: '3+',
  clientCount: '100+',
  rating: '4.9',
  story: 'Benim bu alana olan yolculuğum, kendi yaşadığım zorlu dönemlerle başladı. Duygu temizliği ile tanıştığımda yaşadığım dönüşüm beni çok etkiledi ve bu alanı daha derinlemesine öğrenmek istedim. Kendi iyileşme sürecimde yaşadığım mucizeyi başkalarıyla da paylaşmak, onların da bu değişimi yaşamalarına yardımcı olmak istiyordum.',
  approach: 'Her bireyin benzersiz olduğuna inanıyor ve bu doğrultuda kişiye özel yaklaşımlar geliştiriyorum. Amacım, insanların içlerindeki iyileşme gücünü keşfetmelerine yardımcı olmak ve bilinçaltlarında biriken olumsuz duyguları temizleyerek potansiyellerini ortaya çıkarmak.',
  services: ['Yaşam Koçluğu', 'Holistik Koçluk', 'Nefes Koçluğu', 'Bilinçaltı Temizliği'],
  journey: 'Bu yolculuk sürekli bir öğrenme ve gelişim süreci. Her gün kendimi geliştirmeye, yeni teknikler öğrenmeye ve daha etkili yöntemler keşfetmeye devam ediyorum. Çünkü bu sadece bir meslek değil, bir yaşam tarzı ve tutkum.',
  passion: 'İnsanların mutluluğunu görmek beni en çok mutlu eden şey. Her müşterimle kurduğum bağ, onların yaşadığı pozitif değişimler ve hayatlarında açan çiçekler benim için paha biçilmez. İnsanları seviyorum ve onlara yardım etmek benim için bir ayrıcalık.'
}

export function useAboutInfo() {
  const [aboutInfo, setAboutInfo] = useState<AboutInfo>(defaultAboutInfo)
  const [isLoading, setIsLoading] = useState(false)

  // Gerçek uygulamada bu veriler API'den gelecek
  useEffect(() => {
    // Şimdilik localStorage'dan okuyoruz, ileride API'ye bağlanacak
    const savedInfo = localStorage.getItem('aboutInfo')
    if (savedInfo) {
      try {
        setAboutInfo(JSON.parse(savedInfo))
      } catch (error) {
        console.error('About info parse error:', error)
      }
    }
  }, [])

  const updateAboutInfo = async (newInfo: Partial<AboutInfo>) => {
    console.log('updateAboutInfo çağrıldı:', newInfo)
    setIsLoading(true)
    try {
      const updatedInfo = { ...aboutInfo, ...newInfo }
      console.log('Güncellenmiş bilgiler:', updatedInfo)
      setAboutInfo(updatedInfo)
      localStorage.setItem('aboutInfo', JSON.stringify(updatedInfo))
      console.log('localStorage\'a kaydedildi')
      // Gerçek uygulamada burada API çağrısı yapılacak
      return { success: true }
    } catch (error) {
      console.error('Update about info error:', error)
      return { success: false, error: 'Güncelleme başarısız' }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    aboutInfo,
    updateAboutInfo,
    isLoading
  }
}