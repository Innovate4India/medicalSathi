'use client'

import { AdminDashboard } from '@/components/admin-dashboard'
import { DoctorDashboard } from '@/components/doctor-dashboard'
import { DonorDashboard } from '@/components/donor-dashboard'
import { HospitalDashboard } from '@/components/hospital-dashboard'
import { PatientDashboard } from '@/components/patient-dashboard'

type DashboardRole = 'patient' | 'doctor' | 'hospital' | 'donor' | 'admin'

export function DashboardPreview({ role }: { role: DashboardRole }) {
  switch (role) {
    case 'patient':
      return <PatientDashboard />
    case 'doctor':
      return <DoctorDashboard />
    case 'hospital':
      return <HospitalDashboard />
    case 'donor':
      return <DonorDashboard />
    case 'admin':
      return <AdminDashboard />
  }
}
