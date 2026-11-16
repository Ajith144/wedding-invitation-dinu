import couplePortrait from '../photos/de055bc7-f249-4849-9e21-5af6d77b4635.jpeg';
import coupleSelfie from '../photos/b2168e5d-565e-408d-9e68-5e3db1261189.jpeg';

const venue = 'Karthik Kalyana Mantapa';
const venueAddress = 'Rudraswamy Temple Street, Gavipuram, Bengaluru, Karnataka 560019';
const mapQuery = new URLSearchParams({ query: `${venue}, ${venueAddress}` });

export const wedding = {
  couple: 'Diwakar S & Shwetha G',
  groom: { name: 'Diwakar S', father: '', mother: '' },
  bride: { name: 'Shwetha G', father: '', mother: '' },
  invitationMessage: 'With the blessings of our families, we joyfully invite you to celebrate our wedding. Please join us for an evening of celebration and the auspicious muhurtham the following morning. Your presence, love, and blessings will make our special day complete.',
  familyDetails: [],
  venue,
  venueAddress,
  venueArea: 'Rudraswamy Temple Street, Gavipuram, Bengaluru 560019',
  mapUrl: `https://www.google.com/maps/search/?api=1&${mapQuery.toString()}`,
  description: 'Together with our families, we invite you to celebrate the beginning of our forever.',
  events: [
    {
      id: 'reception-2026',
      name: 'Reception',
      label: 'Saturday evening',
      dateLabel: 'Saturday 28 November 2026',
      timeLabel: '6:30 PM onwards',
      start: '2026-11-28T18:30:00+05:30',
      end: '2026-11-28T23:59:00+05:30',
      startLocal: '20261128T183000',
      endLocal: '20261128T235900',
      venue,
      image: couplePortrait,
      imageAlt: 'Diwakar and Shwetha together in wedding attire',
    },
    {
      id: 'muhurtham-2026',
      name: 'Muhurtham',
      label: 'Sunday morning',
      dateLabel: 'Sunday 29 November 2026',
      timeLabel: '6:40-7:40 AM IST',
      start: '2026-11-29T06:40:00+05:30',
      end: '2026-11-29T07:40:00+05:30',
      startLocal: '20261129T064000',
      endLocal: '20261129T074000',
      venue,
      image: coupleSelfie,
      imageAlt: 'Diwakar and Shwetha smiling together outdoors',
    },
  ],
  photos: [
    {
      id: 'couple-portrait',
      title: 'Frames of Love',
      caption: 'A few favorite moments from Diwakar and Shwetha’s journey.',
      alt: 'Diwakar and Shwetha together in wedding attire',
      src: couplePortrait,
    },
  ],
};