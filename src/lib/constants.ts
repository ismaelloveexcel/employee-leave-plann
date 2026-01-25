import { PublicHoliday } from './types';

export const UAE_PUBLIC_HOLIDAYS_2026: PublicHoliday[] = [
  { date: '2026-01-01', name: "New Year's Day", type: 'fixed' },
  { date: '2026-03-21', name: "Isra and Mi'raj (estimated)", type: 'islamic' },
  { date: '2026-05-23', name: 'Eid al-Fitr (estimated)', type: 'islamic' },
  { date: '2026-05-24', name: 'Eid al-Fitr (estimated)', type: 'islamic' },
  { date: '2026-05-25', name: 'Eid al-Fitr (estimated)', type: 'islamic' },
  { date: '2026-06-15', name: 'Arafat Day (estimated)', type: 'islamic' },
  { date: '2026-07-30', name: 'Eid al-Adha (estimated)', type: 'islamic' },
  { date: '2026-07-31', name: 'Eid al-Adha (estimated)', type: 'islamic' },
  { date: '2026-08-01', name: 'Eid al-Adha (estimated)', type: 'islamic' },
  { date: '2026-08-20', name: 'Islamic New Year (estimated)', type: 'islamic' },
  { date: '2026-10-29', name: "Prophet Muhammad's Birthday (estimated)", type: 'islamic' },
  { date: '2026-12-02', name: 'Commemoration Day', type: 'fixed' },
  { date: '2026-12-03', name: 'National Day', type: 'fixed' },
];

export const LEAVE_TYPES = [
  { value: 'annual', label: 'Annual Leave' },
  { value: 'sick', label: 'Sick Leave' },
  { value: 'emergency', label: 'Emergency Leave' },
] as const;
