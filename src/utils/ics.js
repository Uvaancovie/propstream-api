import ics from 'ics';

export function buildICS({ title = 'Propstream Calendar', events = [] }) {
  return new Promise((resolve, reject) => {
    ics.createEvents(
      events.map((e) => ({
        title: e.title || 'Booking',
        description: e.description || '',
        start: [e.start.getFullYear(), e.start.getMonth() + 1, e.start.getDate(), e.start.getHours(), e.start.getMinutes()],
        end: [e.end.getFullYear(), e.end.getMonth() + 1, e.end.getDate(), e.end.getHours(), e.end.getMinutes()],
        status: 'CONFIRMED',
        calName: title,
      })),
      (error, value) => {
        if (error) return reject(error);
        resolve(value);
      }
    );
  });
}
