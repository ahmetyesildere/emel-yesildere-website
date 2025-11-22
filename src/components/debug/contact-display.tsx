'use client'

import React from 'react'
import { useContactInfo } from '@/hooks/use-contact-info'

const ContactDisplay = () => {
  const { contactInfo, isLoading, updateContactInfo } = useContactInfo()

  const testUpdate = () => {
    const newPhone = '+90 555 ' + Math.floor(Math.random() * 1000) + ' ' + Math.floor(Math.random() * 1000)
    updateContactInfo({ phone: newPhone })
  }

  if (isLoading) {
    return <div className="p-4 bg-yellow-100 rounded">Yükleniyor...</div>
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4">Mevcut İletişim Bilgileri</h3>
      
      <div className="space-y-2 mb-4">
        <p><strong>Telefon:</strong> {contactInfo.phone}</p>
        <p><strong>E-posta:</strong> {contactInfo.email}</p>
        <p><strong>WhatsApp:</strong> {contactInfo.whatsapp}</p>
        <p><strong>Adres:</strong> {contactInfo.address}</p>
        <p><strong>Çalışma Saatleri:</strong></p>
        <ul className="ml-4">
          <li>Hafta içi: {contactInfo.workingHours.weekdays}</li>
          <li>Cumartesi: {contactInfo.workingHours.saturday}</li>
          <li>Pazar: {contactInfo.workingHours.sunday}</li>
        </ul>
      </div>

      <button
        onClick={testUpdate}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Test Güncelleme (Rastgele Telefon)
      </button>
    </div>
  )
}

export default ContactDisplay