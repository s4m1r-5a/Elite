const dayjs = require('dayjs');
const cron = require('node-cron');
const tasks = require('./tasks');
const utc = require('dayjs/plugin/utc'); // Importa el plugin UTC para trabajar con horas UTC
dayjs.extend(utc);

const dateToCron = dateString => {
  if (isNaN(dateString)) return null; // Retorna null si el valor no es un número válido

  const date = dayjs.unix(dateString); // Crea un objeto Day.js a partir del tiempo Unix

  if (!date.isValid()) return null; // Retorna null si la fecha no es válida

  const minute = date.get('minute');
  const hour = date.get('hour');
  const dayOfMonth = date.get('D');
  const month = date.get('month') + 1; // Los meses en JavaScript van de 0 a 11, así que sumamos 1
  const year = date.get('year');
  const dayOfWeek = '*'; // Para que no importe el día de la semana

  return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
};

class Reminder {
  constructor() {
    this.tasks = [];
  }

  // Método para programar un recordatorio
  async scheduleReminder(date, obj, fnc) {
    const cronDate = await dateToCron(date);

    // Crea una tarea cron
    const task = cron.schedule(
      cronDate,
      () => {
        console.log('esta dentro');
        tasks[fnc](obj);
      },
      {
        scheduled: true,
        timezone: 'America/Bogota'
      }
    );

    console.log(task, 'task');

    // Almacena la tarea en la lista de tareas
    this.tasks.push(task);

    return task;
  }

  // Método para cancelar una tarea programada
  cancelReminder(task) {
    task.stop();
    const index = this.tasks.indexOf(task);
    if (index !== -1) this.tasks.splice(index, 1);
  }
}

module.exports = Reminder;
