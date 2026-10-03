// Flux iCal des blocages manuels (réservations directes), à importer dans Airbnb
// pour que ces dates y soient aussi bloquées. Servi sur /calendar.ics (voir vercel.json).
import { route } from './_lib/http.js';
import { getManual } from './_lib/availability.js';

const compact = (iso) => iso.replaceAll('-', '');
const stamp = () => new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

export default route(['GET'], async (req, res) => {
  const blocks = await getManual();
  const events = blocks.map((block) => [
    'BEGIN:VEVENT',
    `UID:${block.id}@lamaisonnormande`,
    `DTSTAMP:${stamp()}`,
    `DTSTART;VALUE=DATE:${compact(block.start)}`,
    `DTEND;VALUE=DATE:${compact(block.end)}`,
    'SUMMARY:Réservé (site Villa Normande)',
    'END:VEVENT'
  ].join('\r\n'));
  const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Villa Normande//Calendrier//FR', 'CALSCALE:GREGORIAN', ...events, 'END:VCALENDAR', ''].join('\r\n');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=300');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(body);
}, 'calendar');
