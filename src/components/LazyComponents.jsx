import { lazy } from 'react';

// Lazy load sections for better performance
export const Services = lazy(() => import('./Sections/Services'));
export const Capabilities = lazy(() => import('./Sections/Capabilities'));
export const ClientSpeak = lazy(() => import('./Sections/ClientSpeak'));
export const Contact = lazy(() => import('./Sections/Contact'));