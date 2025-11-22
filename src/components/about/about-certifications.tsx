'use client'

import React from 'react'
import { Award, BookOpen, CheckCircle, Calendar, ExternalLink, Download, Star, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const AboutCertifications = () => {
  const certifications = [
    {
      title: 'Duygu Temizliği Uzmanı Sertifikası',
      institution: 'International EFT Association',
      year: '2017',
      level: 'Uzman',
      description: 'EFT ve duygu temizliği tekniklerinde ileri seviye uzmanlık sertifikası',
      skills: ['EFT Teknikleri', 'Matrix Reimprinting', 'Travma Temizliği'],
      status: 'active',
      credentialId: 'IEA-2017-EY-001'
    },
    {
      title: 'Travma İyileştirme Sertifikası',
      institution: 'European Trauma Institute',
      year: '2018',
      level: 'Sertifikalı Uzman',
      description: 'Travma iyileştirme ve EMDR tekniklerinde uzmanlık',
      skills: ['EMDR Teknikleri', 'Somatic Experiencing', 'Travma Terapisi'],
      status: 'active',
      credentialId: 'ETI-2018-TH-045'
    },
    {
      title: 'Yaşam Koçluğu Sertifikası',
      institution: 'International Coach Federation (ICF)',
      year: '2019',
      level: 'ACC (Associate Certified Coach)',
      description: 'ICF standartlarında yaşam koçluğu sertifikası',
      skills: ['Life Coaching', 'Goal Setting', 'Motivational Interviewing'],
      status: 'active',
      credentialId: 'ICF-2019-ACC-789'
    },
    {
      title: 'Holistik Koçluk Sertifikası',
      institution: 'Holistic Health Institute',
      year: '2020',
      level: 'Sertifikalı Holistik Koç',
      description: 'Bütüncül sağlık ve iyileşme yaklaşımları',
      skills: ['Energy Healing', 'Chakra Balancing', 'Holistic Wellness'],
      status: 'active',
      credentialId: 'HHI-2020-HC-156'
    },
    {
      title: 'NLP Practitioner Sertifikası',
      institution: 'NLP University',
      year: '2021',
      level: 'Practitioner',
      description: 'Neuro-Linguistic Programming teknikleri',
      skills: ['NLP Teknikleri', 'Anchoring', 'Reframing'],
      status: 'active',
      credentialId: 'NLPU-2021-PR-234'
    },
    {
      title: 'Mindfulness Eğitmeni Sertifikası',
      institution: 'Mindfulness Institute',
      year: '2022',
      level: 'Sertifikalı Eğitmen',
      description: 'Farkındalık temelli stres azaltma ve meditasyon',
      skills: ['MBSR', 'Meditation', 'Mindful Coaching'],
      status: 'active',
      credentialId: 'MI-2022-IT-067'
    }
  ]

  const continuingEducation = [
    {
      title: 'İleri Travma Terapisi Eğitimi',
      year: '2023',
      hours: '40 saat',
      provider: 'Trauma Research Foundation'
    },
    {
      title: 'Enerji Psikolojisi Semineri',
      year: '2023',
      hours: '24 saat',
      provider: 'Energy Psychology Association'
    },
    {
      title: 'Online Koçluk Teknikleri',
      year: '2024',
      hours: '16 saat',
      provider: 'Digital Coaching Institute'
    },
    {
      title: 'Çocuk ve Ergen Travma Iyileştirme',
      year: '2024',
      hours: '32 saat',
      provider: 'Child Trauma Institute'
    }
  ]

  const memberships = [
    {
      organization: 'International Coach Federation (ICF)',
      role: 'Associate Member',
      since: '2019',
      benefits: ['Sürekli eğitim', 'Etik standartlar', 'Profesyonel ağ']
    },
    {
      organization: 'European EFT Association',
      role: 'Certified Member',
      since: '2017',
      benefits: ['Teknik güncellemeler', 'Araştırma erişimi', 'Peer support']
    },
    {
      organization: 'Türkiye Yaşam Koçları Derneği',
      role: 'Aktif Üye',
      since: '2020',
      benefits: ['Yerel ağ', 'Sürekli gelişim', 'Etik rehberlik']
    }
  ]

  const achievements = [
    {
      title: 'Yılın Yaşam Koçu Ödülü',
      year: '2023',
      organization: 'Türkiye Koçluk Federasyonu',
      description: 'Müşteri memnuniyeti ve başarı oranı ile'
    },
    {
      title: 'Üstün Hizmet Sertifikası',
      year: '2022',
      organization: 'International EFT Association',
      description: 'EFT alanındaki katkılar için'
    },
    {
      title: 'Toplum Hizmeti Ödülü',
      year: '2021',
      organization: 'Belediye Başkanlığı',
      description: 'Ücretsiz toplum hizmetleri için'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            Sertifikalar & Eğitimler
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
              Profesyonel Yetkinliklerim
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Sürekli gelişim ve uzmanlaşma anlayışıyla aldığım sertifikalar, 
            eğitimler ve profesyonel üyeliklerim.
          </p>
        </div>

        {/* Main Certifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {certifications.map((cert, index) => (
            <Card key={index} className="p-6 bg-white hover:shadow-lg transition-shadow border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{cert.title}</h3>
                    <p className="text-purple-600 font-medium">{cert.institution}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-2">
                    {cert.year}
                  </Badge>
                  <div className="text-sm text-gray-600">{cert.level}</div>
                </div>
              </div>

              <p className="text-gray-600 mb-4 leading-relaxed">{cert.description}</p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Kazanılan Yetenekler:</h4>
                  <div className="flex flex-wrap gap-2">
                    {cert.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">Aktif Sertifika</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {cert.credentialId}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Continuing Education */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Sürekli Eğitim</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {continuingEducation.map((edu, index) => (
              <Card key={index} className="p-6 bg-white hover:shadow-lg transition-shadow border border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{edu.title}</h4>
                    <p className="text-gray-600 text-sm mb-2">{edu.provider}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{edu.year}</span>
                      </div>
                      <div>{edu.hours}</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Professional Memberships */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Profesyonel Üyelikler</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {memberships.map((membership, index) => (
              <Card key={index} className="p-6 bg-white hover:shadow-lg transition-shadow border border-gray-200">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{membership.organization}</h4>
                  <p className="text-purple-600 text-sm">{membership.role}</p>
                  <p className="text-gray-500 text-xs">Üye: {membership.since}</p>
                </div>

                <div className="space-y-2">
                  {membership.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Awards & Achievements */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Ödüller & Başarılar</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="p-6 bg-white hover:shadow-lg transition-shadow border border-gray-200 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{achievement.title}</h4>
                <p className="text-purple-600 text-sm mb-1">{achievement.organization}</p>
                <p className="text-gray-500 text-xs mb-3">{achievement.year}</p>
                <p className="text-gray-600 text-sm">{achievement.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Verification */}
        <Card className="p-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Sertifika Doğrulama</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Tüm sertifikalarım ve eğitimlerim ilgili kurumlar tarafından doğrulanabilir. 
            Şeffaflık ve güven bizim için çok önemlidir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
              <ExternalLink className="w-4 h-4 mr-2" />
              Sertifikaları Doğrula
            </Button>
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
              <Download className="w-4 h-4 mr-2" />
              CV İndir
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}

export default AboutCertifications