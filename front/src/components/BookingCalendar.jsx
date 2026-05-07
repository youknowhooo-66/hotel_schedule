import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';

export default function BookingCalendar({ bookings, onEventClick }) {
  
  // Mapear reservas para o formato do FullCalendar
  const events = bookings.map(booking => {
    // Definir cor baseada no status
    let backgroundColor = '#3b82f6'; // blue-500 (PENDING)
    if (booking.status === 'CONFIRMED') backgroundColor = '#10b981'; // emerald-500
    if (booking.status === 'CANCELLED') backgroundColor = '#ef4444'; // red-500
    if (booking.status === 'CHECKED_IN') backgroundColor = '#8b5cf6'; // violet-500
    if (booking.status === 'CHECKED_OUT') backgroundColor = '#6b7280'; // gray-500

    return {
      id: booking.id.toString(),
      title: `${booking.guestName} - Qto ${booking.room?.number || '?' }`,
      start: booking.checkIn,
      end: booking.checkOut,
      backgroundColor: backgroundColor,
      borderColor: backgroundColor,
      extendedProps: {
        ...booking
      }
    };
  });

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 overflow-hidden calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        locale={ptBrLocale}
        events={events}
        eventClick={(info) => onEventClick && onEventClick(info.event.extendedProps)}
        height="700px"
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false
        }}
        dayMaxEvents={true}
        themeSystem="standard"
      />
      
      {/* Legenda de Cores */}
      <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-gray-500 border-t pt-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Pendente</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span>Confirmada</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-violet-500"></div>
          <span>Hóspede no Hotel</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
          <span>Finalizada</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Cancelada</span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .fc { --fc-border-color: #f3f4f6; --fc-button-bg-color: #3b82f6; --fc-button-border-color: #3b82f6; --fc-button-hover-bg-color: #2563eb; --fc-button-active-bg-color: #1d4ed8; }
        .fc .fc-toolbar-title { font-size: 1.25rem; font-weight: 700; color: #111827; }
        .fc .fc-col-header-cell { background: #f9fafb; padding: 12px 0; font-weight: 600; color: #4b5563; }
        .fc .fc-daygrid-day-number { color: #6b7280; font-weight: 500; padding: 8px; }
        .fc .fc-event { border-radius: 6px; padding: 2px 4px; font-size: 0.85rem; cursor: pointer; transition: transform 0.1s; border: none !important; }
        .fc .fc-event:hover { transform: scale(1.02); }
        .fc .fc-button { border-radius: 10px; font-weight: 600; text-transform: capitalize; }
        .fc-theme-standard td, .fc-theme-standard th { border: 1px solid #f3f4f6 !important; }
      `}} />
    </div>
  );
}
